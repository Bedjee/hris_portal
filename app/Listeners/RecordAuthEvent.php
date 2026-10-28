<?php

namespace App\Listeners;

use App\Services\AuditLogger;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Events\Dispatcher;

class RecordAuthEvent
{
    public function __construct(private readonly AuditLogger $audit)
    {
    }

    public function handleLogin(Login $event): void
    {
        $this->audit->log($event->user, 'auth.login', $event->user);
    }

    public function handleLogout(Logout $event): void
    {
        if ($event->user) {
            $this->audit->log($event->user, 'auth.logout', $event->user);
        }
    }

    /**
     * @return array<class-string, string>
     */
    public function subscribe(Dispatcher $events): array
    {
        return [
            Login::class  => 'handleLogin',
            Logout::class => 'handleLogout',
        ];
    }
}