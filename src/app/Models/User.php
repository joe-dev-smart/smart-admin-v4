<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'username',
        'email',
        'password',
        'role_id',
        'is_active',
        'last_login_at',
        'last_login_ip',
        'last_logout_at',
        'password_changed_at',
        'login_count',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'last_login_at' => 'datetime',
            'last_logout_at' => 'datetime',
            'password_changed_at' => 'datetime',
            'login_count' => 'integer',
        ];
    }

    /**
     * The role that belongs to the user.
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * The stores that belong to the user.
     */
    public function stores(): BelongsToMany
    {
        return $this->belongsToMany(Store::class, 'user_store')->withTimestamps();
    }

    /**
     * Check if user has a specific permission.
     */
    public function hasPermission(string $permission): bool
    {
        // Super admin has all permissions
        if ($this->isSuperAdmin()) {
            return true;
        }

        return $this->role?->hasPermission($permission) ?? false;
    }

    /**
     * Check if user is a super admin.
     */
    public function isSuperAdmin(): bool
    {
        return $this->role?->isSuperAdmin() ?? false;
    }

    /**
     * Check if user has access to a specific store.
     */
    public function hasStoreAccess(int $storeId): bool
    {
        // Super admin has access to all stores
        if ($this->isSuperAdmin()) {
            return true;
        }

        return $this->stores()->where('stores.id', $storeId)->exists();
    }

    /**
     * Get user's accessible store IDs.
     */
    public function getAccessibleStoreIds(): array
    {
        if ($this->isSuperAdmin()) {
            return Store::pluck('id')->toArray();
        }

        return $this->stores()->pluck('stores.id')->toArray();
    }
}
