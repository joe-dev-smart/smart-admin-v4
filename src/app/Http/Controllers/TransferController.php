<?php

namespace App\Http\Controllers;

use App\Models\Movement;
use App\Models\Product;
use App\Models\Stock;
use App\Models\Store;
use App\Models\Transfer;
use App\Models\TransferItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TransferController extends Controller
{
    public function index(Request $request)
    {
        $query = Transfer::with(['fromStore', 'toStore', 'user']);

        if ($request->filled('search')) {
            $query->search($request->search);
        }
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        if ($request->filled('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }
        if ($request->filled('from_store_id') && $request->from_store_id !== 'all') {
            $query->where('from_store_id', $request->from_store_id);
        }
        if ($request->filled('to_store_id') && $request->to_store_id !== 'all') {
            $query->where('to_store_id', $request->to_store_id);
        }

        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $perPage = $request->get('per_page', 10);
        $transfers = $query->paginate($perPage)->withQueryString();
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

    public function create()
    {
        $stores = Store::enabled()->orderBy('name')->get();
        $products = Product::enabled()->orderBy('name')->get();

        return Inertia::render('Transfers/Create', [
            'stores' => $stores,
            'products' => $products,
        ]);
    }

    public function store(Request $request)
    {
        $rules = $this->validationRules($request->type);
        $validated = $request->validate($rules);
        /** @var \App\Models\User $currentUser */
        $currentUser = Auth::user();
        $userId = $currentUser->id;

        DB::transaction(function () use ($validated, $userId) {
            $transfer = Transfer::create([
                'from_store_id' => $validated['from_store_id'] ?? null,
                'to_store_id' => $validated['to_store_id'] ?? null,
                'user_id' => $userId,
                'type' => $validated['type'],
                'code' => Transfer::generateCode(),
                'transfer_date' => $validated['transfer_date'],
                'observation' => $validated['observation'] ?? null,
                'status' => $validated['status'],
            ]);

            foreach ($validated['items'] as $item) {
                TransferItem::create([
                    'transfer_id' => $transfer->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                ]);
            }

            if ($validated['status'] === 'completed') {
                $this->applyStockAndMovements($transfer);
            }
        });

        return redirect()->route('transfers.index')
            ->with('success', 'transfers.messages.created');
    }

    public function show(Transfer $transfer)
    {
        return Inertia::render('Transfers/Show', [
            'transfer' => $transfer->load(['fromStore', 'toStore', 'user', 'items.product']),
        ]);
    }

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

    public function update(Request $request, Transfer $transfer)
    {
        $rules = $this->validationRules($request->type);
        $validated = $request->validate($rules);
        $previousStatus = $transfer->status;

        DB::transaction(function () use ($validated, $transfer, $previousStatus) {
            $transfer->update([
                'from_store_id' => $validated['from_store_id'] ?? null,
                'to_store_id' => $validated['to_store_id'] ?? null,
                'type' => $validated['type'],
                'transfer_date' => $validated['transfer_date'],
                'observation' => $validated['observation'] ?? null,
                'status' => $validated['status'],
            ]);

            $transfer->items()->delete();

            foreach ($validated['items'] as $item) {
                TransferItem::create([
                    'transfer_id' => $transfer->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                ]);
            }

            if ($previousStatus !== 'completed' && $validated['status'] === 'completed') {
                $transfer->refresh();
                $this->applyStockAndMovements($transfer);
            }
        });

        return redirect()->route('transfers.index')
            ->with('success', 'transfers.messages.updated');
    }

    public function destroy(Transfer $transfer)
    {
        $transfer->delete();

        return redirect()->route('transfers.index')
            ->with('success', 'transfers.messages.deleted');
    }

    /**
     * Build validation rules based on transfer type.
     */
    private function validationRules(string $type): array
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

        if ($type === 'transfer') {
            $rules['from_store_id'] = 'required|exists:stores,id|different:to_store_id';
            $rules['to_store_id'] = 'required|exists:stores,id';
        } elseif ($type === 'add') {
            $rules['to_store_id'] = 'required|exists:stores,id';
            $rules['from_store_id'] = 'nullable';
        } elseif ($type === 'remove') {
            $rules['from_store_id'] = 'required|exists:stores,id';
            $rules['to_store_id'] = 'nullable';
        }

        return $rules;
    }

    /**
     * Apply stock changes and create movement records for a completed transfer.
     */
    private function applyStockAndMovements(Transfer $transfer): void
    {
        $transfer->load('items');
        $userId = $transfer->user_id;

        foreach ($transfer->items as $item) {
            match ($transfer->type) {
                'add' => $this->applyAdd($transfer, $item, $userId),
                'remove' => $this->applyRemove($transfer, $item, $userId),
                'transfer' => $this->applyTransfer($transfer, $item, $userId),
            };
        }
    }

    private function applyAdd(Transfer $transfer, TransferItem $item, int $userId): void
    {
        $stock = Stock::addQuantity($item->product_id, $transfer->to_store_id, $item->quantity);

        Movement::create([
            'product_id' => $item->product_id,
            'store_id' => $transfer->to_store_id,
            'user_id' => $userId,
            'stock_id' => $stock->id,
            'type' => 'entry',
            'quantity' => $item->quantity,
            'system_description' => "Stock addition via transfer #{$transfer->code}",
            'movable_type' => Transfer::class,
            'movable_id' => $transfer->id,
        ]);
    }

    private function applyRemove(Transfer $transfer, TransferItem $item, int $userId): void
    {
        $stock = Stock::removeQuantity($item->product_id, $transfer->from_store_id, $item->quantity);

        Movement::create([
            'product_id' => $item->product_id,
            'store_id' => $transfer->from_store_id,
            'user_id' => $userId,
            'stock_id' => $stock->id,
            'type' => 'remove',
            'quantity' => $item->quantity,
            'system_description' => "Stock removal via transfer #{$transfer->code}",
            'movable_type' => Transfer::class,
            'movable_id' => $transfer->id,
        ]);
    }

    private function applyTransfer(Transfer $transfer, TransferItem $item, int $userId): void
    {
        $stockOut = Stock::removeQuantity($item->product_id, $transfer->from_store_id, $item->quantity);
        $stockIn = Stock::addQuantity($item->product_id, $transfer->to_store_id, $item->quantity);

        $movOut = Movement::create([
            'product_id' => $item->product_id,
            'store_id' => $transfer->from_store_id,
            'user_id' => $userId,
            'stock_id' => $stockOut->id,
            'type' => 'out_transfer',
            'quantity' => $item->quantity,
            'system_description' => "Transfer out to store #{$transfer->to_store_id} via #{$transfer->code}",
            'movable_type' => Transfer::class,
            'movable_id' => $transfer->id,
        ]);

        $movIn = Movement::create([
            'product_id' => $item->product_id,
            'store_id' => $transfer->to_store_id,
            'user_id' => $userId,
            'stock_id' => $stockIn->id,
            'type' => 'entry_transfer',
            'quantity' => $item->quantity,
            'system_description' => "Transfer in from store #{$transfer->from_store_id} via #{$transfer->code}",
            'transfer_movement_id' => $movOut->id,
            'movable_type' => Transfer::class,
            'movable_id' => $transfer->id,
        ]);

        // Back-link the out movement to its paired in movement
        $movOut->update(['transfer_movement_id' => $movIn->id]);
    }
}
