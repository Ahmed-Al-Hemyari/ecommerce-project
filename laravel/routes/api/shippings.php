<?php

use App\Http\Controllers\ShippingController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user/{userId?}', [ShippingController::class, 'getShippingsForUser']);
    Route::get('/{id}', [ShippingController::class, 'getShippingById']);
    Route::post('/', [ShippingController::class, 'createShipping']);
    Route::put('/{id}', [ShippingController::class, 'updateShipping']);
    Route::patch('/{id}', [ShippingController::class, 'makeDefault']);
    // Delete
    Route::delete('/{id}', [ShippingController::class, 'deleteShipping']);
});