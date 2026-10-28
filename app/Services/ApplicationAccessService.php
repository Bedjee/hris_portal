<?php

namespace App\Services;

use App\Models\Application;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

/**
 * Single source of truth for "can this user reach this application?".
 * Never trust the frontend — everything routes through here.
 */
class ApplicationAccessService
{
    public function userCanAccess(User $user, Application $application): bool
    {
        if (! $user->isActive()) {
            return false;
        }

        if (! $application->is_active) {
            return false;
        }

        return $user->applications()
            ->whereKey($application->getKey())
            ->exists();
    }

    /**
     * Applications visible on the dashboard for a user.
     * Single indexed query, no N+1.
     *
     * @return Collection<int, Application>
     */
    public function accessibleApplicationsFor(User $user): Collection
    {
        if (! $user->isActive()) {
            return new Collection();
        }

        return Application::query()
            ->active()
            ->whereHas('users', fn ($query) => $query->whereKey($user->getKey()))
            ->ordered()
            ->get();
    }
}