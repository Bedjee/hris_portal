<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Application extends Model
{
    use HasFactory;

   protected $fillable = [
    'name',
    'slug',
    'description',
    'url',
    'icon',
    'is_active',
    'sort_order',
    'client_id',
    'oauth_client_id',
    'redirect_uri',
    'sso_enabled_at',
    'sso_initiate_url', 
];

protected function casts(): array
{
    return [
        'is_active'      => 'boolean',
        'sort_order'     => 'integer',
        'sso_enabled_at' => 'datetime',
    ];
}

    /**
     * Route model binding uses the slug — avoids ID enumeration.
     */
    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class)->withTimestamps();
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }

    public function ssoEnabled(): bool
{
    return $this->oauth_client_id !== null;
}
}