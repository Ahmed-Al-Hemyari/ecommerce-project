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

        $products = Product::with(['category', 'brand'])->filter($filters)->paginate($limit);

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

        if ($request->hasFile('file')) {
            $file = $request->file('file');
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

        if ($request->hasFile('file')) {
            if ($product->image && Storage::exists('public/products/' . $product->image)) {
                Storage::delete('public/products/' . $product->image);
            }

            $file = $request->file('file');
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
}
