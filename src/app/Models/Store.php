<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Store extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'phone',
        'address',
        'google_maps_url',
        'description',
        'allow_sales',
        'status',
    ];

    protected $casts = [
        'allow_sales' => 'string',
        'status' => 'string',
    ];

    /**
     * Scope for filtering by status
     */
    public function scopeEnabled($query)
    {
        return $query->where('status', 'enabled');
    }

    /**
     * Scope for filtering by allow_sales
     */
    public function scopeAllowSales($query)
    {
        return $query->where('allow_sales', 'enabled');
    }

    /**
     * Scope for searching
     */
    public function scopeSearch($query, $search)
    {
        if ($search) {
            return $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%");
            });
        }
        return $query;
    }
}
