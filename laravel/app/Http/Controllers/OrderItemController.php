<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderItemResource;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderItemController extends Controller
{
    public function getOrderItemById($id) {
        $orderItem = OrderItem::with('product', 'order')->findOrFail($id);

        return response()->json([
            'orderItem' => new OrderItemResource($orderItem),
        ], 201);
    }

    public function createOrderItem(Request $request)
    {
        $data = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'order_id' => ['required', 'exists:orders,id'],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        return DB::transaction(function () use ($data) {
            $product = Product::findOrFail($data['product_id']);
            $order = Order::with('orderItems')->findOrFail($data['order_id']);

            if ($order->status !== 'draft') {
                return response()->json(['message' => 'Cannot add items to a finalized order'], 422);
            }

            if ($data['quantity'] > $product->stock) {
                return response()->json(['message' => 'Insufficient stock'], 422);
            }

            $existingItem = $order->orderItems()
                ->where('product_id', $data['product_id'])
                ->first();

            if ($existingItem) {
                // Return stock
                $existingItem->product->increment('stock', $existingItem->quantity);

                // Delete old item
                $existingItem->delete();
            }

            $orderItem = OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'quantity' => $data['quantity'],
                'price' => $product->price,
            ]);
            // Decrease stock
            $product->decrement('stock', $data['quantity']);

            return response()->json([
                'message' => 'Order item created successfully',
                'orderItem' => new OrderItemResource(
                    $orderItem->load('product', 'order')
                ),
            ], 201);
        });
    }
    
    public function updateOrderItem(Request $request, $id) {
        $orderItem = OrderItem::findOrFail($id);

        $data = $request->validate([
            'product_id' => ['sometimes', 'exists:products,id'],
            // 'order_id' => ['sometimes', 'exists:orders,id'],
            // 'price' => ['sometimes', 'numeric', 'min:0'],
            'quantity' => ['sometimes', 'integer', 'min:0'],
        ]);

        $product = Product::findOrFail($data['product_id']);

        $orderItem->update($data);

        return response()->json([
            'message' => 'Order item updated successfully',
            'orderItem' => new OrderItemResource($orderItem),
        ], 201);
    }

    // Delete functions
    public function hardDelete(Request $request)
    {
        $ids = $this->validateIds($request);

        DB::transaction(function () use ($ids) {

            $items = OrderItem::with(['order', 'product'])
                ->whereIn('id', $ids)
                ->get();

            foreach ($items as $item) {

                if ($item->order->status !== 'draft') {
                    return response()->json(['message' => 'Cannot delete items from a finalized order'], 422);
                }

                // Return stock
                $item->product->increment('stock', $item->quantity);

                $item->delete();
            }
        });

        return response()->json([
            'message' => 'Order item deleted successfully'
        ]);
    }


    // Validate ids
    protected function validateIds(Request $request): array {
        return $request->validate([
            'ids'   => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:order_items,id'],
        ])['ids'];
    }
}
