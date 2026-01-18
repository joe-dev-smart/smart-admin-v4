<?php

namespace App\Http\Controllers;

use App\Models\Store;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StoreController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Store::query();

        // Search filter
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        // Status filter
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Sorting
        $sortField = $request->get('sort', 'name');
        $sortDirection = $request->get('direction', 'asc');
        $query->orderBy($sortField, $sortDirection);

        // Pagination
        $perPage = $request->get('per_page', 10);
        $stores = $query->paginate($perPage)->withQueryString();

        return Inertia::render('Stores/Index', [
            'stores' => $stores,
            'filters' => [
                'search' => $request->search ?? '',
                'status' => $request->status ?? 'all',
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
        return Inertia::render('Stores/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'google_maps_url' => 'nullable|url',
            'description' => 'nullable|string',
            'allow_sales' => 'required|in:enabled,disabled',
            'status' => 'required|in:enabled,disabled',
        ]);

        Store::create($validated);

        return redirect()->route('stores.index')
            ->with('success', 'stores.messages.created');
    }

    /**
     * Display the specified resource.
     */
    public function show(Store $store)
    {
        return Inertia::render('Stores/Show', [
            'store' => $store,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Store $store)
    {
        return Inertia::render('Stores/Edit', [
            'store' => $store,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Store $store)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'google_maps_url' => 'nullable|url',
            'description' => 'nullable|string',
            'allow_sales' => 'required|in:enabled,disabled',
            'status' => 'required|in:enabled,disabled',
        ]);

        $store->update($validated);

        return redirect()->route('stores.index')
            ->with('success', 'stores.messages.updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Store $store)
    {
        // TODO: Check for related records before deleting
        // if ($store->movements()->exists() || $store->sales()->exists()) {
        //     return back()->with('error', 'stores.messages.hasRelatedRecords');
        // }

        $store->delete();

        return redirect()->route('stores.index')
            ->with('success', 'stores.messages.deleted');
    }
}
