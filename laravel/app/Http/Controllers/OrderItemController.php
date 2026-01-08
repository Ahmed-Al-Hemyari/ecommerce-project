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
            'product' => ['required', 'exists:products,id'],
            'order' => ['required', 'exists:orders,id'],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $formattedData = [
            'product_id' => $data['product'],
            'order_id' => $data['order'],
            'quantity' => $data['quantity'],
        ];

        return DB::transaction(function () use ($formattedData) {
            $product = Product::findOrFail($formattedData['product_id']);
            $order = Order::with('orderItems')->findOrFail($formattedData['order_id']);

            if ($order->status !== 'draft') {
                return response()->json(['message' => 'Cannot add items to a finalized order'], 422);
            }

            if ($formattedData['quantity'] > $product->stock) {
                return response()->json(['message' => 'Insufficient stock'], 422);
            }

            $existingItem = $order->orderItems()
                ->where('product_id', $formattedData['product_id'])
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
                'quantity' => $formattedData['quantity'],
                'price' => $product->price,
            ]);
            // Decrease stock
            $product->decrement('stock', $formattedData['quantity']);

            return response()->json([
                'message' => 'Order item created successfully',
                'orderItem' => new OrderItemResource(
                    $orderItem->load('product', 'order')
                ),
            ], 201);
        });
    }
    
    public function updateOrderItem(Request $request, $id)
    {
        $orderItem = OrderItem::with('order')->findOrFail($id);

        // 🔒 Only draft orders can be edited
        if ($orderItem->order->status !== 'draft') {
            return response()->json([
                'message' => 'Cannot modify items of a finalized order'
            ], 422);
        }

        $data = $request->validate([
            'product'  => ['sometimes', 'exists:products,id'],
            'quantity' => ['sometimes', 'integer', 'min:1'],
        ]);

        $oldProduct   = Product::findOrFail($orderItem->product_id);
        $newProductId = $data['product'] ?? $orderItem->product_id;
        $newQuantity  = $data['quantity'] ?? $orderItem->quantity;

        // Load new product (if changed)
        $newProduct = Product::findOrFail($newProductId);

        // Restore stock to old product if product changed
        if ($newProductId !== $orderItem->product_id) {
            $oldProduct->increment('stock', $orderItem->quantity);
        }

        // Calculate quantity difference
        $quantityDiff = $newQuantity - $orderItem->quantity;

        // Check stock availability
        if ($quantityDiff > 0 && $quantityDiff > $newProduct->stock) {
            return response()->json([
                'message' => 'Insufficient stock'
            ], 422);
        }

        // Deduct stock
        $newProduct->decrement('stock', $quantityDiff);

        // Update order item
        $orderItem->update([
            'product_id' => $newProductId,
            'quantity'   => $newQuantity,
        ]);

        return response()->json([
            'message'   => 'Order item updated successfully',
            'orderItem' => new OrderItemResource($orderItem->fresh()),
        ], 200);
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
