<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class PasswordChangeController extends Controller
{
    public function __construct(private readonly AuditLogger $audit)
    {
    }

    public function edit(Request $request): Response
    {
        return Inertia::render('Auth/ChangePassword', [
            'mustChange' => (bool) $request->user()->must_change_password,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password'         => ['required', 'confirmed', Password::defaults()],
        ]);

        $user = $request->user();

        $user->forceFill([
            'password'             => $data['password'], // hashed via cast
            'must_change_password' => false,
        ])->save();

        // Kill every OTHER active session for this user (the current one stays).
        if (config('session.driver') === 'database') {
            DB::table(config('session.table', 'sessions'))
                ->where('user_id', $user->getKey())
                ->where('id', '!=', $request->session()->getId())
                ->delete();
        }

        $this->audit->log($user, 'user.password_changed', $user);

        return redirect()
            ->route('dashboard')
            ->with('success', 'Password updated.');
    }
}