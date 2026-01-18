<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Provider extends Model
{
    protected $fillable = [
        'name',
        'nit',
        'email',
        'cellphone',
        'cellphone_2',
        'phone',
        'phone_2',
        'address',
        'observation',
        'status',
    ];

    /**
     * Scope to filter only enabled providers
     */
    public function scopeEnabled($query)
    {
        return $query->where('status', 'enabled');
    }

    /**
     * Scope to search providers by name, nit, email or phones
     */
    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('nit', 'like', "%{$search}%")
              ->orWhere('email', 'like', "%{$search}%")
              ->orWhere('cellphone', 'like', "%{$search}%")
              ->orWhere('phone', 'like', "%{$search}%");
        });
    }
}
