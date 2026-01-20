<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Store;
use App\Models\Transfer;
use App\Models\TransferItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TransferController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Transfer::with(['fromStore', 'toStore', 'user']);

        // Search filter
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        // Status filter
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Type filter
        if ($request->filled('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        // From store filter
        if ($request->filled('from_store_id') && $request->from_store_id !== 'all') {
            $query->where('from_store_id', $request->from_store_id);
        }

        // To store filter
        if ($request->filled('to_store_id') && $request->to_store_id !== 'all') {
            $query->where('to_store_id', $request->to_store_id);
        }

        // Sorting
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        // Pagination
        $perPage = $request->get('per_page', 10);
        $transfers = $query->paginate($perPage)->withQueryString();

        // Get stores for filters
        $stores = Store::enabled()->orderBy('name')->get();

        return Inertia::render('Transfers/Index', [
            'transfers' => $transfers,
            'stores' => $stores,
            'filters' => [
                'search' => $request->search ?? '',
                'status' => $request->status ?? 'all',
                'type' => $request->type ?? 'all',
                'from_store_id' => $request->from_store_id ?? 'all',
                'to_store_id' => $request->to_store_id ?? 'all',
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
        $stores = Store::enabled()->orderBy('name')->get();
        $products = Product::enabled()->orderBy('name')->get();

        return Inertia::render('Transfers/Create', [
            'stores' => $stores,
            'products' => $products,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $rules = [
            'type' => 'required|in:add,transfer,remove',
            'transfer_date' => 'required|date',
            'observation' => 'nullable|string',
            'status' => 'required|in:pending,in_transit,completed,cancelled',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ];

        // Add conditional validation based on type
        if ($request->type === 'transfer') {
            $rules['from_store_id'] = 'required|exists:stores,id|different:to_store_id';
            $rules['to_store_id'] = 'required|exists:stores,id';
        } elseif ($request->type === 'add') {
            $rules['to_store_id'] = 'required|exists:stores,id';
            $rules['from_store_id'] = 'nullable';
        } elseif ($request->type === 'remove') {
            $rules['from_store_id'] = 'required|exists:stores,id';
            $rules['to_store_id'] = 'nullable';
        }

        $validated = $request->validate($rules);

        DB::transaction(function () use ($validated) {
            // Create transfer with auto-generated code
            $transfer = Transfer::create([
                'from_store_id' => $validated['from_store_id'] ?? null,
                'to_store_id' => $validated['to_store_id'] ?? null,
                'user_id' => auth()->id(),
                'type' => $validated['type'],
                'code' => Transfer::generateCode(),
                'transfer_date' => $validated['transfer_date'],
                'observation' => $validated['observation'],
                'status' => $validated['status'],
            ]);

            // Create transfer items
            foreach ($validated['items'] as $item) {
                TransferItem::create([
                    'transfer_id' => $transfer->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                ]);
            }
        });

        return redirect()->route('transfers.index')
            ->with('success', 'transfers.messages.created');
    }

    /**
     * Display the specified resource.
     */
    public function show(Transfer $transfer)
    {
        return Inertia::render('Transfers/Show', [
            'transfer' => $transfer->load(['fromStore', 'toStore', 'user', 'items.product']),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Transfer $transfer)
    {
        $stores = Store::enabled()->orderBy('name')->get();
        $products = Product::enabled()->orderBy('name')->get();

        return Inertia::render('Transfers/Edit', [
            'transfer' => $transfer->load(['items.product']),
            'stores' => $stores,
            'products' => $products,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Transfer $transfer)
    {
        $rules = [
            'type' => 'required|in:add,transfer,remove',
            'transfer_date' => 'required|date',
            'observation' => 'nullable|string',
            'status' => 'required|in:pending,in_transit,completed,cancelled',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ];

        // Add conditional validation based on type
        if ($request->type === 'transfer') {
            $rules['from_store_id'] = 'required|exists:stores,id|different:to_store_id';
            $rules['to_store_id'] = 'required|exists:stores,id';
        } elseif ($request->type === 'add') {
            $rules['to_store_id'] = 'required|exists:stores,id';
            $rules['from_store_id'] = 'nullable';
        } elseif ($request->type === 'remove') {
            $rules['from_store_id'] = 'required|exists:stores,id';
            $rules['to_store_id'] = 'nullable';
        }

        $validated = $request->validate($rules);

        DB::transaction(function () use ($validated, $transfer) {
            // Update transfer
            $transfer->update([
                'from_store_id' => $validated['from_store_id'] ?? null,
                'to_store_id' => $validated['to_store_id'] ?? null,
                'type' => $validated['type'],
                'transfer_date' => $validated['transfer_date'],
                'observation' => $validated['observation'],
                'status' => $validated['status'],
            ]);

            // Delete old items and create new ones
            $transfer->items()->delete();

            foreach ($validated['items'] as $item) {
                TransferItem::create([
                    'transfer_id' => $transfer->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                ]);
            }
        });

        return redirect()->route('transfers.index')
            ->with('success', 'transfers.messages.updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transfer $transfer)
    {
        $transfer->delete();

        return redirect()->route('transfers.index')
            ->with('success', 'transfers.messages.deleted');
    }
}
