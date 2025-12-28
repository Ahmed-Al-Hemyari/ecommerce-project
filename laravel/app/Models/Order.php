<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
      'user_id',
      'shipping_id',  
      'payment_method',
      'subtotal',
      'shipping_cost',
      'total',
      'status',
      'is_paid',  
      'paid_at',  
    ];

    protected static function booted()
    {
        static::saving(function ($order) {
            $order->total = $order->subtotal + $order->shipping_cost;
        });
    }


    public function user() {
        return $this->belongsTo(User::class);
    }
    
    public function shipping() {
        return $this->belongsTo(Shipping::class);
    }

    public function orderItems() {
        return $this->hasMany(OrderItem::class);
    }

    public function scopeFilter($query, array $filters) {
        $query->when($filters['search'] ?? null, function ($q, $search) {
            $q->where(function ($sub) use ($search) {
                $sub->where('status', 'LIKE', "%$search%")
                    ->orWhereHas('user', fn($q2) => $q2->where('name', 'LIKE', "%$search%"))
                    ->orWhere('totalAmount', '=', $search);
            });
        });

        $query->when($filters['status'] ?? null, function ($q, $status) {
            $q->whereHas('status', 'LIKE', "%$status%");
        });
        
        $query->when($filters['payed'] ?? null, function ($q, $payed) {
            $q->whereHas('payed', '=', "%$payed%");
        });
    }

    
    public function recalculateSubtotal()
    {
        $this->subtotal = $this->orderItems()
            ->sum(DB::raw('quantity * price'));

        // Total can include shipping
        $this->total = $this->subtotal + $this->shipping_cost;

        $this->save();
    }
}
