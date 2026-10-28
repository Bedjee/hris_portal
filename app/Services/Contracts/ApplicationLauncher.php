<?php

namespace App\Services\Contracts;

use App\Models\Application;
use App\Models\User;

/**
 * Abstraction so the dashboard never has to change when we swap
 * "open a URL" for "start an OIDC authorization code flow".
 */
interface ApplicationLauncher
{
    public function urlFor(User $user, Application $application): string;
}