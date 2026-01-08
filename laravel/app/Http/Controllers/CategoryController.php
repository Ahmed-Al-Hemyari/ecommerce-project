<?php

namespace App\Http\Controllers;

use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function getAllCategories(Request $request) {
        $filters = $request->only(['search', 'deleted']);
        // Pagination
        $limit = min($request->input('limit', 50), 150);

        $categories = Category::with(['products.brand', 'products.category'])->filter($filters)->paginate($limit);

        return response()->json([
            'categories' => CategoryResource::collection($categories),
            'currentPage' => $categories->currentPage(),
            'totalItems' => $categories->total(),
            'totalPages' => $categories->lastPage()
        ], 200);
    }

    public function getCategoryById($id) {

        $category = Category::withTrashed()->with(['products.brand', 'products.category'])->find($id);

        if (!$category) {
            return response()->json([
                'message' => 'Category not found'
            ], 404);
        }

        return response()->json(
            new CategoryResource($category)
        , 200);
    }

    public function createCategory(Request $request) {
        $credentials = $request->validate([
            'name' => ['required', 'string'],
            'slug' => ['required', 'string'],
        ]);

        $category = Category::create($credentials);

        return response()->json([
            'message' => 'Category created successfully',
            new CategoryResource($category)
        ], 201);
    }
    
    public function updateCategory(Request $request, $id) {
        $category = Category::find($id);

        if (! $category) {
            return response()->json([
                'message' => 'Category not found'
            ], 404);
        }

        $credentials = $request->validate([
            'name' => ['sometimes', 'string'],
            'slug' => ['sometimes', 'string'],
        ]);

        $category->update($credentials);

        return response()->json([
            'message' => 'Category update successfully',
            new CategoryResource($category)
        ], 200);
    }

    // Delete functions
    public function softDelete(Request $request) {
        $ids = $this->validateIds($request);

        $deleted = Category::whereIn('id', $ids)->delete();

        return response()->json([
            'message' => 'Categories deleted successfully'
        ]);
    }

    public function restore(Request $request) {
        $ids = $this->validateIds($request);

        $deleted = Category::onlyTrashed()
            ->whereIn('id', $ids)
            ->restore();

        return response()->json([
            'message' => 'Categories restored successfully'
        ]);
    }

    public function hardDelete(Request $request) {
        $ids = $this->validateIds($request);

        $deleted = Category::withTrashed()
            ->whereIn('id', $ids)
            ->forceDelete();

        return response()->json([
            'message' => 'Categories deleted permenantly successfully'
        ]);
    }


    // Validate ids
    protected function validateIds(Request $request): array {
        return $request->validate([
            'ids'   => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:categories,id'],
        ])['ids'];
    }
}
