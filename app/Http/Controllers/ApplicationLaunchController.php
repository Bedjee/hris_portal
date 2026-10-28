<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Services\ApplicationAccessService;
use App\Services\Contracts\ApplicationLauncher;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ApplicationLaunchController extends Controller
{
    public function __invoke(
        Request $request,
        Application $application,
        ApplicationAccessService $access,
        ApplicationLauncher $launcher,
    ): RedirectResponse {
        // Server-side authorization. IDOR is impossible here:
        // the slug is resolved, then access is re-verified from the DB.
        abort_unless($access->userCanAccess($request->user(), $application), 403);

        return redirect()->away($launcher->urlFor($request->user(), $application));
    }
}