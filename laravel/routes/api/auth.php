<?php

use App\Http\Controllers\AuthController;
use App\Http\Middleware\IsAdmin;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login-email', [AuthController::class, 'loginByEmail']);
Route::post('/login-phone', [AuthController::class, 'loginByPhone']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/check-auth', function (Request $request) {
        return response()->json(['authenticated' => true]);
    });
    Route::get('/profile', function (Request $request) {
        return response()->json(['user' => new UserResource($request->user()->with('shippings')->first())]);
    });
    Route::put('/profile/update', [AuthController::class, 'updateProfile']);
    Route::put('/profile/change-password', [AuthController::class, 'changePassword']);
    Route::patch('/shippings/{shippingId}/set-default', [AuthController::class, 'makeShippingDefault']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::middleware(['auth:sanctum', IsAdmin::class])->group(function () {
    Route::get('/check-admin', function (Request $request) {
        return response()->json(['authenticated' => true, 'isAdmin' => true]);
    });
});