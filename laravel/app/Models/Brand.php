<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Brand extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'name',
        'logo',
    ];

    public function products() {
        return $this->hasMany(Product::class);
    }

    public function scopeFilter($query, array $filters) {
        $query->when($filters['search'] ?? null, function ($q, $search) {
            $q->where(function ($sub) use ($search) {
                $sub->where('name', 'LIKE', "%$search%");
            });
        });

        $query->when($filters['deleted'] ?? null, function ($q, $deleted) {
            if ($deleted) {
                $q->onlyTrashed();
            }
        });
    }
}
