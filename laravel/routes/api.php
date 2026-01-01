<?php

use App\Http\Controllers\DashboardController;
use App\Http\Middleware\IsAdmin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json(['message' => "Welcome to QuickBuy API"]);
});

Route::get('/dashboard', [DashboardController::class, 'getDashboardData'])
    ->middleware(['auth:sanctum', IsAdmin::class]);

Route::prefix('auth')->group(base_path('routes/api/auth.php'));
Route::prefix('users')->group(base_path('routes/api/users.php'));
Route::prefix('shippings')->group(base_path('routes/api/shippings.php'));
Route::prefix('categories')->group(base_path('routes/api/categories.php'));
Route::prefix('brands')->group(base_path('routes/api/brands.php'));
Route::prefix('products')->group(base_path('routes/api/products.php'));
Route::prefix('orders')->group(base_path('routes/api/orders.php'));
Route::prefix('order-items')->group(base_path('routes/api/orderItems.php'));