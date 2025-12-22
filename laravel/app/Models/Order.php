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
}
