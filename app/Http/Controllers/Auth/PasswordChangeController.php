<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\PasswordChangeRequest;
use App\Services\AuditLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
            'forced'  => (bool) $request->user()->must_change_password,
            'warning' => $request->session()->get('warning'),
        ]);
    }

    public function update(PasswordChangeRequest $request): RedirectResponse
    {
        $user = $request->user();

        $user->password             = $request->validated('password');
        $user->must_change_password = false;
        $user->save();

        // Fresh session ID after a credential change (defense-in-depth).
        $request->session()->regenerate();

        $this->audit->log($user, 'auth.password_changed', $user);

        return redirect()
            ->route('dashboard')
            ->with('success', 'Password updated.');
    }
}