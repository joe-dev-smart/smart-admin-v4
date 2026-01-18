<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Product::with(['category', 'brand']);

        // Search filter
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        // Status filter
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Category filter
        if ($request->filled('category_id') && $request->category_id !== 'all') {
            $query->where('category_id', $request->category_id);
        }

        // Brand filter
        if ($request->filled('brand_id') && $request->brand_id !== 'all') {
            $query->where('brand_id', $request->brand_id);
        }

        // Sorting
        $sortField = $request->get('sort', 'name');
        $sortDirection = $request->get('direction', 'asc');
        $query->orderBy($sortField, $sortDirection);

        // Pagination
        $perPage = $request->get('per_page', 10);
        $products = $query->paginate($perPage)->withQueryString();

        // Get categories and brands for filters
        $categories = Category::enabled()->orderBy('name')->get();
        $brands = Brand::enabled()->orderBy('name')->get();

        return Inertia::render('Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'brands' => $brands,
            'filters' => [
                'search' => $request->search ?? '',
                'status' => $request->status ?? 'all',
                'category_id' => $request->category_id ?? 'all',
                'brand_id' => $request->brand_id ?? 'all',
                'sort' => $sortField,
                'direction' => $sortDirection,
                'per_page' => (int) $perPage,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $categories = Category::enabled()->orderBy('name')->get();
        $brands = Brand::enabled()->orderBy('name')->get();

        return Inertia::render('Products/Create', [
            'categories' => $categories,
            'brands' => $brands,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'required|exists:brands,id',
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255|unique:products,code',
            'barcode' => 'nullable|string|max:25',
            'type' => 'required|in:product,perishable_product,service',
            'unit_of_measurement' => 'required|in:unit,piece,meter,package,kilo,litre',
            'sale_price_1' => 'required|numeric|min:0',
            'sale_price_2' => 'nullable|numeric|min:0',
            'sale_price_3' => 'nullable|numeric|min:0',
            'sale_price_4' => 'nullable|numeric|min:0',
            'minimum_stock' => 'nullable|integer|min:0',
            'model' => 'nullable|string|max:255',
            'size' => 'nullable|string|max:255',
            'color' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:enabled,disabled',
        ]);

        Product::create($validated);

        return redirect()->route('products.index')
            ->with('success', 'products.messages.created');
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return Inertia::render('Products/Show', [
            'product' => $product->load(['category', 'brand']),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product)
    {
        $categories = Category::enabled()->orderBy('name')->get();
        $brands = Brand::enabled()->orderBy('name')->get();

        return Inertia::render('Products/Edit', [
            'product' => $product,
            'categories' => $categories,
            'brands' => $brands,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'brand_id' => 'required|exists:brands,id',
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255|unique:products,code,' . $product->id,
            'barcode' => 'nullable|string|max:25',
            'type' => 'required|in:product,perishable_product,service',
            'unit_of_measurement' => 'required|in:unit,piece,meter,package,kilo,litre',
            'sale_price_1' => 'required|numeric|min:0',
            'sale_price_2' => 'nullable|numeric|min:0',
            'sale_price_3' => 'nullable|numeric|min:0',
            'sale_price_4' => 'nullable|numeric|min:0',
            'minimum_stock' => 'nullable|integer|min:0',
            'model' => 'nullable|string|max:255',
            'size' => 'nullable|string|max:255',
            'color' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:enabled,disabled',
        ]);

        $product->update($validated);

        return redirect()->route('products.index')
            ->with('success', 'products.messages.updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('products.index')
            ->with('success', 'products.messages.deleted');
    }
}
