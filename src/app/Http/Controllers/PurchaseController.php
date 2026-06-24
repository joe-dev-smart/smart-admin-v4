<?php

namespace App\Http\Controllers;

use App\Models\Movement;
use App\Models\Product;
use App\Models\Provider;
use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\Stock;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PurchaseController extends Controller
{
    public function index(Request $request)
    {
        $query = Purchase::with(['provider', 'store', 'user']);

        if ($request->filled('search')) {
            $query->search($request->search);
        }
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        if ($request->filled('provider_id') && $request->provider_id !== 'all') {
            $query->where('provider_id', $request->provider_id);
        }
        if ($request->filled('store_id') && $request->store_id !== 'all') {
            $query->where('store_id', $request->store_id);
        }

        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $perPage = $request->get('per_page', 10);
        $purchases = $query->paginate($perPage)->withQueryString();

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

        /** @var \App\Models\User $currentUser */
        $currentUser = Auth::user();
        $userId = $currentUser->id;

        DB::transaction(function () use ($validated, $userId) {
            $subtotal = array_reduce($validated['items'], fn($sum, $item) => $sum + $item['quantity'] * $item['unit_cost'], 0);
            $tax = $validated['tax'] ?? 0;
            $discount = $validated['discount'] ?? 0;
            $total = $subtotal + $tax - $discount;

            $purchase = Purchase::create([
                'provider_id' => $validated['provider_id'],
                'store_id' => $validated['store_id'],
                'user_id' => $userId,
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

            foreach ($validated['items'] as $item) {
                PurchaseItem::create([
                    'purchase_id' => $purchase->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_cost' => $item['unit_cost'],
                    'subtotal' => $item['quantity'] * $item['unit_cost'],
                ]);
            }

            if ($validated['status'] === 'completed') {
                $this->applyStockAndMovements($purchase);
            }
        });

        return redirect()->route('purchases.index')
            ->with('success', 'purchases.messages.created');
    }

    public function show(Purchase $purchase)
    {
        return Inertia::render('Purchases/Show', [
            'purchase' => $purchase->load(['provider', 'store', 'user', 'items.product']),
        ]);
    }

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
            $previousStatus = $purchase->status;

            $subtotal = array_reduce($validated['items'], fn($sum, $item) => $sum + $item['quantity'] * $item['unit_cost'], 0);
            $tax = $validated['tax'] ?? 0;
            $discount = $validated['discount'] ?? 0;
            $total = $subtotal + $tax - $discount;

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

            // Apply stock only when transitioning to "completed" for the first time
            if ($previousStatus !== 'completed' && $validated['status'] === 'completed') {
                $purchase->refresh();
                $this->applyStockAndMovements($purchase);
            }
        });

        return redirect()->route('purchases.index')
            ->with('success', 'purchases.messages.updated');
    }

    public function destroy(Purchase $purchase)
    {
        $purchase->delete();

        return redirect()->route('purchases.index')
            ->with('success', 'purchases.messages.deleted');
    }

    /**
     * Create stock entries and movement records for a completed purchase.
     */
    private function applyStockAndMovements(Purchase $purchase): void
    {
        $purchase->load('items');

        foreach ($purchase->items as $item) {
            $stock = Stock::addQuantity(
                productId: $item->product_id,
                storeId: $purchase->store_id,
                quantity: $item->quantity,
            );

            Movement::create([
                'product_id' => $item->product_id,
                'store_id' => $purchase->store_id,
                'user_id' => $purchase->user_id,
                'stock_id' => $stock->id,
                'type' => 'entry',
                'quantity' => $item->quantity,
                'system_description' => "Entry from purchase #{$purchase->code}",
                'movable_type' => Purchase::class,
                'movable_id' => $purchase->id,
            ]);
        }
    }
}
