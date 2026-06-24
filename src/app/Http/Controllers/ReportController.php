<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Client;
use App\Models\Movement;
use App\Models\Provider;
use App\Models\Purchase;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Models\Stock;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index()
    {
        return Inertia::render('Reports/Index');
    }

    /**
     * Stock report: current stock levels per product/store.
     */
    public function stock(Request $request)
    {
        $query = Stock::with(['product.category', 'product.brand', 'store'])
            ->whereHas('product');

        if ($request->filled('store_id') && $request->store_id !== 'all') {
            $query->where('store_id', $request->store_id);
        }

        if ($request->filled('search')) {
            $term = $request->search;
            $query->whereHas('product', fn($q) =>
                $q->where('name', 'like', "%{$term}%")
                  ->orWhere('code', 'like', "%{$term}%")
            );
        }

        if ($request->boolean('low_stock')) {
            $query->whereHas('product', fn($q) =>
                $q->whereColumn('stocks.quantity', '<=', 'products.minimum_stock')
                  ->where('products.minimum_stock', '>', 0)
            );
        }

        $stocks = $query->orderBy('store_id')
            ->paginate(50)
            ->withQueryString();

        $stores = Store::enabled()->orderBy('name')->get();

        return Inertia::render('Reports/Stock', [
            'stocks' => $stocks,
            'stores' => $stores,
            'filters' => [
                'search' => $request->search ?? '',
                'store_id' => $request->store_id ?? 'all',
                'low_stock' => $request->boolean('low_stock'),
            ],
        ]);
    }

    /**
     * Movements report: inventory movement history.
     */
    public function movements(Request $request)
    {
        $query = Movement::with(['product', 'store', 'user']);

        if ($request->filled('store_id') && $request->store_id !== 'all') {
            $query->where('store_id', $request->store_id);
        }

        if ($request->filled('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        if ($request->filled('search')) {
            $query->search($request->search);
        }

        $movements = $query->orderByDesc('created_at')
            ->paginate(50)
            ->withQueryString();

        $stores = Store::enabled()->orderBy('name')->get();

        return Inertia::render('Reports/Movements', [
            'movements' => $movements,
            'stores' => $stores,
            'filters' => [
                'search' => $request->search ?? '',
                'store_id' => $request->store_id ?? 'all',
                'type' => $request->type ?? 'all',
                'date_from' => $request->date_from ?? '',
                'date_to' => $request->date_to ?? '',
            ],
        ]);
    }

    /**
     * Sales report: sales summary with totals.
     */
    public function sales(Request $request)
    {
        $query = Sale::with(['store', 'user', 'client']);

        if ($request->filled('store_id') && $request->store_id !== 'all') {
            $query->where('store_id', $request->store_id);
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        if ($request->filled('payment') && $request->payment !== 'all') {
            $query->where('payment', $request->payment);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('sale_date', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('sale_date', '<=', $request->date_to);
        }

        // Compute totals before paginating (clone the builder)
        $totals = [
            'count' => (clone $query)->count(),
            'subtotal' => (float) (clone $query)->sum('subtotal'),
            'discount' => (float) (clone $query)->sum('discount'),
            'total' => (float) (clone $query)->selectRaw('SUM(subtotal - discount) as total_val')->value('total_val'),
            'paid' => (float) (clone $query)->sum('paid'),
        ];

        $sales = $query->orderByDesc('sale_date')->paginate(50)->withQueryString();

        $stores = Store::enabled()->orderBy('name')->get();

        return Inertia::render('Reports/Sales', [
            'sales' => $sales,
            'totals' => $totals,
            'stores' => $stores,
            'filters' => [
                'search' => $request->search ?? '',
                'store_id' => $request->store_id ?? 'all',
                'status' => $request->status ?? 'all',
                'payment' => $request->payment ?? 'all',
                'date_from' => $request->date_from ?? '',
                'date_to' => $request->date_to ?? '',
            ],
        ]);
    }

    /**
     * Purchases report: procurement history by provider, store, date range.
     */
    public function purchases(Request $request)
    {
        $query = Purchase::with(['provider', 'store', 'user'])
            ->withCount('items');

        if ($request->filled('provider_id') && $request->provider_id !== 'all') {
            $query->where('provider_id', $request->provider_id);
        }
        if ($request->filled('store_id') && $request->store_id !== 'all') {
            $query->where('store_id', $request->store_id);
        }
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }
        if ($request->filled('date_from')) {
            $query->whereDate('purchase_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('purchase_date', '<=', $request->date_to);
        }
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('code', 'like', "%{$request->search}%")
                  ->orWhere('invoice_number', 'like', "%{$request->search}%")
                  ->orWhereHas('provider', fn($p) => $p->where('name', 'like', "%{$request->search}%"));
            });
        }

        $totals = [
            'count' => (clone $query)->count(),
            'subtotal' => (float) (clone $query)->sum('subtotal'),
            'tax' => (float) (clone $query)->sum('tax'),
            'discount' => (float) (clone $query)->sum('discount'),
            'total' => (float) (clone $query)->selectRaw('SUM(total) as t')->value('t'),
        ];

        $purchases = $query->orderByDesc('purchase_date')->paginate(50)->withQueryString();

        return Inertia::render('Reports/Purchases', [
            'purchases' => $purchases,
            'totals' => $totals,
            'providers' => Provider::enabled()->orderBy('name')->get(),
            'stores' => Store::enabled()->orderBy('name')->get(),
            'filters' => [
                'search' => $request->search ?? '',
                'provider_id' => $request->provider_id ?? 'all',
                'store_id' => $request->store_id ?? 'all',
                'status' => $request->status ?? 'all',
                'date_from' => $request->date_from ?? '',
                'date_to' => $request->date_to ?? '',
            ],
        ]);
    }

    /**
     * Best-selling products: ranked by units sold and revenue from valid sales.
     */
    public function bestSellers(Request $request)
    {
        $query = SaleItem::select(
                'sale_items.product_id',
                DB::raw('SUM(sale_items.quantity) as total_units'),
                DB::raw('SUM(sale_items.quantity * sale_items.sale_price) as total_revenue'),
                DB::raw('COUNT(DISTINCT sale_items.sale_id) as sale_count')
            )
            ->join('sales', 'sale_items.sale_id', '=', 'sales.id')
            ->where('sales.status', 'valid')
            ->with(['product.category', 'product.brand']);

        if ($request->filled('store_id') && $request->store_id !== 'all') {
            $query->where('sales.store_id', $request->store_id);
        }
        if ($request->filled('category_id') && $request->category_id !== 'all') {
            $query->whereHas('product', fn($p) => $p->where('category_id', $request->category_id));
        }
        if ($request->filled('date_from')) {
            $query->whereDate('sales.sale_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('sales.sale_date', '<=', $request->date_to);
        }
        if ($request->filled('search')) {
            $query->whereHas('product', fn($p) =>
                $p->where('name', 'like', "%{$request->search}%")
                  ->orWhere('code', 'like', "%{$request->search}%")
            );
        }

        $sortBy = in_array($request->get('sort_by'), ['total_revenue', 'total_units', 'sale_count'])
            ? $request->get('sort_by')
            : 'total_revenue';

        $products = $query->groupBy('sale_items.product_id')
            ->orderByDesc($sortBy)
            ->paginate(50)
            ->withQueryString();

        $summary = SaleItem::join('sales', 'sale_items.sale_id', '=', 'sales.id')
            ->where('sales.status', 'valid')
            ->selectRaw('SUM(sale_items.quantity) as total_units, SUM(sale_items.quantity * sale_items.sale_price) as total_revenue')
            ->first();

        return Inertia::render('Reports/BestSellers', [
            'products' => $products,
            'summary' => [
                'total_units' => (int) ($summary->total_units ?? 0),
                'total_revenue' => (float) ($summary->total_revenue ?? 0),
            ],
            'stores' => Store::enabled()->orderBy('name')->get(),
            'categories' => Category::enabled()->orderBy('name')->get(),
            'filters' => [
                'search' => $request->search ?? '',
                'store_id' => $request->store_id ?? 'all',
                'category_id' => $request->category_id ?? 'all',
                'date_from' => $request->date_from ?? '',
                'date_to' => $request->date_to ?? '',
                'sort_by' => $sortBy,
            ],
        ]);
    }

    /**
     * Client debts: sales with outstanding balances (has_debt = 'yes').
     */
    public function debts(Request $request)
    {
        $query = Sale::with(['client', 'store', 'user'])
            ->where('has_debt', 'yes')
            ->where('status', 'valid');

        if ($request->filled('client_id') && $request->client_id !== 'all') {
            $query->where('client_id', $request->client_id);
        }
        if ($request->filled('store_id') && $request->store_id !== 'all') {
            $query->where('store_id', $request->store_id);
        }
        if ($request->filled('date_from')) {
            $query->whereDate('sale_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('sale_date', '<=', $request->date_to);
        }
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('code', 'like', "%{$request->search}%")
                  ->orWhereHas('client', fn($c) => $c->where('name', 'like', "%{$request->search}%"));
            });
        }

        // Total outstanding = SUM(subtotal - discount - paid) where > 0
        $totals = [
            'count' => (clone $query)->count(),
            'total_debt' => (float) (clone $query)
                ->selectRaw('SUM(subtotal - discount - paid) as debt')
                ->value('debt'),
        ];

        // Debt per client summary
        $byClient = (clone $query)
            ->select('client_id', DB::raw('COUNT(*) as sale_count'),
                DB::raw('SUM(subtotal - discount - paid) as outstanding'))
            ->groupBy('client_id')
            ->with('client')
            ->orderByDesc('outstanding')
            ->get();

        $sales = $query->orderByDesc('sale_date')->paginate(50)->withQueryString();

        return Inertia::render('Reports/Debts', [
            'sales' => $sales,
            'totals' => $totals,
            'byClient' => $byClient,
            'clients' => Client::enabled()->orderBy('name')->get(),
            'stores' => Store::enabled()->orderBy('name')->get(),
            'filters' => [
                'search' => $request->search ?? '',
                'client_id' => $request->client_id ?? 'all',
                'store_id' => $request->store_id ?? 'all',
                'date_from' => $request->date_from ?? '',
                'date_to' => $request->date_to ?? '',
            ],
        ]);
    }

    /**
     * Inventory valuation: current stock quantity × sale price 1 per product/store.
     */
    public function inventoryValue(Request $request)
    {
        $query = Stock::with(['product.category', 'product.brand', 'store'])
            ->whereHas('product', fn($p) => $p->where('status', 'enabled'))
            ->where('quantity', '>', 0);

        if ($request->filled('store_id') && $request->store_id !== 'all') {
            $query->where('store_id', $request->store_id);
        }
        if ($request->filled('category_id') && $request->category_id !== 'all') {
            $query->whereHas('product', fn($p) => $p->where('category_id', $request->category_id));
        }
        if ($request->filled('search')) {
            $term = $request->search;
            $query->whereHas('product', fn($p) =>
                $p->where('name', 'like', "%{$term}%")
                  ->orWhere('code', 'like', "%{$term}%")
            );
        }

        $stocks = $query->orderBy('store_id')->paginate(100)->withQueryString();

        // Estimated total value = SUM(quantity × sale_price_1)
        $totalValue = Stock::join('products', 'products.id', '=', 'stocks.product_id')
            ->whereHas('product', fn($p) => $p->where('status', 'enabled'))
            ->where('stocks.quantity', '>', 0)
            ->when($request->filled('store_id') && $request->store_id !== 'all', fn($q) => $q->where('store_id', $request->store_id))
            ->when($request->filled('category_id') && $request->category_id !== 'all', fn($q) => $q->where('products.category_id', $request->category_id))
            ->selectRaw('SUM(stocks.quantity * products.sale_price_1) as value')
            ->value('value');

        $totalItems = Stock::join('products', 'products.id', '=', 'stocks.product_id')
            ->whereHas('product', fn($p) => $p->where('status', 'enabled'))
            ->where('stocks.quantity', '>', 0)
            ->when($request->filled('store_id') && $request->store_id !== 'all', fn($q) => $q->where('store_id', $request->store_id))
            ->selectRaw('SUM(stocks.quantity) as total_units')
            ->value('total_units');

        return Inertia::render('Reports/InventoryValue', [
            'stocks' => $stocks,
            'summary' => [
                'total_value' => (float) ($totalValue ?? 0),
                'total_units' => (int) ($totalItems ?? 0),
            ],
            'stores' => Store::enabled()->orderBy('name')->get(),
            'categories' => Category::enabled()->orderBy('name')->get(),
            'filters' => [
                'search' => $request->search ?? '',
                'store_id' => $request->store_id ?? 'all',
                'category_id' => $request->category_id ?? 'all',
            ],
        ]);
    }

    /**
     * Daily sales summary: revenue and count grouped by date.
     */
    public function dailySummary(Request $request)
    {
        $dateFrom = $request->date_from ?: now()->subDays(29)->format('Y-m-d');
        $dateTo = $request->date_to ?: now()->format('Y-m-d');

        $query = Sale::where('status', 'valid')
            ->whereDate('sale_date', '>=', $dateFrom)
            ->whereDate('sale_date', '<=', $dateTo);

        if ($request->filled('store_id') && $request->store_id !== 'all') {
            $query->where('store_id', $request->store_id);
        }

        // Group by day
        $dailyRows = (clone $query)
            ->select(
                DB::raw("DATE(sale_date) as day"),
                DB::raw('COUNT(*) as sale_count'),
                DB::raw('SUM(subtotal - discount) as total'),
                DB::raw('SUM(paid) as collected'),
                DB::raw('SUM(subtotal - discount - paid) as outstanding')
            )
            ->groupBy(DB::raw('DATE(sale_date)'))
            ->orderByDesc('day')
            ->get();

        $totals = [
            'sale_count' => $dailyRows->sum('sale_count'),
            'total' => (float) $dailyRows->sum('total'),
            'collected' => (float) $dailyRows->sum('collected'),
            'outstanding' => (float) $dailyRows->sum('outstanding'),
            'best_day' => $dailyRows->sortByDesc('total')->first()?->day,
            'best_day_total' => (float) $dailyRows->max('total'),
        ];

        return Inertia::render('Reports/DailySummary', [
            'rows' => $dailyRows,
            'totals' => $totals,
            'stores' => Store::enabled()->orderBy('name')->get(),
            'filters' => [
                'store_id' => $request->store_id ?? 'all',
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
            ],
        ]);
    }
}
