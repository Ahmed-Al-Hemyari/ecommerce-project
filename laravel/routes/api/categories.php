<?php

use App\Http\Controllers\CategoryController;
use Illuminate\Support\Facades\Route;

Route::get('/', [CategoryController::class, 'getAllCategories']);
Route::get('/{id}', [CategoryController::class, 'getCategoryById']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/', [CategoryController::class, 'createCategory']);
    Route::put('/{id}', [CategoryController::class, 'updateCategory']);
    // Delete
    Route::patch('/delete', [CategoryController::class, 'softDelete']);
    Route::patch('/restore', [CategoryController::class, 'restore']);
    Route::delete('/delete', [CategoryController::class, 'hardDelete']);
});