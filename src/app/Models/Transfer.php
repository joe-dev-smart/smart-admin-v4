<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transfer extends Model
{
    protected $fillable = [
        'from_store_id',
        'to_store_id',
        'user_id',
        'type',
        'code',
        'transfer_date',
        'observation',
        'status',
    ];

    protected $casts = [
        'transfer_date' => 'date',
    ];

    /**
     * Get the source store.
     */
    public function fromStore()
    {
        return $this->belongsTo(Store::class, 'from_store_id');
    }

    /**
     * Get the destination store.
     */
    public function toStore()
    {
        return $this->belongsTo(Store::class, 'to_store_id');
    }

    /**
     * Get the user that created the transfer.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the items for the transfer.
     */
    public function items()
    {
        return $this->hasMany(TransferItem::class);
    }

    /**
     * Scope to search transfers.
     */
    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('code', 'like', "%{$search}%")
              ->orWhereHas('fromStore', function ($q2) use ($search) {
                  $q2->where('name', 'like', "%{$search}%");
              })
              ->orWhereHas('toStore', function ($q2) use ($search) {
                  $q2->where('name', 'like', "%{$search}%");
              });
        });
    }

    /**
     * Generate a unique transfer code.
     */
    public static function generateCode(): string
    {
        $prefix = 'TRF';
        $date = now()->format('Ymd');
        $lastTransfer = static::whereDate('created_at', today())
            ->orderBy('id', 'desc')
            ->first();

        $sequence = $lastTransfer ? (int) substr($lastTransfer->code, -4) + 1 : 1;

        return $prefix . $date . str_pad($sequence, 4, '0', STR_PAD_LEFT);
    }
}
