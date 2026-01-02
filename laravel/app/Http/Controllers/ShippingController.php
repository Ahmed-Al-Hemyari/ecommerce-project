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
            'user_id' => ['sometimes', 'exists:users,id'],
            'address1' => ['required', 'string'],
            'address2' => ['nullable', 'string'],
            'city' => ['required', 'string'],
            'zip' => ['required', 'string'],
            'country' => ['required', 'string'],
        ]);

        $user = User::findOrFail($data['user_id'] ?? $request->user()->id);

        if ($user->shippings()->count() >= 5) {
            return response()->json([
                'message' => 'Maximum number of shipping addresses reached'
            ], 422);
        }

        $isFirst = $user->shippings()->count() === 0;

        $shipping = Shipping::create([
            'user_id' => $user->id,
            'address1' => $data['address1'],
            'address2' => $data['address2'] ?? null,
            'city' => $data['city'],
            'zip' => $data['zip'],
            'country' => $data['country'],
            'is_default' => $isFirst,
        ]);

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
            'address2' => ['nullable', 'string'],
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
    public function deleteShipping(Request $request, $id)
    {
        $shipping = Shipping::withCount('orders')->findOrFail($id);

        if ($shipping->orders_count > 0) {
            return response()->json([
                'message' => 'Cannot delete shipping address with existing orders'
            ], 422);
        }

        if ($shipping->is_default) {
            return response()->json([
                'message' => 'Cannot delete default shipping address'
            ], 422);
        }

        $shipping->delete();

        return response()->json([
            'message' => 'Shipping deleted permanently successfully'
        ]);
    }

    public function makeDefault($id) {
        $shipping = Shipping::findOrFail($id);
        $user = $shipping->user;

        // Unset previous default shipping
        Shipping::where('user_id', $user->id)
            ->where('is_default', true)
            ->update(['is_default' => false]);

        // Set new default shipping
        $shipping->is_default = true;
        $shipping->save();

        return response()->json([
            'message' => 'Shipping address set as default successfully',
            'shipping' => new ShippingResource($shipping)
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
