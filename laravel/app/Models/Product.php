<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory;
    use SoftDeletes;
    
    protected $fillable = [
        'name',
        'category_id',
        'brand_id',
        'price',
        'stock',
        'description',
        'image'
    ];

    public function category() {
        return $this->belongsTo(Category::class);
    }

    public function brand() {
        return $this->belongsTo(Brand::class);
    }
    
    public function orderItems() {
        return $this->hasMany(OrderItem::class);
    }

    public function scopeFilter($query, array $filters) {
        $query->when($filters['search'] ?? null, function ($q, $search) {
            $q->where(function ($sub) use ($search) {
                $sub->where('name', 'LIKE', "%$search%")
                    ->orWhereHas('category', fn($q2) => $q2->where('name', 'like', "%$search%"))
                    ->orWhereHas('brand', fn($q2) => $q2->where('name', 'like', "%$search%"))
                    ->orWhere('price', '=', $search);
            });
        });

        $query->when($filters['brand'] ?? null, function ($q, $brand) {
            $q->whereHas('brand', fn($q2) => $q2->where('id', 'like', "%$brand%"));
        });

        $query->when($filters['category'] ?? null, function ($q, $category) {
            $q->whereHas('category', fn($q2) => $q2->where('id', 'like', "%$category%"));
        });
        
        $query->when(
            filled($filters['minPrice'] ?? null) && filled($filters['maxPrice'] ?? null),
            function ($q) use ($filters) {
                $q->whereBetween('price', [
                    $filters['minPrice'],
                    $filters['maxPrice']
                ]);
            }
        );

        $query->when($filters['stock'] ?? null, function ($q, $stock) {
            switch ($stock) {
                case 'in-stock':
                    $q->where('stock', '>=', 10);
                    break;
                case 'out-of-stock':
                    $q->where('stock', '=', 0);
                    break;
                case 'low-stock':
                    $q->whereBetween('stock', [
                        1, 9
                    ]);
                    break;
                
                default:
                    null;
                    break;
            }
        });

        $query->when($filters['deleted'] ?? null, function ($q, $deleted) {
            if ($deleted) {
                $q->onlyTrashed();
            }
        });
    }

}
