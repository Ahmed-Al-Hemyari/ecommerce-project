<?php

namespace App\Http\Resources;

use Illuminate\Database\Eloquent\Attributes\UseResource;
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
            'user' => new UseResource($this->whenLoaded('user')),
            'orderItems' => OrderItemResource::collection($this->whenLoaded('orderItems')),
            'shipping' => [
                'address1' => $this->address1,
                'address2' => $this->address2,
                'city' => $this->city,
                'zip' => $this->zip,
                'country' => $this->country,
                'paymentMethod' => $this->paymentMethod,
            ],
            'totalAmount' => $this->totalAmount,
            'status' => $this->status,
            'payed' => $this->payed,
            'createdAt' => $this->created_at?->toISOString(),
            'updatedAt' => $this->updated_at?->toISOString(),
            'deleted' => !is_null($this->deleted_at),
        ];
    }
}
