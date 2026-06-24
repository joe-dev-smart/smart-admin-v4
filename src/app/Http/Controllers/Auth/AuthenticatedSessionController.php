<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        // Track login activity
        $user = Auth::user();
        $user->update([
            'last_login_at' => now(),
            'last_login_ip' => $request->ip(),
            'login_count' => ($user->login_count ?? 0) + 1,
        ]);

        // Get the user's role redirect route
        $redirectRoute = 'dashboard';

        if ($user && $user->role && $user->role->redirect_route) {
            $redirectRoute = $user->role->redirect_route;
        }

        // Build the redirect URL based on the route name
        $redirectUrl = match($redirectRoute) {
            'stores' => route('stores.index', absolute: false),
            'clients' => route('clients.index', absolute: false),
            'providers' => route('providers.index', absolute: false),
            'categories' => route('categories.index', absolute: false),
            'brands' => route('brands.index', absolute: false),
            'products' => route('products.index', absolute: false),
            'purchases' => route('purchases.index', absolute: false),
            'transfers' => route('transfers.index', absolute: false),
            'profile' => route('profile.edit', absolute: false),
            default => route('dashboard', absolute: false),
        };

        return redirect()->intended($redirectUrl);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->user()?->update(['last_logout_at' => now()]);

        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
