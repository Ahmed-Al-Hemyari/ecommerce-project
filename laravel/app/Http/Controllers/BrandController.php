<?php

namespace App\Http\Controllers;

use App\Http\Resources\BrandResource;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BrandController extends Controller
{
     public function getAllBrands(Request $request) {
        $filters = $request->only(['search', 'deleted']);
        // Pagination
        $limit = min($request->input('limit', 50), 150);

        $brands = Brand::filter($filters)->paginate($limit);

        return response()->json([
            'brands' => BrandResource::collection($brands),
            'currentPage' => $brands->currentPage(),
            'totalItems' => $brands->total(),
            'totalPages' => $brands->lastPage()
        ], 200);
    }

    public function getBrandById($id) {

        $brand = Brand::withTrashed()->find($id);

        if (!$brand) {
            return response()->json([
                'message' => 'Brand not found'
            ], 404);
        }

        return response()->json(
            new BrandResource($brand)
        , 200);
    }

    public function createBrand(Request $request) {
        $credentials = $request->validate([
            'name' => ['required', 'string'],
            'file' => ['required', 'image', 'mimes:jpg,jpeg,png,webp'],
        ]);

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $filename = time() . '_' . $request->input('name') . '.' . $file->getClientOriginalExtension();
            $path = $file->storeAs('brands', $filename, 'public');
            $credentials['logo'] = $filename;
        }

        $brand = Brand::create([
            'name' => $credentials['name'],
            'logo' => $credentials['logo'],
        ]);

        return response()->json([
            'message' => 'Brand created successfully',
            new BrandResource($brand)
        ], 201);
    }

    public function updateBrand(Request $request, $id) {
        $brand = Brand::findOrFail($id);

        $credentials = $request->validate([
            'name' => ['sometimes', 'string'],
            'file' => ['sometimes', 'image', 'mimes:jpg,jpeg,png,webp'],
        ]);

        if ($request->hasFile('file')) {
            // Delete old logo if exists
            if ($brand->logo && Storage::exists('public/brands/' . $brand->logo)) {
                Storage::delete('public/brands/' . $brand->logo);
            }

            $file = $request->file('file');
            $filename = time() . '_' . $request->input('name') . '.' . $file->getClientOriginalExtension();
            $file->storeAs('brands', $filename, 'public');

            $credentials['logo'] = $filename;
        }

        $brand->update($credentials);

        return response()->json([
            'message' => 'Brand update successfully',
            new BrandResource($brand)
        ], 200);
    }

    // Delete functions
    public function softDelete(Request $request) {
        $ids = $this->validateIds($request);

        $deleted = Brand::whereIn('id', $ids)->delete();

        return response()->json([
            'message' => 'Brands deleted successfully'
        ]);
    }

    public function restore(Request $request) {
        $ids = $this->validateIds($request);

        $deleted = Brand::onlyTrashed()
            ->whereIn('id', $ids)
            ->restore();

        return response()->json([
            'message' => 'Brands restored successfully'
        ]);
    }

    public function hardDelete(Request $request) {
        $ids = $this->validateIds($request);

        $deleted = Brand::withTrashed()
            ->whereIn('id', $ids)
            ->forceDelete();

        return response()->json([
            'message' => 'Brands deleted permenantly successfully'
        ]);
    }


    // Validate ids
    protected function validateIds(Request $request): array {
        return $request->validate([
            'ids'   => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:brands,id'],
        ])['ids'];
    }
}
