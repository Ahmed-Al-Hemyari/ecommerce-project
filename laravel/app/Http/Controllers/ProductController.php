<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function getAllProducts(Request $request) {
        $filters = $request->only(['search', 'category', 'brand', 'stock', 'deleted']);
        // Pagination
        $limit = min($request->input('limit', 50), 150);

        $products = Product::with(['category' => function ($q) { $q->withTrashed(); }, 'brand' => function ($q) { $q->withTrashed(); }])->filter($filters)->paginate($limit);

        return response()->json([
            'products' => ProductResource::collection($products),
            'currentPage' => $products->currentPage(),
            'totalItems' => $products->total(),
            'totalPages' => $products->lastPage()
        ], 200);
    }

    public function getProductById($id) {

        $product = Product::with(['category', 'brand'])->withTrashed()->find($id);

        if (!$product) {
            return response()->json([
                'message' => 'Product not found'
            ], 404);
        }

        return response()->json(
            new ProductResource($product)
        , 200);
    }

    public function createProduct(StoreProductRequest $request) {
        $credentials = $request->validated();

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = time() . '_' . Str::slug($credentials['name']) . '.' . $file->getClientOriginalExtension();
            $file->storeAs('products', $filename, 'public');
            $credentials['image'] = $filename;
        }

        $product = Product::create($credentials);

        return response()->json([
            'message' => 'Product created successfully',
            'product' => new ProductResource($product),
        ], 201);
    }

    public function updateProduct(UpdateProductRequest $request, $id)
    {
        $product = Product::findOrFail($id);
        $data = $request->validated();

        if ($request->hasFile('image')) {
            if ($product->image && Storage::exists('public/products/' . $product->image)) {
                Storage::delete('public/products/' . $product->image);
            }

            $file = $request->file('image');
            $filename = time() . '_' . Str::slug($data['name'] ?? $product->name) . '.' . $file->getClientOriginalExtension();
            $file->storeAs('products', $filename, 'public');
            $data['image'] = $filename;
        }

        $product->update($data);
        $product->refresh();

        return response()->json([
            'message' => 'Product updated successfully',
            'product' => new ProductResource($product),
        ], 200);
    }

    public function addStock(Request $request, $id)
    {
        $request->validate([
            'stock' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($id);

        $product->increment('stock', $request->stock);

        return response()->json([
            'message' => 'Stock added successfully',
            'stock' => $product->stock,
        ]);
    }

    // Delete functions
    public function softDelete(Request $request) {
        $ids = $this->validateIds($request);

        $deleted = Product::whereIn('id', $ids)->delete();

        return response()->json([
            'message' => 'Products deleted successfully'
        ]);
    }

    public function restore(Request $request) {
        $ids = $this->validateIds($request);

        $deleted = Product::onlyTrashed()
            ->whereIn('id', $ids)
            ->restore();

        return response()->json([
            'message' => 'Products restored successfully'
        ]);
    }

    public function hardDelete(Request $request) {
        $ids = $this->validateIds($request);

        foreach ($ids as $id) {
            $product = Product::withTrashed()->findOrFail($id);

            if ($product->orderItems->isNotEmpty()) {
                return response()->json([
                    'message' => "Can't delete products with orders"
                ], 422);
            }
            
            // Delete old image if exists
            if ($product->image && Storage::exists('public/products/' . $product->image)) {
                Storage::delete('public/products/' . $product->image);
            }

            $product->forceDelete();
        }

        return response()->json([
            'message' => 'Products deleted permenantly successfully'
        ]);
    }


    // Validate ids
    protected function validateIds(Request $request): array {
        return $request->validate([
            'ids'   => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:products,id'],
        ])['ids'];
    }
}
