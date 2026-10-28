<?php

namespace App\Services;

use App\Models\Application;
use App\Models\User;
use App\Services\Contracts\ApplicationLauncher;
use Illuminate\Support\Str;
use RuntimeException;

/**
 * Step-1 launcher: plain redirect to the configured URL.
 * Step-2 will add an OidcLauncher implementing the same interface.
 */
class DirectLinkLauncher implements ApplicationLauncher
{
    public function urlFor(User $user, Application $application): string
{
    // If SSO is enabled and an initiator URL is configured, send the user
    // straight into the SSO dance. They're already logged in at the portal,
    // so the consent step is the only thing between them and the app.
    if ($application->ssoEnabled() && $application->sso_initiate_url) {
        $url = $application->sso_initiate_url;

        if (! \Illuminate\Support\Str::startsWith($url, ['http://', 'https://'])) {
            throw new RuntimeException("Application [{$application->slug}] has an invalid SSO initiate URL.");
        }

        return $url;
    }

    // Fallback: plain redirect to the app's URL.
    $url = (string) $application->url;

    if (! \Illuminate\Support\Str::startsWith($url, ['http://', 'https://'])) {
        throw new RuntimeException("Application [{$application->slug}] has an invalid URL.");
    }

    return $url;
}
}