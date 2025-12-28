<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class OrderItem extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'order_id',
        'product_id',
        'price',
        'quantity'
    ];

    public function product() {
        return $this->belongsTo(Product::class);
    }

    public function order() {
        return $this->belongsTo(Order::class);
    }

    protected static function booted()
    {
        // After saving an orderItem (create or update)
        static::saved(function ($orderItem) {
            $orderItem->order->recalculateSubtotal();
        });

        // Before deleting an orderItem
        static::deleted(function ($orderItem) {
            $orderItem->order->recalculateSubtotal();
        });
    }
}
