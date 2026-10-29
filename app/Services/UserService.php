<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class UserService
{
    public function __construct(private readonly AuditLogger $audit)
    {
    }

    public function create(User $actor, array $data): User
    {
        return DB::transaction(function () use ($actor, $data) {
            $user = new User();
            $user->fill(Arr::only($data, ['name','username','email','office_id','employment_status']));

if (! empty($data['password'])) {
    $user->password = $data['password'];
    // Admin-issued / imported credentials must be rotated on first use
    $user->must_change_password = true;
}

$user->role      = $data['role'] ?? User::ROLE_USER;
$user->is_active = (bool) ($data['is_active'] ?? true);
$user->save();

            $this->audit->log($actor, 'user.created', $user, [
    'username'          => $user->username,
    'role'              => $user->role,
    'employment_status' => $user->employment_status,
    'office_id'         => $user->office_id,
    'is_active'         => $user->is_active,
]);


            return $user;
        });
    }

    public function update(User $actor, User $user, array $data): User
    {
        return DB::transaction(function () use ($actor, $user, $data) {
           $before = $user->only([
    'name', 'username', 'email', 'office_id',
    'role', 'employment_status', 'is_active',
]);

$user->fill(Arr::only($data, [
    'name', 'username', 'email', 'office_id', 'employment_status',
]));
            if (! empty($data['password'])) {
                $user->password = $data['password'];
            }

            if (array_key_exists('role', $data)) {
                $user->role = $data['role'];
            }

            if (array_key_exists('is_active', $data)) {
                $user->is_active = (bool) $data['is_active'];
            }

            $wasActive = $user->getOriginal('is_active');
            $user->save();

            if ($wasActive && ! $user->is_active) {
                $this->terminateSessions($user);
            }

            $after = $user->only([
    'name', 'username', 'email', 'office_id',
    'role', 'employment_status', 'is_active',
]);


            $changes = $this->diff($before, $after);

            if ($changes !== [] || ! empty($data['password'])) {
                $this->audit->log($actor, 'user.updated', $user, [
                    'changes'          => $changes,
                    'password_changed' => ! empty($data['password']),
                ]);
            }

            return $user;
        });
    }

    public function toggleActive(User $actor, User $user): User
    {
        if ($user->is($actor)) {
            throw ValidationException::withMessages([
                'user' => 'You cannot deactivate your own account.',
            ]);
        }

        return DB::transaction(function () use ($actor, $user) {
            $user->is_active = ! $user->is_active;
            $user->save();

            if (! $user->is_active) {
                $this->terminateSessions($user);
            }

            $this->audit->log(
                $actor,
                $user->is_active ? 'user.activated' : 'user.deactivated',
                $user,
                ['username' => $user->username],
            );

            return $user;
        });
    }

    public function syncApplications(User $actor, User $user, array $applicationIds): void
    {
        DB::transaction(function () use ($actor, $user, $applicationIds) {
            $before = $user->applications()->pluck('applications.id')->all();

            $user->applications()->sync($applicationIds);

            $after = $user->applications()->pluck('applications.id')->all();

            $added   = array_values(array_diff($after, $before));
            $removed = array_values(array_diff($before, $after));

            if ($added === [] && $removed === []) {
                return;
            }

            $this->audit->log($actor, 'user.applications_synced', $user, [
                'added'   => $added,
                'removed' => $removed,
            ]);
        });
    }

    protected function terminateSessions(User $user): void
    {
        if (config('session.driver') !== 'database') {
            return;
        }

        DB::table(config('session.table', 'sessions'))
            ->where('user_id', $user->getKey())
            ->delete();
    }

    /**
     * Return only the fields that actually changed, in "field => [old, new]" form.
     */
    private function diff(array $before, array $after): array
    {
        $changes = [];

        foreach ($after as $key => $newValue) {
            $oldValue = $before[$key] ?? null;

            if ($oldValue !== $newValue) {
                $changes[$key] = ['from' => $oldValue, 'to' => $newValue];
            }
        }

        return $changes;
    }
}