<?php

namespace App\Http\Controllers;

use App\Models\Provider;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProviderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Provider::query();

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
        $providers = $query->paginate($perPage)->withQueryString();

        return Inertia::render('Providers/Index', [
            'providers' => $providers,
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
        return Inertia::render('Providers/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'nit' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'cellphone' => 'nullable|string|max:255',
            'cellphone_2' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:255',
            'phone_2' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'observation' => 'nullable|string',
            'status' => 'required|in:enabled,disabled',
        ]);

        Provider::create($validated);

        return redirect()->route('providers.index')
            ->with('success', 'providers.messages.created');
    }

    /**
     * Display the specified resource.
     */
    public function show(Provider $provider)
    {
        return Inertia::render('Providers/Show', [
            'provider' => $provider,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Provider $provider)
    {
        return Inertia::render('Providers/Edit', [
            'provider' => $provider,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Provider $provider)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'nit' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'cellphone' => 'nullable|string|max:255',
            'cellphone_2' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:255',
            'phone_2' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'observation' => 'nullable|string',
            'status' => 'required|in:enabled,disabled',
        ]);

        $provider->update($validated);

        return redirect()->route('providers.index')
            ->with('success', 'providers.messages.updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Provider $provider)
    {
        $provider->delete();

        return redirect()->route('providers.index')
            ->with('success', 'providers.messages.deleted');
    }
}
