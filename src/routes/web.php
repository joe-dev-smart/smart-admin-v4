<?php

use App\Http\Controllers\BrandController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProviderController;
use App\Http\Controllers\PurchaseController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\TransferController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
});

Route::get('/dashboard', function () {
    $lowStockCount = \App\Models\Stock::whereHas('product', fn($q) =>
        $q->whereColumn('stocks.quantity', '<=', 'products.minimum_stock')
          ->where('products.minimum_stock', '>', 0)
    )->count();

    $totalProducts = \App\Models\Product::where('status', 'enabled')->count();
    $todaySales = \App\Models\Sale::where('status', 'valid')
        ->whereDate('sale_date', today())->count();
    $todaySalesTotal = (float) \App\Models\Sale::where('status', 'valid')
        ->whereDate('sale_date', today())->sum(\Illuminate\Support\Facades\DB::raw('subtotal - discount'));

    $todayPurchases = \App\Models\Purchase::whereDate('purchase_date', today())->count();
    $todayPurchasesTotal = (float) \App\Models\Purchase::whereDate('purchase_date', today())->sum('total');

    $recentSales = \App\Models\Sale::with(['client', 'store', 'user'])
        ->where('status', 'valid')
        ->latest()
        ->take(5)
        ->get()
        ->map(fn($s) => [
            'id' => $s->id,
            'code' => $s->code,
            'client' => $s->client?->name,
            'store' => $s->store?->name,
            'total' => number_format((float) $s->subtotal - (float) $s->discount, 2),
            'sale_date' => $s->sale_date?->format('Y-m-d'),
        ]);

    $lowStockAlerts = \App\Models\Stock::with(['product', 'store'])
        ->whereHas('product', fn($q) =>
            $q->whereColumn('stocks.quantity', '<=', 'products.minimum_stock')
              ->where('products.minimum_stock', '>', 0)
        )
        ->orderBy('quantity')
        ->take(5)
        ->get()
        ->map(fn($s) => [
            'product_name' => $s->product?->name,
            'store_name' => $s->store?->name,
            'quantity' => $s->quantity,
            'minimum_stock' => $s->product?->minimum_stock,
        ]);

    // Last 30 days revenue chart data (fill missing dates with 0)
    $dateFrom = now()->subDays(29);
    $salesByDay = \App\Models\Sale::where('status', 'valid')
        ->whereDate('sale_date', '>=', $dateFrom->format('Y-m-d'))
        ->select(
            \Illuminate\Support\Facades\DB::raw("DATE(sale_date) as day"),
            \Illuminate\Support\Facades\DB::raw('SUM(subtotal - discount) as total')
        )
        ->groupBy(\Illuminate\Support\Facades\DB::raw('DATE(sale_date)'))
        ->orderBy('day')
        ->get()
        ->keyBy('day');

    $dailySummary = collect(range(0, 29))
        ->map(fn($i) => $dateFrom->copy()->addDays($i)->format('Y-m-d'))
        ->map(fn($date) => [
            'day' => $date,
            'total' => (float) ($salesByDay->get($date)?->total ?? 0),
        ])
        ->values();

    // Top 5 best sellers by revenue
    $topSellers = \App\Models\SaleItem::select(
            'sale_items.product_id',
            \Illuminate\Support\Facades\DB::raw('SUM(sale_items.quantity) as total_units'),
            \Illuminate\Support\Facades\DB::raw('SUM(sale_items.quantity * sale_items.sale_price) as total_revenue')
        )
        ->join('sales', 'sale_items.sale_id', '=', 'sales.id')
        ->where('sales.status', 'valid')
        ->with('product')
        ->groupBy('sale_items.product_id')
        ->orderByDesc('total_revenue')
        ->take(5)
        ->get()
        ->map(fn($item) => [
            'product_name' => $item->product?->name,
            'total_units' => (int) $item->total_units,
            'total_revenue' => number_format((float) $item->total_revenue, 2),
        ]);

    return Inertia::render('Dashboard', [
        'stats' => [
            'totalProducts' => $totalProducts,
            'lowStockCount' => $lowStockCount,
            'todaySales' => $todaySales,
            'todaySalesTotal' => number_format($todaySalesTotal, 2),
            'todayPurchases' => $todayPurchases,
            'todayPurchasesTotal' => number_format($todayPurchasesTotal, 2),
        ],
        'recentSales' => $recentSales,
        'lowStockAlerts' => $lowStockAlerts,
        'dailySummary' => $dailySummary,
        'topSellers' => $topSellers,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Stores (Ubicaciones) — specific routes before parameterized {store}
    Route::middleware(['permission:stores.view'])->group(function () {
        Route::get('stores', [StoreController::class, 'index'])->name('stores.index');
    });
    Route::middleware(['permission:stores.create'])->group(function () {
        Route::get('stores/create', [StoreController::class, 'create'])->name('stores.create');
        Route::post('stores', [StoreController::class, 'store'])->name('stores.store');
    });
    Route::middleware(['permission:stores.view'])->group(function () {
        Route::get('stores/{store}', [StoreController::class, 'show'])->name('stores.show');
    });
    Route::middleware(['permission:stores.edit'])->group(function () {
        Route::get('stores/{store}/edit', [StoreController::class, 'edit'])->name('stores.edit');
        Route::put('stores/{store}', [StoreController::class, 'update'])->name('stores.update');
        Route::patch('stores/{store}', [StoreController::class, 'update']);
    });
    Route::middleware(['permission:stores.delete'])->group(function () {
        Route::delete('stores/{store}', [StoreController::class, 'destroy'])->name('stores.destroy');
    });

    // Clients (Clientes)
    Route::middleware(['permission:clients.view'])->group(function () {
        Route::get('clients', [ClientController::class, 'index'])->name('clients.index');
    });
    Route::middleware(['permission:clients.create'])->group(function () {
        Route::get('clients/create', [ClientController::class, 'create'])->name('clients.create');
        Route::post('clients', [ClientController::class, 'store'])->name('clients.store');
    });
    Route::middleware(['permission:clients.view'])->group(function () {
        Route::get('clients/{client}', [ClientController::class, 'show'])->name('clients.show');
    });
    Route::middleware(['permission:clients.edit'])->group(function () {
        Route::get('clients/{client}/edit', [ClientController::class, 'edit'])->name('clients.edit');
        Route::put('clients/{client}', [ClientController::class, 'update'])->name('clients.update');
        Route::patch('clients/{client}', [ClientController::class, 'update']);
    });
    Route::middleware(['permission:clients.delete'])->group(function () {
        Route::delete('clients/{client}', [ClientController::class, 'destroy'])->name('clients.destroy');
    });

    // Providers (Proveedores)
    Route::middleware(['permission:providers.view'])->group(function () {
        Route::get('providers', [ProviderController::class, 'index'])->name('providers.index');
    });
    Route::middleware(['permission:providers.create'])->group(function () {
        Route::get('providers/create', [ProviderController::class, 'create'])->name('providers.create');
        Route::post('providers', [ProviderController::class, 'store'])->name('providers.store');
    });
    Route::middleware(['permission:providers.view'])->group(function () {
        Route::get('providers/{provider}', [ProviderController::class, 'show'])->name('providers.show');
    });
    Route::middleware(['permission:providers.edit'])->group(function () {
        Route::get('providers/{provider}/edit', [ProviderController::class, 'edit'])->name('providers.edit');
        Route::put('providers/{provider}', [ProviderController::class, 'update'])->name('providers.update');
        Route::patch('providers/{provider}', [ProviderController::class, 'update']);
    });
    Route::middleware(['permission:providers.delete'])->group(function () {
        Route::delete('providers/{provider}', [ProviderController::class, 'destroy'])->name('providers.destroy');
    });

    // Categories (Categorías)
    Route::middleware(['permission:categories.view'])->group(function () {
        Route::get('categories', [CategoryController::class, 'index'])->name('categories.index');
    });
    Route::middleware(['permission:categories.create'])->group(function () {
        Route::get('categories/create', [CategoryController::class, 'create'])->name('categories.create');
        Route::post('categories', [CategoryController::class, 'store'])->name('categories.store');
    });
    Route::middleware(['permission:categories.view'])->group(function () {
        Route::get('categories/{category}', [CategoryController::class, 'show'])->name('categories.show');
    });
    Route::middleware(['permission:categories.edit'])->group(function () {
        Route::get('categories/{category}/edit', [CategoryController::class, 'edit'])->name('categories.edit');
        Route::put('categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
        Route::patch('categories/{category}', [CategoryController::class, 'update']);
    });
    Route::middleware(['permission:categories.delete'])->group(function () {
        Route::delete('categories/{category}', [CategoryController::class, 'destroy'])->name('categories.destroy');
    });

    // Brands (Marcas)
    Route::middleware(['permission:brands.view'])->group(function () {
        Route::get('brands', [BrandController::class, 'index'])->name('brands.index');
    });
    Route::middleware(['permission:brands.create'])->group(function () {
        Route::get('brands/create', [BrandController::class, 'create'])->name('brands.create');
        Route::post('brands', [BrandController::class, 'store'])->name('brands.store');
    });
    Route::middleware(['permission:brands.view'])->group(function () {
        Route::get('brands/{brand}', [BrandController::class, 'show'])->name('brands.show');
    });
    Route::middleware(['permission:brands.edit'])->group(function () {
        Route::get('brands/{brand}/edit', [BrandController::class, 'edit'])->name('brands.edit');
        Route::put('brands/{brand}', [BrandController::class, 'update'])->name('brands.update');
        Route::patch('brands/{brand}', [BrandController::class, 'update']);
    });
    Route::middleware(['permission:brands.delete'])->group(function () {
        Route::delete('brands/{brand}', [BrandController::class, 'destroy'])->name('brands.destroy');
    });

    // Products (Productos)
    Route::middleware(['permission:products.view'])->group(function () {
        Route::get('products', [ProductController::class, 'index'])->name('products.index');
    });
    Route::middleware(['permission:products.create'])->group(function () {
        Route::get('products/create', [ProductController::class, 'create'])->name('products.create');
        Route::post('products', [ProductController::class, 'store'])->name('products.store');
    });
    Route::middleware(['permission:products.view'])->group(function () {
        Route::get('products/{product}', [ProductController::class, 'show'])->name('products.show');
    });
    Route::middleware(['permission:products.edit'])->group(function () {
        Route::get('products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
        Route::put('products/{product}', [ProductController::class, 'update'])->name('products.update');
        Route::patch('products/{product}', [ProductController::class, 'update']);
    });
    Route::middleware(['permission:products.delete'])->group(function () {
        Route::delete('products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');
    });

    // Purchases (Compras)
    Route::middleware(['permission:purchases.view'])->group(function () {
        Route::get('purchases', [PurchaseController::class, 'index'])->name('purchases.index');
    });
    Route::middleware(['permission:purchases.create'])->group(function () {
        Route::get('purchases/create', [PurchaseController::class, 'create'])->name('purchases.create');
        Route::post('purchases', [PurchaseController::class, 'store'])->name('purchases.store');
    });
    Route::middleware(['permission:purchases.view'])->group(function () {
        Route::get('purchases/{purchase}', [PurchaseController::class, 'show'])->name('purchases.show');
    });
    Route::middleware(['permission:purchases.edit'])->group(function () {
        Route::get('purchases/{purchase}/edit', [PurchaseController::class, 'edit'])->name('purchases.edit');
        Route::put('purchases/{purchase}', [PurchaseController::class, 'update'])->name('purchases.update');
        Route::patch('purchases/{purchase}', [PurchaseController::class, 'update']);
    });
    Route::middleware(['permission:purchases.delete'])->group(function () {
        Route::delete('purchases/{purchase}', [PurchaseController::class, 'destroy'])->name('purchases.destroy');
    });

    // Transfers (Traslados / Movimientos de inventario)
    Route::middleware(['permission:transfers.view'])->group(function () {
        Route::get('transfers', [TransferController::class, 'index'])->name('transfers.index');
    });
    Route::middleware(['permission:transfers.create'])->group(function () {
        Route::get('transfers/create', [TransferController::class, 'create'])->name('transfers.create');
        Route::post('transfers', [TransferController::class, 'store'])->name('transfers.store');
    });
    Route::middleware(['permission:transfers.view'])->group(function () {
        Route::get('transfers/{transfer}', [TransferController::class, 'show'])->name('transfers.show');
    });
    Route::middleware(['permission:transfers.edit'])->group(function () {
        Route::get('transfers/{transfer}/edit', [TransferController::class, 'edit'])->name('transfers.edit');
        Route::put('transfers/{transfer}', [TransferController::class, 'update'])->name('transfers.update');
        Route::patch('transfers/{transfer}', [TransferController::class, 'update']);
    });
    Route::middleware(['permission:transfers.delete'])->group(function () {
        Route::delete('transfers/{transfer}', [TransferController::class, 'destroy'])->name('transfers.destroy');
    });

    // Sales (Ventas)
    Route::middleware(['permission:sales.view'])->group(function () {
        Route::get('sales', [SaleController::class, 'index'])->name('sales.index');
    });
    Route::middleware(['permission:sales.create'])->group(function () {
        Route::get('sales/create', [SaleController::class, 'create'])->name('sales.create');
        Route::post('sales', [SaleController::class, 'store'])->name('sales.store');
    });
    Route::middleware(['permission:sales.view'])->group(function () {
        Route::get('sales/{sale}', [SaleController::class, 'show'])->name('sales.show');
    });
    Route::middleware(['permission:sales.edit'])->group(function () {
        Route::get('sales/{sale}/edit', [SaleController::class, 'edit'])->name('sales.edit');
        Route::put('sales/{sale}', [SaleController::class, 'update'])->name('sales.update');
        Route::patch('sales/{sale}', [SaleController::class, 'update']);
        Route::patch('sales/{sale}/annul', [SaleController::class, 'annul'])->name('sales.annul');
    });
    Route::middleware(['permission:sales.delete'])->group(function () {
        Route::delete('sales/{sale}', [SaleController::class, 'destroy'])->name('sales.destroy');
    });

    // Reports (Reportes)
    Route::middleware(['permission:reports.view'])->group(function () {
        Route::get('reports', [ReportController::class, 'index'])->name('reports.index');
        Route::get('reports/stock', [ReportController::class, 'stock'])->name('reports.stock');
        Route::get('reports/movements', [ReportController::class, 'movements'])->name('reports.movements');
        Route::get('reports/sales', [ReportController::class, 'sales'])->name('reports.sales');
        Route::get('reports/purchases', [ReportController::class, 'purchases'])->name('reports.purchases');
        Route::get('reports/best-sellers', [ReportController::class, 'bestSellers'])->name('reports.best-sellers');
        Route::get('reports/debts', [ReportController::class, 'debts'])->name('reports.debts');
        Route::get('reports/inventory-value', [ReportController::class, 'inventoryValue'])->name('reports.inventory-value');
        Route::get('reports/daily-summary', [ReportController::class, 'dailySummary'])->name('reports.daily-summary');
    });

    // Roles, Users, Settings — Super Admin only
    Route::middleware(['role:super-admin'])->group(function () {
        Route::resource('roles', RoleController::class)->except(['show']);
        Route::resource('users', UserController::class);
        Route::post('users/{user}/force-logout', [UserController::class, 'forceLogout'])->name('users.force-logout');
        Route::get('settings', [SettingController::class, 'index'])->name('settings.index');
        Route::put('settings', [SettingController::class, 'update'])->name('settings.update');
    });
});

require __DIR__.'/auth.php';
