<?php

use App\Http\Controllers\BrandController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProviderController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\TransferController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Stores (Ubicaciones)
    Route::resource('stores', StoreController::class);

    // Clients (Clientes)
    Route::resource('clients', ClientController::class);

    // Providers (Proveedores)
    Route::resource('providers', ProviderController::class);

    // Categories (Categorías)
    Route::resource('categories', CategoryController::class);

    // Brands (Marcas)
    Route::resource('brands', BrandController::class);

    // Products (Productos)
    Route::resource('products', ProductController::class);

    // Purchases (Compras)
    Route::resource('purchases', PurchaseController::class);

    // Transfers (Traslados)
    Route::resource('transfers', TransferController::class);
});

require __DIR__.'/auth.php';
