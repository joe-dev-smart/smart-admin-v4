<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Stock extends Model
{
    protected $fillable = [
        'product_id',
        'store_id',
        'quantity',
        'batch',
        'expiration_date',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'expiration_date' => 'date',
        ];
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function store(): BelongsTo
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * Add quantity to a stock record (or create it if it doesn't exist).
     */
    public static function addQuantity(int $productId, int $storeId, int $quantity, ?string $batch = null): self
    {
        $stock = self::firstOrCreate(
            ['product_id' => $productId, 'store_id' => $storeId, 'batch' => $batch],
            ['quantity' => 0]
        );

        $stock->increment('quantity', $quantity);

        return $stock;
    }

    /**
     * Remove quantity from a stock record. Allows negative stock.
     */
    public static function removeQuantity(int $productId, int $storeId, int $quantity, ?string $batch = null): self
    {
        $stock = self::firstOrCreate(
            ['product_id' => $productId, 'store_id' => $storeId, 'batch' => $batch],
            ['quantity' => 0]
        );

        $stock->decrement('quantity', $quantity);

        return $stock;
    }

    /**
     * Get total quantity for a product across all stores.
     */
    public static function totalForProduct(int $productId): int
    {
        return (int) self::where('product_id', $productId)->sum('quantity');
    }

    /**
     * Get quantity for a product in a specific store.
     */
    public static function quantityForProductInStore(int $productId, int $storeId): int
    {
        return (int) self::where('product_id', $productId)
            ->where('store_id', $storeId)
            ->sum('quantity');
    }

    public function scopeLowStock($query)
    {
        return $query->whereHas('product', function ($q) {
            $q->whereColumn('stocks.quantity', '<=', 'products.minimum_stock')
              ->where('products.minimum_stock', '>', 0);
        });
    }
}
