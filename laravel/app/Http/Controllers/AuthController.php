<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    public function register (Request $request) 
    {
        $credentials = $request->validate([
            'name' => ['required', 'min:3'],
            'email' => ['required', 'email', Rule::unique('users', 'email')],
            'phone' => ['required', 'string', Rule::unique('users', 'phone')],
            'password' => ['required', 'min:6']
        ]);

        $credentials['role'] = 'user';
        $credentials['password'] = bcrypt($credentials['password']);

        $user = User::create($credentials);

        return response()->json([
            'message' => "User registered successfully",
            'user' => new UserResource($user)
        ], 201);
    }

    public function loginByEmail(Request $request) {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required']
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid login details',
                'success' => false,
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => "Logged in successfully",
            'user' => new UserResource($user),
            'token' => $token,
        ], 200);
    }

    public function loginByPhone(Request $request) {
        $credentials = $request->validate([
            'phone' => ['required', 'string'],
            'password' => ['required']
        ]);

        $user = User::where('phone', $credentials['phone'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid login details',
                'success' => false,
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => "Logged in successfully",
            'user' => new UserResource($user),
            'token' => $token,
        ], 200);
    }

    public function updateProfile(Request $request) {
        $user = $request->user();

        $credentials = $request->validate([
            'name' => ['sometimes', 'min:3'],
            'email' => ['sometimes', 'email', Rule::unique('users', 'email')->ignore($user->id)],
            'phone' => ['sometimes', 'string', Rule::unique('users', 'phone')->ignore($user->id)]
        ]);

        $user->update($credentials);

        return response()->json([
            'message' => "User update successfully", 
            'user' => new UserResource($user->fresh())
        ], 200);
    }
    
    public function changePassword(Request $request) {
        $user = $request->user();

        $credentials = $request->validate([
            'oldPassword' => ['required'],
            'newPassword' => ['required', 'min:6'],
        ]);

        if (!$user || !Hash::check($credentials['oldPassword'], $user->password)) {
            return response()->json([
                'message' => 'Invalid login details',
                'success' => false,
            ], 401);
        }

        $user->update([
            'password' => Hash::make($credentials['newPassword'])
        ]);

        $currentToken = $request->user()->currentAccessToken();

        $user->tokens()
            ->where('id', '!=', $currentToken->id)
            ->delete();

        return response()->json([
            'message' => "Password update successfully", 
            'user' => new UserResource($user->fresh())
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }
}
