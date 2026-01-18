<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Brand extends Model
{
    protected $fillable = [
        'name',
        'description',
        'status',
    ];

    /**
     * Scope to filter only enabled brands.
     */
    public function scopeEnabled($query)
    {
        return $query->where('status', 'enabled');
    }

    /**
     * Scope to search brands by name or description.
     */
    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%");
        });
    }
}
