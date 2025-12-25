<?php

use App\Http\Controllers\UserController;
use App\Http\Middleware\IsAdmin;
use Illuminate\Support\Facades\Route;

Route::get('/', [UserController::class, 'getAllUsers']);
Route::get('/{id}', [UserController::class, 'getUserById']);

Route::middleware(['auth:sanctum', IsAdmin::class])->group(function () {
    Route::post('/', [UserController::class, 'createUser']);
    Route::put('/{id}', [UserController::class, 'updateUser']);
    Route::patch('/bulk-update', [UserController::class, 'updateMany']);
    // Delete
    Route::patch('/delete', [UserController::class, 'softDelete']);
    Route::patch('/restore', [UserController::class, 'restore']);
    Route::delete('/delete', [UserController::class, 'hardDelete']);
});