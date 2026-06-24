<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Role::withCount('users');

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sortField = $request->get('sort', 'name');
        $sortDirection = $request->get('direction', 'asc');
        $query->orderBy($sortField, $sortDirection);

        $roles = $query->paginate(10)->withQueryString();

        return Inertia::render('Roles/Index', [
            'roles' => $roles,
            'filters' => $request->only(['search', 'sort', 'direction']),
        ]);
    }

    /**
     * Get available redirect routes for roles.
     */
    private function getAvailableRoutes(): array
    {
        return [
            ['value' => 'dashboard', 'label' => 'Dashboard'],
            ['value' => 'stores', 'label' => 'Ubicaciones'],
            ['value' => 'clients', 'label' => 'Clientes'],
            ['value' => 'providers', 'label' => 'Proveedores'],
            ['value' => 'categories', 'label' => 'Categorías'],
            ['value' => 'brands', 'label' => 'Marcas'],
            ['value' => 'products', 'label' => 'Productos'],
            ['value' => 'purchases', 'label' => 'Compras'],
            ['value' => 'transfers', 'label' => 'Traslados'],
            ['value' => 'profile', 'label' => 'Perfil'],
        ];
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $permissions = Permission::orderBy('module')->orderBy('action')->get();
        $groupedPermissions = $permissions->groupBy('module');

        return Inertia::render('Roles/Create', [
            'permissions' => $permissions,
            'groupedPermissions' => $groupedPermissions,
            'availableRoutes' => $this->getAvailableRoutes(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'description' => 'nullable|string|max:500',
            'redirect_route' => 'nullable|string|max:255',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role = Role::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'description' => $validated['description'] ?? null,
            'redirect_route' => $validated['redirect_route'] ?? 'dashboard',
            'is_system' => false,
        ]);

        if (!empty($validated['permissions'])) {
            $role->permissions()->sync($validated['permissions']);
        }

        return redirect()->route('roles.index')
            ->with('success', 'Rol creado exitosamente.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Role $role)
    {
        $permissions = Permission::orderBy('module')->orderBy('action')->get();
        $groupedPermissions = $permissions->groupBy('module');
        $role->load('permissions');

        return Inertia::render('Roles/Edit', [
            'role' => $role,
            'permissions' => $permissions,
            'groupedPermissions' => $groupedPermissions,
            'rolePermissions' => $role->permissions->pluck('id')->toArray(),
            'availableRoutes' => $this->getAvailableRoutes(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Role $role)
    {
        // Prevent editing super-admin role slug
        if ($role->slug === 'super-admin' && !auth()->user()->isSuperAdmin()) {
            abort(403, 'No puedes modificar el rol de Super Admin.');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('roles')->ignore($role->id)],
            'description' => 'nullable|string|max:500',
            'redirect_route' => 'nullable|string|max:255',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $role->update([
            'name' => $validated['name'],
            'slug' => $role->is_system ? $role->slug : Str::slug($validated['name']),
            'description' => $validated['description'] ?? null,
            'redirect_route' => $validated['redirect_route'] ?? 'dashboard',
        ]);

        $role->permissions()->sync($validated['permissions'] ?? []);

        return redirect()->route('roles.index')
            ->with('success', 'Rol actualizado exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        // Prevent deleting system roles
        if ($role->is_system) {
            return back()->with('error', 'No se puede eliminar un rol del sistema.');
        }

        // Check if role has users assigned
        if ($role->users()->count() > 0) {
            return back()->with('error', 'No se puede eliminar un rol que tiene usuarios asignados.');
        }

        $role->permissions()->detach();
        $role->delete();

        return redirect()->route('roles.index')
            ->with('success', 'Rol eliminado exitosamente.');
    }
}
