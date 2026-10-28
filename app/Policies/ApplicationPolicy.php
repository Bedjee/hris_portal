<?php

namespace App\Policies;

use App\Models\Application;
use App\Models\User;
use App\Services\ApplicationAccessService;

class ApplicationPolicy
{
    public function __construct(private readonly ApplicationAccessService $access)
    {
    }

    public function view(User $user, Application $application): bool
    {
        return $this->access->userCanAccess($user, $application);
    }

    public function launch(User $user, Application $application): bool
    {
        return $this->access->userCanAccess($user, $application);
    }
}