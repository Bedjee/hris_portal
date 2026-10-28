<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Services\ApplicationAccessService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request, ApplicationAccessService $access): Response
    {
        $user = $request->user()->loadMissing('office');

        $applications = $access->accessibleApplicationsFor($user)
            ->map(fn (Application $application) => [
                'id'          => $application->id,
                'name'        => $application->name,
                'slug'        => $application->slug,
                'description' => $application->description,
                'icon'        => $application->icon,
                // Portal-mediated launch URL – the server decides where to go.
                'url'         => route('applications.launch', $application),
            ])
            ->values();

        return Inertia::render('Dashboard', [
            'profile' => [
                'name'     => $user->name,
                'username' => $user->username,
                'role'     => $user->role,
                'office'   => $user->office?->name,
            ],
            'applications' => $applications,
        ]);
    }
}