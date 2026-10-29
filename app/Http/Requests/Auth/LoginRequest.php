<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Max failed attempts per credential-pair before lockout.
     */
    private const MAX_ATTEMPTS = 5;

    /**
     * Lockout window in seconds (5 minutes).
     */
    private const DECAY_SECONDS = 300;

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'username' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string', 'max:255'],
            'remember' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @throws ValidationException
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        $credentials = [
            'username'  => (string) $this->input('username'),
            'password'  => (string) $this->input('password'),
            'is_active' => true, // deactivated accounts can never authenticate
        ];

        if (! Auth::attempt($credentials, $this->boolean('remember'))) {
            RateLimiter::hit($this->throttleKey(), self::DECAY_SECONDS);

            throw ValidationException::withMessages([
                'username' => __('auth.failed'),
            ]);
        }

        // Only successful logins reset the bucket, so repeated typos
        // don't compound against a user who eventually gets it right.
        RateLimiter::clear($this->throttleKey());
    }

    /**
     * @throws ValidationException
     */
    protected function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), self::MAX_ATTEMPTS)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'username' => __('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => (int) ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Cache key for the credential-pair failure counter.
     *
     * Namespaced to avoid collision with any other rate limiter.
     */
    public function throttleKey(): string
    {
        return 'login-attempt:'.Str::transliterate(
            Str::lower((string) $this->input('username')).'|'.$this->ip()
        );
    }
}