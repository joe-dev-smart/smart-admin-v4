<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'category_id',
        'brand_id',
        'name',
        'code',
        'barcode',
        'type',
        'unit_of_measurement',
        'sale_price_1',
        'sale_price_2',
        'sale_price_3',
        'sale_price_4',
        'minimum_stock',
        'model',
        'size',
        'color',
        'description',
        'status',
    ];

    protected $casts = [
        'sale_price_1' => 'decimal:2',
        'sale_price_2' => 'decimal:2',
        'sale_price_3' => 'decimal:2',
        'sale_price_4' => 'decimal:2',
        'minimum_stock' => 'integer',
    ];

    /**
     * Get the category that owns the product.
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Get the brand that owns the product.
     */
    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    /**
     * Scope to filter only enabled products.
     */
    public function scopeEnabled($query)
    {
        return $query->where('status', 'enabled');
    }

    /**
     * Scope to search products by name, code, or barcode.
     */
    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('code', 'like', "%{$search}%")
              ->orWhere('barcode', 'like', "%{$search}%")
              ->orWhere('model', 'like', "%{$search}%");
        });
    }
}
