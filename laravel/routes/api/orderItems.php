<?php

use App\Http\Controllers\OrderItemController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/{id}', [OrderItemController::class, 'getOrderItemById']);
    Route::post('/', [OrderItemController::class, 'createOrderItem']);
    Route::put('/{id}', [OrderItemController::class, 'updateOrderItem']);
    // Delete
    Route::delete('/delete', [OrderItemController::class, 'hardDelete']);
});