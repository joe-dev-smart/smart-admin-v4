<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Provider;
use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PurchaseController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Purchase::with(['provider', 'store', 'user']);

        // Search filter
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        // Status filter
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Provider filter
        if ($request->filled('provider_id') && $request->provider_id !== 'all') {
            $query->where('provider_id', $request->provider_id);
        }

        // Store filter
        if ($request->filled('store_id') && $request->store_id !== 'all') {
            $query->where('store_id', $request->store_id);
        }

        // Sorting
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        // Pagination
        $perPage = $request->get('per_page', 10);
        $purchases = $query->paginate($perPage)->withQueryString();

        // Get providers and stores for filters
        $providers = Provider::enabled()->orderBy('name')->get();
        $stores = Store::enabled()->orderBy('name')->get();

        return Inertia::render('Purchases/Index', [
            'purchases' => $purchases,
            'providers' => $providers,
            'stores' => $stores,
            'filters' => [
                'search' => $request->search ?? '',
                'status' => $request->status ?? 'all',
                'provider_id' => $request->provider_id ?? 'all',
                'store_id' => $request->store_id ?? 'all',
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
        $providers = Provider::enabled()->orderBy('name')->get();
        $stores = Store::enabled()->orderBy('name')->get();
        $products = Product::enabled()->orderBy('name')->get();

        return Inertia::render('Purchases/Create', [
            'providers' => $providers,
            'stores' => $stores,
            'products' => $products,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'provider_id' => 'required|exists:providers,id',
            'store_id' => 'required|exists:stores,id',
            'invoice_number' => 'nullable|string|max:255',
            'purchase_date' => 'required|date',
            'tax' => 'nullable|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
            'observation' => 'nullable|string',
            'status' => 'required|in:pending,completed,cancelled',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_cost' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated, $request) {
            // Calculate totals
            $subtotal = 0;
            foreach ($validated['items'] as $item) {
                $subtotal += $item['quantity'] * $item['unit_cost'];
            }

            $tax = $validated['tax'] ?? 0;
            $discount = $validated['discount'] ?? 0;
            $total = $subtotal + $tax - $discount;

            // Create purchase with auto-generated code
            $purchase = Purchase::create([
                'provider_id' => $validated['provider_id'],
                'store_id' => $validated['store_id'],
                'user_id' => auth()->id(),
                'code' => Purchase::generateCode(),
                'invoice_number' => $validated['invoice_number'],
                'purchase_date' => $validated['purchase_date'],
                'subtotal' => $subtotal,
                'tax' => $tax,
                'discount' => $discount,
                'total' => $total,
                'observation' => $validated['observation'],
                'status' => $validated['status'],
            ]);

            // Create purchase items
            foreach ($validated['items'] as $item) {
                PurchaseItem::create([
                    'purchase_id' => $purchase->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_cost' => $item['unit_cost'],
                    'subtotal' => $item['quantity'] * $item['unit_cost'],
                ]);
            }
        });

        return redirect()->route('purchases.index')
            ->with('success', 'purchases.messages.created');
    }

    /**
     * Display the specified resource.
     */
    public function show(Purchase $purchase)
    {
        return Inertia::render('Purchases/Show', [
            'purchase' => $purchase->load(['provider', 'store', 'user', 'items.product']),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Purchase $purchase)
    {
        $providers = Provider::enabled()->orderBy('name')->get();
        $stores = Store::enabled()->orderBy('name')->get();
        $products = Product::enabled()->orderBy('name')->get();

        return Inertia::render('Purchases/Edit', [
            'purchase' => $purchase->load(['items.product']),
            'providers' => $providers,
            'stores' => $stores,
            'products' => $products,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Purchase $purchase)
    {
        $validated = $request->validate([
            'provider_id' => 'required|exists:providers,id',
            'store_id' => 'required|exists:stores,id',
            'invoice_number' => 'nullable|string|max:255',
            'purchase_date' => 'required|date',
            'tax' => 'nullable|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
            'observation' => 'nullable|string',
            'status' => 'required|in:pending,completed,cancelled',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_cost' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated, $purchase) {
            // Calculate totals
            $subtotal = 0;
            foreach ($validated['items'] as $item) {
                $subtotal += $item['quantity'] * $item['unit_cost'];
            }

            $tax = $validated['tax'] ?? 0;
            $discount = $validated['discount'] ?? 0;
            $total = $subtotal + $tax - $discount;

            // Update purchase
            $purchase->update([
                'provider_id' => $validated['provider_id'],
                'store_id' => $validated['store_id'],
                'invoice_number' => $validated['invoice_number'],
                'purchase_date' => $validated['purchase_date'],
                'subtotal' => $subtotal,
                'tax' => $tax,
                'discount' => $discount,
                'total' => $total,
                'observation' => $validated['observation'],
                'status' => $validated['status'],
            ]);

            // Delete old items and create new ones
            $purchase->items()->delete();

            foreach ($validated['items'] as $item) {
                PurchaseItem::create([
                    'purchase_id' => $purchase->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_cost' => $item['unit_cost'],
                    'subtotal' => $item['quantity'] * $item['unit_cost'],
                ]);
            }
        });

        return redirect()->route('purchases.index')
            ->with('success', 'purchases.messages.updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Purchase $purchase)
    {
        $purchase->delete();

        return redirect()->route('purchases.index')
            ->with('success', 'purchases.messages.deleted');
    }
}
