<?php

use App\Http\Middleware\IsAdmin;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'Welcome to QuickBuy API!'
    ]);
})->middleware([IsAdmin::class]);
