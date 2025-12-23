<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'name',
        'slug'
    ];

    public function products() {
        return $this->hasMany(Product::class);
    }

    public function scopeFilter($query, array $filters) {
        $query->when($filters['search'] ?? null, function ($q, $search) {
            $q->where(function ($sub) use ($search) {
                $sub->where('name', 'LIKE', "%$search%")
                    ->orWhere('slug', 'LIKE', "%$search%");
            });
        });

        $query->when($filters['deleted'] ?? null, function ($q, $deleted) {
            if ($deleted) {
                $q->onlyTrashed();
            }
        });
    }
}
