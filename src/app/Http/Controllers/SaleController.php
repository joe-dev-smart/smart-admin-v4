<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Movement;
use App\Models\Product;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Stock;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class SaleController extends Controller
{
    public function index(Request $request)
    {
        $query = Sale::with(['store', 'user', 'client']);

        if ($request->filled('search')) {
            $query->search($request->search);
        }
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        if ($request->filled('store_id') && $request->store_id !== 'all') {
            $query->where('store_id', $request->store_id);
        }
        if ($request->filled('payment') && $request->payment !== 'all') {
            $query->where('payment', $request->payment);
        }

        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $perPage = $request->get('per_page', 10);
        $sales = $query->paginate($perPage)->withQueryString();

        $stores = Store::enabled()->allowSales()->orderBy('name')->get();

        return Inertia::render('Sales/Index', [
            'sales' => $sales,
            'stores' => $stores,
            'filters' => [
                'search' => $request->search ?? '',
                'status' => $request->status ?? 'all',
                'store_id' => $request->store_id ?? 'all',
                'payment' => $request->payment ?? 'all',
                'sort' => $sortField,
                'direction' => $sortDirection,
                'per_page' => (int) $perPage,
            ],
        ]);
    }

    public function create()
    {
        $stores = Store::enabled()->allowSales()->orderBy('name')->get();
        $clients = Client::enabled()->orderBy('name')->get();
        $products = Product::enabled()->with('stocks')->orderBy('name')->get();

        return Inertia::render('Sales/Create', [
            'stores' => $stores,
            'clients' => $clients,
            'products' => $products,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'store_id' => 'required|exists:stores,id',
            'client_id' => 'required|exists:clients,id',
            'sale_date' => 'required|date',
            'payment' => 'required|in:cash,bank_deposit,card,qr_payment,check,payment_plan',
            'paid' => 'required|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
            'observation' => 'nullable|string',
            'status' => 'required|in:valid,annulled,draft',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.sale_price' => 'required|numeric|min:0',
            'items.*.detail' => 'nullable|string',
        ]);

        /** @var \App\Models\User $currentUser */
        $currentUser = Auth::user();
        $userId = $currentUser->id;

        DB::transaction(function () use ($validated, $userId) {
            $subtotal = array_reduce(
                $validated['items'],
                fn($sum, $item) => $sum + $item['quantity'] * $item['sale_price'],
                0
            );
            $discount = $validated['discount'] ?? 0;
            $total = $subtotal - $discount;
            $paid = $validated['paid'];
            $hasDebt = 'no';

            if ($validated['status'] === 'valid' && $paid < $total) {
                $hasDebt = 'yes';
            }

            $sale = Sale::create([
                'store_id' => $validated['store_id'],
                'user_id' => $userId,
                'client_id' => $validated['client_id'],
                'code' => Sale::generateCode(),
                'sale_date' => $validated['sale_date'],
                'subtotal' => $subtotal,
                'discount' => $discount,
                'payment' => $validated['payment'],
                'paid' => $paid,
                'has_debt' => $hasDebt,
                'observation' => $validated['observation'] ?? null,
                'status' => $validated['status'],
            ]);

            foreach ($validated['items'] as $item) {
                $product = Product::find($item['product_id']);
                $stockId = null;

                // Deduct stock for valid sales of physical products
                if ($validated['status'] === 'valid' && $product?->type !== 'service') {
                    $stock = Stock::removeQuantity(
                        productId: $item['product_id'],
                        storeId: $validated['store_id'],
                        quantity: $item['quantity'],
                    );
                    $stockId = $stock->id;

                    Movement::create([
                        'product_id' => $item['product_id'],
                        'store_id' => $validated['store_id'],
                        'user_id' => $userId,
                        'stock_id' => $stockId,
                        'type' => 'sale',
                        'quantity' => $item['quantity'],
                        'system_description' => "Sale #{$sale->code}",
                        'movable_type' => Sale::class,
                        'movable_id' => $sale->id,
                    ]);
                }

                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $item['product_id'],
                    'stock_id' => $stockId,
                    'product_name' => $product?->name,
                    'quantity' => $item['quantity'],
                    'sale_price' => $item['sale_price'],
                    'detail' => $item['detail'] ?? null,
                ]);
            }
        });

        return redirect()->route('sales.index')
            ->with('success', 'sales.messages.created');
    }

    public function show(Sale $sale)
    {
        return Inertia::render('Sales/Show', [
            'sale' => $sale->load(['store', 'user', 'client', 'items.product']),
        ]);
    }

    public function edit(Sale $sale)
    {
        abort_if($sale->status === 'annulled', 403, 'Cannot edit an annulled sale.');

        $stores = Store::enabled()->allowSales()->orderBy('name')->get();
        $clients = Client::enabled()->orderBy('name')->get();
        $products = Product::enabled()->orderBy('name')->get();

        return Inertia::render('Sales/Edit', [
            'sale' => $sale->load(['items.product']),
            'stores' => $stores,
            'clients' => $clients,
            'products' => $products,
        ]);
    }

    public function update(Request $request, Sale $sale)
    {
        abort_if($sale->status === 'annulled', 403, 'Cannot edit an annulled sale.');

        $validated = $request->validate([
            'store_id' => 'required|exists:stores,id',
            'client_id' => 'required|exists:clients,id',
            'sale_date' => 'required|date',
            'payment' => 'required|in:cash,bank_deposit,card,qr_payment,check,payment_plan',
            'paid' => 'required|numeric|min:0',
            'discount' => 'nullable|numeric|min:0',
            'observation' => 'nullable|string',
            'status' => 'required|in:valid,annulled,draft',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.sale_price' => 'required|numeric|min:0',
            'items.*.detail' => 'nullable|string',
        ]);

        DB::transaction(function () use ($validated, $sale) {
            $subtotal = array_reduce(
                $validated['items'],
                fn($sum, $item) => $sum + $item['quantity'] * $item['sale_price'],
                0
            );
            $discount = $validated['discount'] ?? 0;
            $total = $subtotal - $discount;
            $paid = $validated['paid'];
            $hasDebt = ($validated['status'] === 'valid' && $paid < $total) ? 'yes' : 'no';

            $sale->update([
                'store_id' => $validated['store_id'],
                'client_id' => $validated['client_id'],
                'sale_date' => $validated['sale_date'],
                'subtotal' => $subtotal,
                'discount' => $discount,
                'payment' => $validated['payment'],
                'paid' => $paid,
                'has_debt' => $hasDebt,
                'observation' => $validated['observation'] ?? null,
                'status' => $validated['status'],
            ]);

            // For draft→valid transitions, recreate items with stock deductions
            $sale->items()->delete();

            foreach ($validated['items'] as $item) {
                $product = Product::find($item['product_id']);

                SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $item['product_id'],
                    'product_name' => $product?->name,
                    'quantity' => $item['quantity'],
                    'sale_price' => $item['sale_price'],
                    'detail' => $item['detail'] ?? null,
                ]);
            }
        });

        return redirect()->route('sales.index')
            ->with('success', 'sales.messages.updated');
    }

    /**
     * Annul a sale and return stock.
     */
    public function annul(Sale $sale)
    {
        abort_if($sale->status === 'annulled', 403, 'Sale is already annulled.');

        /** @var \App\Models\User $currentUser */
        $currentUser = Auth::user();
        $userId = $currentUser->id;

        DB::transaction(function () use ($sale, $userId) {
            // Restore stock for each item that had stock deducted
            foreach ($sale->items()->with('product')->get() as $item) {
                if ($item->product?->type !== 'service' && $item->stock_id) {
                    $stock = Stock::addQuantity(
                        productId: $item->product_id,
                        storeId: $sale->store_id,
                        quantity: $item->quantity,
                    );

                    Movement::create([
                        'product_id' => $item->product_id,
                        'store_id' => $sale->store_id,
                        'user_id' => $userId,
                        'stock_id' => $stock->id,
                        'type' => 'sale_return',
                        'quantity' => $item->quantity,
                        'system_description' => "Sale return — annulled #{$sale->code}",
                        'movable_type' => Sale::class,
                        'movable_id' => $sale->id,
                    ]);
                }
            }

            $sale->update(['status' => 'annulled']);
        });

        return back()->with('success', 'sales.messages.annulled');
    }

    public function destroy(Sale $sale)
    {
        abort_if($sale->status === 'valid', 403, 'Cannot delete a valid sale. Annul it first.');

        $sale->delete();

        return redirect()->route('sales.index')
            ->with('success', 'sales.messages.deleted');
    }
}
