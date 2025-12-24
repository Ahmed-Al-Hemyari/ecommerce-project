<?php

use App\Http\Controllers\BrandController;
use App\Http\Middleware\IsAdmin;
use Illuminate\Support\Facades\Route;

Route::get('/', [BrandController::class, 'getAllBrands']);
Route::get('/{id}', [BrandController::class, 'getBrandById']);

Route::middleware(['auth:sanctum', IsAdmin::class])->group(function () {
    Route::post('/', [BrandController::class, 'createBrand']);
    Route::put('/{id}', [BrandController::class, 'updateBrand']);
    // Delete
    Route::patch('/delete', [BrandController::class, 'softDelete']);
    Route::patch('/restore', [BrandController::class, 'restore']);
    Route::delete('/delete', [BrandController::class, 'hardDelete']);
});