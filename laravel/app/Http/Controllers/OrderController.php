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
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    public function getAllOrders(Request $request) {
        $filters = $request->only(['search', 'status', 'payed', 'deleted']);
        // Pagination
        $limit = min($request->input('limit', 50), 150);

        $orders = Order::with('user', 'shipping', 'orderItems')->filter($filters)->paginate($limit);

        return response()->json([
            'orders' => OrderResource::collection($orders),
            'currentPage' => $orders->currentPage(),
            'totalItems' => $orders->total(),
            'totalPages' => $orders->lastPage()
        ], 200);
    }

    public function getOrderById($id) {

        $order = Order::with('user', 'orderItems.product')->find($id);

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
            'user_id' => ['required', 'exists:users,id'],
            'shipping_id' => ['required', 'exists:shippings,id'],
            'payment_method' => ['required', Rule::in(['credit', 'paypal', 'cod'])],
            'shipping_cost' => ['required', 'numeric', 'min:0'],
        ]);

        // Ensure shipping belongs to user
        $shipping = Shipping::where('id', $data['shipping_id'])
            ->where('user_id', $data['user_id'])
            ->firstOrFail();

        $order = Order::create([
            'user_id' => $data['user_id'],
            'shipping_id' => $shipping->id,
            'payment_method' => $data['payment_method'],
            'shipping_cost' => $data['shipping_cost'],
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
            'user_id' => ['required', 'exists:users,id'],
            'shipping_id' => ['required', 'exists:shippings,id'],
            'payment_method' => ['required', Rule::in(['credit', 'paypal', 'cod'])],
            'cart' => ['required', 'array'],
            'cart.*.product_id' => ['required', 'exists:products,id'],
            'cart.*.quantity' => ['required', 'integer', 'min:1'],
        ]);

        return DB::transaction(function () use ($data) {

            // Create draft order
            $order = Order::create([
                'user_id' => $data['user_id'],
                'shipping_id' => $data['shipping_id'],
                'payment_method' => $data['payment_method'],
                'subtotal' => 0,
                'shipping_cost' => 0,
                'status' => 'draft',
            ]);

            foreach ($data['cart'] as $item) {
                $product = Product::find($item['product_id']);

                if (!$product || $item['quantity'] > $product->stock) {
                    // Skip item if product missing or stock insufficient
                    continue;
                }

                // Replace existing item if present
                $existingItem = $order->orderItems()->where('product_id', $product->id)->first();
                if ($existingItem) {
                    $existingItem->product->increment('stock', $existingItem->quantity);
                    $existingItem->delete();
                }

                // Create new order item
                $orderItem = OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                ]);

                // Decrement stock
                $product->decrement('stock', $item['quantity']);
            }

            return response()->json([
                'message' => 'Order created successfully',
                'order' => new OrderResource($order->load('orderItems.product')),
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
            'shipping_id' => ['sometimes', 'exists:shippings,id'],
            'payment_method' => ['sometimes', Rule::in(['credit', 'paypal', 'cod'])],
            'shipping_cost' => ['sometimes', 'numeric', 'min:0'],
        ]);

        // If shipping is being changed, verify ownership
        if (isset($data['shipping_id'])) {
            Shipping::where('id', $data['shipping_id'])
                ->where('user_id', $order->user_id)
                ->firstOrFail();
        }

        $order->update($data);

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
                'pending', 'paid', 'shipped', 'delivered', 'cancelled'
            ])],
            'updates.paid' => ['sometimes', 'boolean'],
        ]);

        $updates = $credentials['updates'] ?? [];

        if (empty($updates)) {
            return response()->json([
                'message' => 'No data provided for update'
            ], 422);
        }

        // Handle paid_at explicitly
        if (array_key_exists('paid', $updates)) {
            $updates['paid_at'] = $updates['paid']
                ? now()
                : null;
        }

        Order::whereIn('id', $ids)->update($updates);

        return response()->json([
            'message' => 'Orders updated successfully',
        ]);
    }


    // Delete functions
    public function hardDelete(Request $request) {
        $ids = $this->validateIds($request);

        $deleted = Order::whereIn('id', $ids)->delete();

        return response()->json([
            'message' => 'Orders deleted permenantly successfully'
        ]);
    }


    // Validate ids
    protected function validateIds(Request $request): array {
        return $request->validate([
            'ids'   => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:orders,id'],
        ])['ids'];
    }
}
