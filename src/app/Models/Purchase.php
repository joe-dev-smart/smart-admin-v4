<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Purchase extends Model
{
    protected $fillable = [
        'provider_id',
        'store_id',
        'user_id',
        'code',
        'invoice_number',
        'purchase_date',
        'subtotal',
        'tax',
        'discount',
        'total',
        'observation',
        'status',
    ];

    protected $casts = [
        'purchase_date' => 'date',
        'subtotal' => 'decimal:2',
        'tax' => 'decimal:2',
        'discount' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    /**
     * Get the provider that owns the purchase.
     */
    public function provider()
    {
        return $this->belongsTo(Provider::class);
    }

    /**
     * Get the store that owns the purchase.
     */
    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    /**
     * Get the user that created the purchase.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the items for the purchase.
     */
    public function items()
    {
        return $this->hasMany(PurchaseItem::class);
    }

    /**
     * Scope to search purchases.
     */
    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('code', 'like', "%{$search}%")
              ->orWhere('invoice_number', 'like', "%{$search}%")
              ->orWhereHas('provider', function ($q2) use ($search) {
                  $q2->where('name', 'like', "%{$search}%");
              });
        });
    }

    /**
     * Generate a unique purchase code.
     */
    public static function generateCode(): string
    {
        $prefix = 'PUR';
        $date = now()->format('Ymd');
        $lastPurchase = static::whereDate('created_at', today())
            ->orderBy('id', 'desc')
            ->first();

        $sequence = $lastPurchase ? (int) substr($lastPurchase->code, -4) + 1 : 1;

        return $prefix . $date . str_pad($sequence, 4, '0', STR_PAD_LEFT);
    }
}
