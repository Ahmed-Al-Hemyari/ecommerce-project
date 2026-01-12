<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderItemResource;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Shipping;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    public function getAllOrders(Request $request) {
        $filters = $request->only(['search', 'status', 'paid']);
        // Pagination
        $limit = min($request->input('limit', 50), 150);

        $orders = Order::with([
            'user' => function ($q) { $q->withTrashed(); },
            'shipping',
            'orderItems.product' => function ($q) { $q->withTrashed(); }
        ])->filter($filters)->paginate($limit);

        return response()->json([
            'orders' => OrderResource::collection($orders),
            'currentPage' => $orders->currentPage(),
            'totalItems' => $orders->total(),
            'totalPages' => $orders->lastPage()
        ], 200);
    }
    
    public function getOrdersForUser(Request $request) {
        $user = $request->user();

        $orders = Order::with(['shipping', 'orderItems.product'])
            ->where('user_id', $user->id)->whereNot('status', 'draft')->latest()->get();

        return response()->json([
            'orders' => OrderResource::collection($orders),
        ], 200);
    }

    public function getOrderById($id) {

        $order = Order::with(['user', 'shipping', 'orderItems.product'])->find($id);

        if (!$order) {
            return response()->json([
                'message' => 'Order not found'
            ], 404);
        }

        return response()->json([
            'order' => new OrderResource($order)
        ], 200);
    }

    public function createOrder(Request $request)
    {
        $data = $request->validate([
            'user' => ['required', 'exists:users,id'],
            'shipping' => ['required', 'exists:shippings,id'],
            'paymentMethod' => ['required', Rule::in(['credit', 'paypal', 'cod'])],
            'shippingCost' => ['required', 'numeric', 'min:0'],
        ]);

        $formattedData = [
            'user_id' => $data['user'],
            'shipping_id' => $data['shipping'],
            'payment_method' => $data['paymentMethod'],
            'shipping_cost' => $data['shippingCost']
        ];

        // Ensure shipping belongs to user
        $shipping = Shipping::where('id', $formattedData['shipping_id'])
            ->where('user_id', $formattedData['user_id'])
            ->firstOrFail();

        $order = Order::create([
            'user_id' => $formattedData['user_id'],
            'shipping_id' => $shipping->id,
            'payment_method' => $formattedData['payment_method'],
            'shipping_cost' => $formattedData['shipping_cost'],
            'subtotal' => 0,
            'status' => 'draft',
        ]);

        return response()->json([
            'message' => 'Order created successfully',
            'order' => new OrderResource($order->load('shipping')),
        ], 201);
    }

    public function createOrderFromCart(Request $request)
    {
        $data = $request->validate([
            'user' => ['required', 'exists:users,id'],
            'shipping' => ['required', 'exists:shippings,id'],
            'paymentMethod' => ['required', Rule::in(['credit', 'paypal', 'cod'])],
            'cart' => ['required', 'array'],
            'cart.*.product' => ['required', 'exists:products,id'],
            'cart.*.quantity' => ['required', 'integer', 'min:1'],
        ]);

        return DB::transaction(function () use ($data) {

            $order = Order::create([
                'user_id' => $data['user'],
                'shipping_id' => $data['shipping'],
                'payment_method' => $data['paymentMethod'],
                'subtotal' => 0,
                'shipping_cost' => 5,
                'status' => 'draft',
            ]);

            foreach ($data['cart'] as $item) {

                $product = Product::find($item['product']);

                if (!$product || $item['quantity'] > $product->stock) {
                    continue;
                }

                $existingItem = $order->orderItems()
                    ->where('product_id', $product->id)
                    ->first();

                if ($existingItem) {
                    $existingItem->product->increment('stock', $existingItem->quantity);
                    $existingItem->delete();
                }

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                ]);

                $product->decrement('stock', $item['quantity']);

                $order->subtotal += $item['quantity'] * $product->price;
            }

            $order->update(['status' => 'pending']);

            return response()->json([
                'message' => 'Order created successfully',
                'order' => new OrderResource(
                    $order->load([
                        'orderItems.product',
                        'shipping',
                        'user',
                    ])
                ),
            ], 201);
        });

    }

    public function updateOrder(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        if ($order->status !== 'draft') {
            return response()->json([
                'message' => 'Cannot update a finalized order'
            ], 422);
        }

        $data = $request->validate([
            'user' => ['sometimes', 'exists:users,id'],
            'shipping' => ['sometimes', 'exists:shippings,id'],
            'paymentMethod' => ['sometimes', Rule::in(['credit', 'paypal', 'cod'])],
            'shippingCost' => ['sometimes', 'numeric', 'min:0'],
        ]);

        $formattedData = [
            'user_id' => $data['user'],
            'shipping_id' => $data['shipping'],
            'payment_method' => $data['paymentMethod'],
            'shipping_cost' => $data['shippingCost']
        ];

        $newUserId = $formattedData['user_id'] ?? $order->user_id;

        // If shipping is being changed, verify ownership
        if (isset($formattedData['shipping_id'])) {
            Shipping::where('id', $formattedData['shipping_id'])
                ->where('user_id', $newUserId)
                ->firstOrFail();
        }

        $order->update($formattedData);

        return response()->json([
            'message' => 'Order updated successfully',
            'order' => new OrderResource($order->load('shipping')),
        ]);
    }

    public function updateMany(Request $request)
    {
        $ids = $this->validateIds($request);

        $credentials = $request->validate([
            'updates.status' => ['sometimes', Rule::in([
                'pending', 'processing', 'shipped', 'delivered', 'cancelled'
            ])],
            'updates.paid' => ['sometimes', 'boolean'],
        ]);

        $updates = [
            'status' => Arr::get($credentials, 'updates.status'),
            'is_paid' => Arr::get($credentials, 'updates.paid'),
        ];

        // remove nulls
        $updates = array_filter($updates, fn ($value) => !is_null($value));

        if (empty($updates)) {
            return response()->json([
                'message' => 'No data provided for update',
            ], 422);
        }

        return DB::transaction(function () use ($ids, $updates) {

            $orders = Order::with('orderItems.product')
                ->whereIn('id', $ids)
                ->lockForUpdate()
                ->get();

            foreach ($orders as $order) {

                // ✅ Restore stock ONLY when cancelling
                if (
                    array_key_exists('status', $updates) &&
                    $updates['status'] === 'cancelled' &&
                    $order->status !== 'cancelled' &&
                    $order->status !== 'shipped'
                ) {
                    foreach ($order->orderItems as $item) {
                        $item->product->increment('stock', $item->quantity);
                    }
                }

                // Handle paid_at automatically
                if (array_key_exists('is_paid', $updates)) {
                    $order->paid_at = $updates['is_paid'] ? now() : null;
                }

                $order->update($updates);
            }

            return response()->json([
                'message' => 'Orders updated successfully',
            ]);
        });
    }


    public function hardDelete(Request $request)
    {
        $ids = $this->validateIds($request);

        $blocked = Order::whereIn('id', $ids)
            ->whereNotIn('status', ['draft', 'cancelled'])
            ->first();

        if ($blocked) {
            return response()->json([
                'message' => "Only draft or cancelled orders can be deleted. Order id {$blocked->id} has status '{$blocked->status}'."
            ], 422);
        }

        return DB::transaction(function () use ($ids) {

            $orders = Order::with('orderItems.product')
                ->whereIn('id', $ids)
                ->lockForUpdate()
                ->get();

            foreach ($orders as $order) {

                // ✅ Restore stock ONLY for draft orders
                if ($order->status === 'draft') {
                    foreach ($order->orderItems as $item) {
                        $item->product->increment('stock', $item->quantity);
                    }
                }

                // Delete order (orderItems deleted via cascade or model events)
                $order->delete();
            }

            return response()->json([
                'message' => 'Orders deleted permanently successfully',
            ]);
        });
    }



    // Validate ids
    protected function validateIds(Request $request): array {
        return $request->validate([
            'ids'   => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:orders,id'],
        ])['ids'];
    }
}
