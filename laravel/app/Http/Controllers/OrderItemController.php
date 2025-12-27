<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderItemResource;
use App\Models\OrderItem;
use Illuminate\Http\Request;

class OrderItemController extends Controller
{
    public function getOrderItemById($id) {
        $orderItem = OrderItem::with('product', 'order')->findOrFail($id);

        return response()->json([
            'orderItem' => new OrderItemResource($orderItem),
        ], 201);
    }

    public function createOrderItem(Request $request) {
        $data = $request->validate([
            'product_id' => ['required', 'exists:products,id'],
            'order_id' => ['required', 'exists:orders,id'],
            'price' => ['required', 'numeric', 'min:0'],
            'quantity' => ['required', 'integer', 'min:0'],
        ]);

        $orderItem = OrderItem::create($data);

        return response()->json([
            'message' => 'Order item created successfully',
            'orderItem' => new OrderItemResource($orderItem),
        ], 201);
    }
    
    public function updateOrderItem(Request $request, $id) {
        $orderItem = OrderItem::findOrFail($id);

        $data = $request->validate([
            'product_id' => ['sometimes', 'exists:products,id'],
            'order_id' => ['sometimes', 'exists:orders,id'],
            'price' => ['sometimes', 'numeric', 'min:0'],
            'quantity' => ['sometimes', 'integer', 'min:0'],
        ]);

        $orderItem->update($data);

        return response()->json([
            'message' => 'Order item updated successfully',
            'orderItem' => new OrderItemResource($orderItem),
        ], 201);
    }

    // Delete functions
    public function hardDelete(Request $request) {
        $ids = $this->validateIds($request);

        $deleted = OrderItem::whereIn('id', $ids)->delete();

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
