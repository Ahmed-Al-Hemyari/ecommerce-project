<?php

use App\Http\Controllers\ProductController;
use App\Http\Middleware\IsAdmin;
use Illuminate\Support\Facades\Route;

Route::get('/', [ProductController::class, 'getAllProducts']);
Route::get('/{id}', [ProductController::class, 'getProductById']);

Route::middleware(['auth:sanctum', IsAdmin::class])->group(function () {
    Route::post('/', [ProductController::class, 'createProduct']);
    Route::put('/{id}', [ProductController::class, 'updateProduct']);
    // Delete
    Route::patch('/delete', [ProductController::class, 'softDelete']);
    Route::patch('/restore', [ProductController::class, 'restore']);
    Route::delete('/delete', [ProductController::class, 'hardDelete']);
});