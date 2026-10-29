<?php

namespace App\Providers;

use App\Services\Contracts\ApplicationLauncher;
use App\Services\DirectLinkLauncher;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

use Laravel\Passport\Contracts\AuthorizationViewResponse;
use Laravel\Passport\Passport;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        if (is_file(base_path('.env'))) {
            try {
                \Dotenv\Dotenv::createMutable(base_path(), '.env')->safeLoad();
            } catch (\Throwable $e) {
                // ignore
            }
        }

        $this->app->bind(ApplicationLauncher::class, DirectLinkLauncher::class);
    }

    public function boot(): void
    {
        // Passport 13 requires an explicit binding for the consent view response.
        $this->app->bind(AuthorizationViewResponse::class, function () {
            return new class implements AuthorizationViewResponse {
                private string $view = 'vendor.passport.authorize';
                private array $parameters = [];

                public function withParameters(array $parameters = []): static
                {
                    $this->parameters = $parameters;
                    return $this;
                }

                public function toResponse($request)
                {
                    return response()->view($this->view, $this->parameters);
                }
            };
        });

        Passport::authorizationView('vendor.passport.authorize');

        // ---- Declare OAuth scopes ----
        Passport::tokensCan([
            'profile' => 'Access your basic portal profile (name, username, email, office, role, employment status)',
        ]);
        Passport::defaultScopes(['profile']);

        /*
        |------------------------------------------------------------------
        | Login rate limiting
        |------------------------------------------------------------------
        | Two independent buckets are returned:
        |
        |  1. Per-credential-pair (username + IP). This is the primary
        |     brute-force defense. A legitimate user mistyping their
        |     password a few times still fits inside the window.
        |
        |  2. Per-IP. Catches distributed attempts rotating usernames
        |     from the same source.
        |
        | On a successful login, LoginRequest::authenticate() clears the
        | per-credential bucket so earlier typos don't compound.
        */
        RateLimiter::for('login-ip', function (Request $request) {
    return Limit::perMinute(30)->by('login-ip:'.$request->ip());
});

        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }
    }
}