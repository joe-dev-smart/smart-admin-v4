<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Movement extends Model
{
    protected $fillable = [
        'product_id',
        'store_id',
        'user_id',
        'stock_id',
        'type',
        'quantity',
        'system_description',
        'user_description',
        'transfer_movement_id',
        'movable_type',
        'movable_id',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
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

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function stock(): BelongsTo
    {
        return $this->belongsTo(Stock::class);
    }

    public function transferMovement(): BelongsTo
    {
        return $this->belongsTo(Movement::class, 'transfer_movement_id');
    }

    /**
     * The source document that caused this movement (Purchase, Transfer, Sale).
     */
    public function movable(): MorphTo
    {
        return $this->morphTo();
    }

    public function scopeSearch($query, string $term)
    {
        return $query->whereHas('product', fn($q) => $q->where('name', 'like', "%{$term}%")
            ->orWhere('code', 'like', "%{$term}%"))
            ->orWhere('system_description', 'like', "%{$term}%")
            ->orWhere('user_description', 'like', "%{$term}%");
    }
}
