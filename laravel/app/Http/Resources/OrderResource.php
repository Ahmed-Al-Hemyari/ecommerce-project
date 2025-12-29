<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            '_id' => (string) $this->id,
            'user' => new UserResource($this->whenLoaded('user')),
            'shipping' => new ShippingResource($this->whenLoaded('shipping')),
            'orderItems' => OrderItemResource::collection($this->whenLoaded('orderItems')),
            'paymentMethod' => $this->payment_method,
            'subtotal' => $this->subtotal,
            'shippingCost' => $this->shipping_cost,
            'total' => $this->total,
            'status' => $this->status,
            'paid' => $this->is_paid,
            'paidAt' => $this->paid_at?->toISOString() ?? null,
            'createdAt' => $this->created_at?->toISOString(),
            'updatedAt' => $this->updated_at?->toISOString(),
            'deleted' => !is_null($this->deleted_at),
        ];
    }
}
