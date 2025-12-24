<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json(['message' => "Welcome to QuickBuy API"]);
});

Route::prefix('auth')->group(base_path('routes/api/auth.php'));
Route::prefix('categories')->group(base_path('routes/api/categories.php'));
Route::prefix('brands')->group(base_path('routes/api/brands.php'));
Route::prefix('products')->group(base_path('routes/api/products.php'));