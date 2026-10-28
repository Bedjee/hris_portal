<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    public const ROLE_ADMIN = 'admin';
    public const ROLE_USER  = 'user';

    /**
     * Explicit whitelist — this IS the mass-assignment protection.
     */
  protected $fillable = [
    'name',
    'username',
    'email',
    'password',
    'office_id',
    'role',
    'employment_status',
    'is_active',
    'must_change_password',
];

protected function casts(): array
{
    return [
        'email_verified_at'    => 'datetime',
        'last_login_at'        => 'datetime',
        'is_active'            => 'boolean',
        'must_change_password' => 'boolean',
        'password'             => 'hashed',
    ];
}
    protected $hidden = [
        'password',
        'remember_token',
    ];

 

    public function office(): BelongsTo
    {
        return $this->belongsTo(Office::class);
    }

    public function applications(): BelongsToMany
    {
        return $this->belongsToMany(Application::class)->withTimestamps();
    }

    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    public function isActive(): bool
    {
        return $this->is_active === true;
    }


    public function employmentStatusLabel(): ?string
{
    return config('portal.employment_statuses')[$this->employment_status] ?? $this->employment_status;
}
}