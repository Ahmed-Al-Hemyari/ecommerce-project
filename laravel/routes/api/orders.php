<?php

use App\Http\Controllers\OrderController;
use App\Http\Middleware\IsAdmin;
use Illuminate\Support\Facades\Route;

Route::get('/', [OrderController::class, 'getAllOrders']);
Route::get('/{id}', [OrderController::class, 'getOrderById']);

Route::middleware(['auth:sanctum', IsAdmin::class])->group(function () {
    Route::post('/', [OrderController::class, 'createOrder']);
    Route::post('/from-cart', [OrderController::class, 'createOrderFromCart']);
    Route::put('/{id}', [OrderController::class, 'updateOrder']);
    Route::patch('/bulk-update', [OrderController::class, 'updateMany']);
    // Delete
    Route::patch('/delete', [OrderController::class, 'softDelete']);
    Route::patch('/restore', [OrderController::class, 'restore']);
    Route::delete('/delete', [OrderController::class, 'hardDelete']);
});