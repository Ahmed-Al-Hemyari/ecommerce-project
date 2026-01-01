<?php

use App\Http\Controllers\OrderController;
use App\Http\Middleware\IsAdmin;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [OrderController::class, 'getOrdersForUser']);
    Route::post('/from-cart', [OrderController::class, 'createOrderFromCart']);
    Route::patch('/bulk-update', [OrderController::class, 'updateMany']);
});

Route::middleware(['auth:sanctum', IsAdmin::class])->group(function () {
    Route::get('/', [OrderController::class, 'getAllOrders']);
    Route::post('/', [OrderController::class, 'createOrder']);
    Route::get('/{id}', [OrderController::class, 'getOrderById']);
    Route::put('/{id}', [OrderController::class, 'updateOrder']);
    // Delete
    Route::delete('/delete', [OrderController::class, 'hardDelete']);
});