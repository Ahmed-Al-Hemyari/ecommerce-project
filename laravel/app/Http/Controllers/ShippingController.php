<?php

namespace App\Http\Controllers;

use App\Http\Resources\ShippingResource;
use App\Models\Shipping;
use App\Models\User;
use Illuminate\Http\Request;

class ShippingController extends Controller
{
    public function getShippingsForUser(Request $request, $userId = null) {
        // If userId is provided, use it, otherwise use authenticated user
        $userId = $userId ?? $request->user()->id;

        $shippings = Shipping::where('user_id', $userId)->get();

        return response()->json([
            'shippings' => ShippingResource::collection($shippings),
        ], 200);
    }


    public function getShippingById($id) {
        $shipping = Shipping::with('user')->findOrFail($id);

        return response()->json([
            'shipping' => new ShippingResource($shipping),
        ]);
    }

    public function createShipping(Request $request) {
        $data = $request->validate([
            'user_id' => ['nullable', 'exists:users,id'],
            'address1' => ['required', 'string'],
            'address2' => ['nullable', 'string'],
            'city' => ['required', 'string'],
            'zip' => ['required', 'string'],
            'country' => ['required', 'string'],
        ]);

        if (empty($data['user_id'])) {
            $data['user_id'] = $request->user()->id;
        }

        $data['is_default'] = false;

        $shipping = Shipping::create($data);

        return response()->json([
            'message' => 'Shipping created successfully',
            'shipping' => new ShippingResource($shipping)
        ]);
    }
    
    public function updateShipping(Request $request, $id) {
        $shipping = Shipping::findOrFail($id);

        $data = $request->validate([
            'user_id' => ['sometimes', 'string'],
            'address1' => ['sometimes', 'string'],
            'address2' => ['sometimes', 'string'],
            'city' => ['sometimes', 'string'],
            'zip' => ['sometimes', 'string'],
            'country' => ['sometimes', 'string'],
            'is_default' => ['sometimes', 'boolean'],
        ]);

        $shipping->update($data);

        return response()->json([
            'message' => 'Shipping updated successfully',
            'shipping' => new ShippingResource($shipping)
        ]);
    }

    // Delete functions
    public function hardDelete(Request $request) {
        $ids = $this->validateIds($request);

        $deleted = Shipping::whereIn('id', $ids)->delete();

        return response()->json([
            'message' => 'Shippings deleted permenantly successfully'
        ]);
    }

    // Validate ids
    protected function validateIds(Request $request): array {
        return $request->validate([
            'ids'   => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:shippings,id'],
        ])['ids'];
    }
}
