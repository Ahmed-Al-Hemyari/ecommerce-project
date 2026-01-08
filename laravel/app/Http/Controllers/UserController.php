<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function getAllUsers(Request $request) {
        $filters = $request->only(['search', 'role', 'deleted']);
        // Pagination
        $limit = min($request->input('limit', 50), 150);

        $users = User::filter($filters)->paginate($limit);

        return response()->json([
            'users' => UserResource::collection($users),
            'currentPage' => $users->currentPage(),
            'totalItems' => $users->total(),
            'totalPages' => $users->lastPage()
        ], 200);
    }

    public function getUserById($id) {

        $user = User::withTrashed()->with(['shippings', 'orders.user', 'orders.orderItems'])->find($id);

        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        return response()->json([
            'user' => new UserResource($user)
        ], 200);
    }

    public function createUser(Request $request) {
        $credentials = $request->validate([
            'name' => ['required', 'string'],
            'email' => ['required', 'email'],
            'phone' => ['required', 'string'],
            'role' => ['nullable', Rule::in(['user', 'admin'])]
        ]);

        if (!$credentials['role']) {
            $credentials['role'] = 'user';
        }

        $credentials['password'] = bcrypt($credentials['email']);

        $user = User::create($credentials);

        return response()->json([
            'message' => 'User created successfully',
            'user' => new UserResource($user)
        ], 201);
    }

    public function updateUser(Request $request, $id) {
        $user = User::findOrFail($id);

        $credentials = $request->validate([
            'name' => ['sometimes', 'string'],
            'email' => ['sometimes', 'email'],
            'phone' => ['sometimes', 'string'],
            'role' => ['sometimes', Rule::in(['user', 'admin'])]
        ]);

        $user->update($credentials);

        return response()->json([
            'message' => 'User created successfully',
            'user' => new UserResource($user)
        ], 201);
    }
    
    public function updateMany(Request $request) {
        $ids = $this->validateIds($request);

        $credentials = $request->validate([
            'updates.role' => ['sometimes', Rule::in(['user', 'admin'])]
        ]);

        $updates = $credentials['updates'] ?? [];
        
        if (empty($updates)) {
            return response()->json([
                'message' => 'No data provided for update'
            ], 422);
        }

        $updated = User::whereIn('id', $ids)->update($updates);

        return response()->json([
            'message' => 'Users updated successfully',
            'user' => new UserResource($updated)
        ], 200);
    }

    // Delete functions
    public function softDelete(Request $request) {
        $ids = $this->validateIds($request);

        $deleted = User::whereIn('id', $ids)->delete();

        return response()->json([
            'message' => 'Users deleted successfully'
        ]);
    }

    public function restore(Request $request) {
        $ids = $this->validateIds($request);

        $restored = User::onlyTrashed()
            ->whereIn('id', $ids)
            ->restore();

        return response()->json([
            'message' => 'Users restored successfully'
        ]);
    }

    public function hardDelete(Request $request) {
        $ids = $this->validateIds($request);

        $deleted = User::withTrashed()
            ->whereIn('id', $ids)
            ->forceDelete();

        return response()->json([
            'message' => 'Users deleted permenantly successfully'
        ]);
    }


    // Validate ids
    protected function validateIds(Request $request): array {
        return $request->validate([
            'ids'   => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:users,id'],
        ])['ids'];
    }
}
