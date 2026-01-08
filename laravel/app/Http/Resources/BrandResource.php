<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BrandResource extends JsonResource
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
            'name' => $this->name,
            'logo' => $this->logo ? ('/storage/brands/' . $this->logo) : null,
            'products' => ProductResource::collection($this->whenLoaded('products')),
            'createdAt' => $this->created_at?->toISOString(),
            'updatedAt' => $this->updated_at?->toISOString(),
            'deleted' => !is_null($this->deleted_at),
        ];
    }
}
