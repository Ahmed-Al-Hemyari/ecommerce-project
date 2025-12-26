<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
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

        $orders = Order::with('user', 'orderItems')->filter($filters)->paginate($limit);

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

        return response()->json(
            new OrderResource($order)
        , 200);
    }

    public function createOrder(Request $request)
    {
        $data = $request->validate([
            'userId' => ['required', 'exists:users,id'],
            'shipping.address1' => ['required', 'string'],
            'shipping.address2' => ['nullable', 'string'],
            'shipping.city' => ['required', 'string'],
            'shipping.country' => ['required', 'string'],
            'shipping.zip' => ['required', 'string'],
            'shipping.paymentMethod' => ['required', 'string'],
            'orderItems' => ['required', 'array', 'min:1'],
            'orderItems.*.product' => ['required'],
            'orderItems.*.quantity' => ['required', 'integer', 'min:1'],
        ]);

        return DB::transaction(function () use ($data) {

            $totalAmount = 0;

            $order = Order::create([
                'user_id' => $data['userId'],
                'address1' => $data['shipping']['address1'],
                'address2' => $data['shipping']['address2'] ?? null,
                'city' => $data['shipping']['city'],
                'country' => $data['shipping']['country'],
                'zip' => $data['shipping']['zip'],
                'paymentMethod' => $data['shipping']['paymentMethod'],
                'totalAmount' => 0, // temp
            ]);

            foreach ($data['orderItems'] as $item) {

                $productId = is_array($item['product'])
                    ? $item['product']['_id']
                    : $item['product'];

                $product = Product::lockForUpdate()->findOrFail($productId);

                if ($product->stock < $item['quantity']) {
                    abort(422, "Insufficient stock for {$product->name}");
                }

                $lineTotal = $product->price * $item['quantity'];
                $totalAmount += $lineTotal;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'price' => $product->price,
                    'quantity' => $item['quantity'],
                ]);

                $product->decrement('stock', $item['quantity']);
            }

            $order->update([
                'totalAmount' => $totalAmount,
            ]);

            $order->load('orderItems');

            return response()->json([
                'message' => 'Order created successfully',
                'order' => new OrderResource($order),
            ], 201);
        });
    }

    public function updateOrder(Request $request, $id)
    {
        $data = $request->validate([
            'userId' => ['sometimes', 'exists:users,id'],
            'shipping.address1' => ['sometimes', 'string'],
            'shipping.address2' => ['nullable', 'string'],
            'shipping.city' => ['sometimes', 'string'],
            'shipping.country' => ['sometimes', 'string'],
            'shipping.zip' => ['sometimes', 'string'],
            'shipping.paymentMethod' => ['sometimes', 'string'],
            'payed' => ['sometimes', 'boolean'],
            'orderItems' => ['sometimes', 'array', 'min:1'],
            'orderItems.*.product' => ['required_with:orderItems'],
            'orderItems.*.quantity' => ['required_with:orderItems', 'integer', 'min:1'],
        ]);

        return DB::transaction(function () use ($data, $id) {

            $order = Order::with('orderItems')->lockForUpdate()->findOrFail($id);

            /* ---------------- Update Order Fields ---------------- */
            $order->update(array_filter([
                'user_id' => $data['userId'] ?? null,
                'payed' => $data['payed'] ?? null,
                'address1' => $data['shipping']['address1'] ?? null,
                'address2' => $data['shipping']['address2'] ?? "",
                'city' => $data['shipping']['city'] ?? null,
                'country' => $data['shipping']['country'] ?? null,
                'zip' => $data['shipping']['zip'] ?? null,
                'paymentMethod' => $data['shipping']['paymentMethod'] ?? null,
            ], fn ($v) => !is_null($v)));


            /* ---------------- Update Order Items ---------------- */
            if (isset($data['orderItems'])) {

                // Restore old stock
                foreach ($order->orderItems as $item) {
                    Product::where('id', $item->product_id)
                        ->increment('stock', $item->quantity);
                }

                // Remove old items
                $order->orderItems()->delete();

                $totalAmount = 0;

                foreach ($data['orderItems'] as $item) {

                    $productId = is_array($item['product'])
                        ? $item['product']['_id']
                        : $item['product'];

                    $product = Product::lockForUpdate()->findOrFail($productId);

                    if ($product->stock < $item['quantity']) {
                        abort(422, "Insufficient stock for {$product->name}");
                    }

                    $lineTotal = $product->price * $item['quantity'];
                    $totalAmount += $lineTotal;

                    OrderItem::create([
                        'order_id'  => $order->id,
                        'product_id'=> $product->id,
                        'price'     => $product->price,
                        'quantity'  => $item['quantity'],
                    ]);

                    $product->decrement('stock', $item['quantity']);
                }

                $order->update(['totalAmount' => $totalAmount]);
            }

            $order->load('orderItems.product');

            return response()->json([
                'message' => 'Order updated successfully',
                'order'   => new OrderResource($order),
            ], 200);
        });
    }



    public function updateMany(Request $request) {
        $ids = $this->validateIds($request);

        $credentials = $request->validate([
            'updates.status' => ['sometimes', Rule::in(["Pending", "Processing", "Shipped", "Delivered", "Cancelled"])],
            'updates.payed' => ['sometimes', 'bool']
        ]);

        $updates = $credentials['updates'] ?? [];
        
        if (empty($updates)) {
            return response()->json([
                'message' => 'No data provided for update'
            ], 422);
        }

        $updated = Order::whereIn('id', $ids)->update($updates);

        return response()->json([
            'message' => 'Orders updated successfully',
        ], 200);
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
