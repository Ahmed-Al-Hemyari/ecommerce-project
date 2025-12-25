<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
      'user_id',
      'address1',  
      'address2',
      'city',
      'zip',
      'country',
      'paymentMethod',
      'totalAmount',
      'status',
      'payed'  
    ];

    public function user() {
        return $this->belongsTo(User::class);
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
}
