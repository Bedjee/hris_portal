<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\EnableSsoRequest;
use App\Http\Requests\Admin\StoreApplicationRequest;
use App\Http\Requests\Admin\UpdateApplicationRequest;
use App\Models\Application;
use App\Services\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Passport\ClientRepository;

class ApplicationController extends Controller
{
    public function __construct(
        private readonly AuditLogger $audit,
        private readonly ClientRepository $clients,
    ) {
    }

    public function index(): Response
    {
        return Inertia::render('Admin/Applications/Index', [
            'applications' => Application::query()
                ->withCount('users')
                ->ordered()
                ->paginate(20)
                ->through(fn (Application $app) => [
                    'id'               => $app->id,
                    'name'             => $app->name,
                    'slug'             => $app->slug,
                    'description'      => $app->description,
                    'url'              => $app->url,
                    'icon'             => $app->icon,
                    'is_active'        => $app->is_active,
                    'sort_order'       => $app->sort_order,
                    'users_count'      => $app->users_count,
                    'sso_enabled'      => $app->ssoEnabled(),
                    'redirect_uri'     => $app->redirect_uri,
                    'sso_initiate_url' => $app->sso_initiate_url,
                    'sso_client_id'    => $app->oauth_client_id,
                ]),
            'sso_credentials' => session('sso_credentials'),
        ]);
    }

    public function store(StoreApplicationRequest $request): RedirectResponse
    {
        $application = Application::create($request->validated());

        $this->audit->log($request->user(), 'application.created', $application, [
            'slug' => $application->slug,
            'url'  => $application->url,
        ]);

        return back()->with('success', 'Application created.');
    }

    public function update(UpdateApplicationRequest $request, Application $application): RedirectResponse
    {
        $before = $application->only(['name', 'slug', 'url', 'is_active', 'sort_order']);

        $application->update($request->validated());

        $after   = $application->fresh()->only(['name', 'slug', 'url', 'is_active', 'sort_order']);
        $changes = [];

        foreach ($after as $key => $newValue) {
            if (($before[$key] ?? null) !== $newValue) {
                $changes[$key] = ['from' => $before[$key] ?? null, 'to' => $newValue];
            }
        }

        if ($changes !== []) {
            $this->audit->log($request->user(), 'application.updated', $application, [
                'changes' => $changes,
            ]);
        }

        return back()->with('success', 'Application updated.');
    }

    public function toggleActive(Request $request, Application $application): RedirectResponse
    {
        $application->update(['is_active' => ! $application->is_active]);

        $this->audit->log(
            $request->user(),
            $application->is_active ? 'application.activated' : 'application.deactivated',
            $application,
            ['slug' => $application->slug],
        );

        return back()->with('success', 'Application status updated.');
    }

    public function enableSso(EnableSsoRequest $request, Application $application): RedirectResponse
    {
        if ($application->ssoEnabled()) {
            return back()->with('error', 'SSO is already enabled for this application.');
        }

        $redirectUri    = $request->validated('redirect_uri');
        $ssoInitiateUrl = $request->validated('sso_initiate_url');

        // Passport 13+ uses explicit factory methods per grant type.
        $client = $this->clients->createAuthorizationCodeGrantClient(
            name: $application->name,
            redirectUris: [$redirectUri],
            confidential: true,
        );

        $application->update([
            'oauth_client_id'  => $client->id,
            'redirect_uri'     => $redirectUri,
            'sso_initiate_url' => $ssoInitiateUrl,
            'sso_enabled_at'   => now(),
        ]);

        $this->audit->log($request->user(), 'application.sso_enabled', $application, [
            'slug'             => $application->slug,
            'oauth_client'     => $client->id,
            'redirect_uri'     => $redirectUri,
            'sso_initiate_url' => $ssoInitiateUrl,
        ]);

        return back()
            ->with('success', 'SSO enabled for '.$application->name.'.')
            ->with('sso_credentials', [
                'application_id'   => $application->id,
                'application'      => $application->name,
                'client_id'        => $client->id,
                'client_secret'    => $client->plainSecret,
                'redirect_uri'     => $redirectUri,
                'sso_initiate_url' => $ssoInitiateUrl,
            ]);
    }

    public function disableSso(Request $request, Application $application): RedirectResponse
    {
        if (! $application->ssoEnabled()) {
            return back()->with('error', 'SSO is not enabled for this application.');
        }

        $client = \Laravel\Passport\Client::find($application->oauth_client_id);
        $client?->update(['revoked' => true]);

        $application->update([
            'oauth_client_id'  => null,
            'redirect_uri'     => null,
            'sso_initiate_url' => null,
            'sso_enabled_at'   => null,
        ]);

        $this->audit->log($request->user(), 'application.sso_disabled', $application, [
            'slug' => $application->slug,
        ]);

        return back()->with('success', 'SSO disabled for '.$application->name.'.');
    }
}