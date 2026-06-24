<?php

namespace App\Http\Controllers;

use App\Models\Role;
use App\Models\Store;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = User::with('role', 'stores');

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('username', 'like', "%{$search}%");
            });
        }

        // Role filter
        if ($request->filled('role_id') && $request->role_id !== 'all') {
            $query->where('role_id', $request->role_id);
        }

        // Status filter
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('is_active', $request->status === 'active');
        }

        // Sorting
        $sortField = $request->get('sort', 'name');
        $sortDirection = $request->get('direction', 'asc');
        $query->orderBy($sortField, $sortDirection);

        $users = $query->paginate(10)->withQueryString();
        $roles = Role::orderBy('name')->get();

        return Inertia::render('Users/Index', [
            'users' => $users,
            'roles' => $roles,
            'filters' => $request->only(['search', 'role_id', 'status', 'sort', 'direction']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $roles = Role::orderBy('name')->get();
        $stores = Store::orderBy('name')->get();

        return Inertia::render('Users/Create', [
            'roles' => $roles,
            'stores' => $stores,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => ['required', 'confirmed', Password::defaults()],
            'role_id' => 'required|exists:roles,id',
            'is_active' => 'boolean',
            'stores' => 'array',
            'stores.*' => 'exists:stores,id',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role_id' => $validated['role_id'],
            'is_active' => $validated['is_active'] ?? true,
        ]);

        if (!empty($validated['stores'])) {
            $user->stores()->sync($validated['stores']);
        }

        return redirect()->route('users.index')
            ->with('success', 'users.messages.created');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        $user->load('role', 'stores');

        // Get active sessions count for this user
        $activeSessions = DB::table('sessions')
            ->where('user_id', $user->id)
            ->count();

        // Get session details
        $sessions = DB::table('sessions')
            ->where('user_id', $user->id)
            ->select('id', 'ip_address', 'user_agent', 'last_activity')
            ->orderByDesc('last_activity')
            ->get()
            ->map(function ($session) {
                return [
                    'id' => $session->id,
                    'ip_address' => $session->ip_address,
                    'user_agent' => $session->user_agent,
                    'last_activity' => date('Y-m-d H:i:s', $session->last_activity),
                    'is_current' => $session->id === session()->getId(),
                ];
            });

        return Inertia::render('Users/Show', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'email' => $user->email,
                'role' => $user->role,
                'stores' => $user->stores,
                'is_active' => $user->is_active,
                'created_at' => $user->created_at?->format('Y-m-d H:i:s'),
                'updated_at' => $user->updated_at?->format('Y-m-d H:i:s'),
                'last_login_at' => $user->last_login_at?->format('Y-m-d H:i:s'),
                'last_login_ip' => $user->last_login_ip,
                'last_logout_at' => $user->last_logout_at?->format('Y-m-d H:i:s'),
                'password_changed_at' => $user->password_changed_at?->format('Y-m-d H:i:s'),
                'login_count' => $user->login_count,
                'email_verified_at' => $user->email_verified_at?->format('Y-m-d H:i:s'),
            ],
            'activeSessions' => $activeSessions,
            'sessions' => $sessions,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        $roles = Role::orderBy('name')->get();
        $stores = Store::orderBy('name')->get();
        $user->load('stores');

        return Inertia::render('Users/Edit', [
            'user' => $user,
            'roles' => $roles,
            'stores' => $stores,
            'userStores' => $user->stores->pluck('id')->toArray(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        // Prevent editing own super-admin status
        if ($user->id === Auth::id() && $user->isSuperAdmin()) {
            $request->merge(['role_id' => $user->role_id]);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => ['required', 'string', 'max:255', Rule::unique('users')->ignore($user->id)],
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => ['nullable', 'confirmed', Password::defaults()],
            'role_id' => 'required|exists:roles,id',
            'is_active' => 'boolean',
            'stores' => 'array',
            'stores.*' => 'exists:stores,id',
        ]);

        $userData = [
            'name' => $validated['name'],
            'username' => $validated['username'],
            'email' => $validated['email'],
            'role_id' => $validated['role_id'],
            'is_active' => $validated['is_active'] ?? true,
        ];

        if (!empty($validated['password'])) {
            $userData['password'] = Hash::make($validated['password']);
            $userData['password_changed_at'] = now();
        }

        $user->update($userData);
        $user->stores()->sync($validated['stores'] ?? []);

        return redirect()->route('users.index')
            ->with('success', 'users.messages.updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        // Prevent deleting own account
        if ($user->id === Auth::id()) {
            return back()->with('error', 'users.messages.cannotDeleteSelf');
        }

        // Prevent deleting super admin
        if ($user->isSuperAdmin()) {
            return back()->with('error', 'users.messages.cannotDeleteSuperAdmin');
        }

        $user->stores()->detach();
        $user->delete();

        return redirect()->route('users.index')
            ->with('success', 'users.messages.deleted');
    }

    /**
     * Force logout a user by invalidating their sessions.
     */
    public function forceLogout(User $user)
    {
        // Prevent logging out yourself
        if ($user->id === Auth::id()) {
            return back()->with('error', 'users.messages.cannotLogoutSelf');
        }

        // Delete all sessions for this user from the sessions table
        DB::table('sessions')
            ->where('user_id', $user->id)
            ->delete();

        return back()->with('success', 'users.messages.forceLogoutSuccess');
    }
}
