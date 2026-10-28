<?php

namespace Database\Seeders;

use App\Models\Application;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $username = config('portal.admin.username');
        $password = config('portal.admin.password');

        if (blank($username) || blank($password)) {
            $this->command?->warn(
                'PORTAL_ADMIN_USERNAME / PORTAL_ADMIN_PASSWORD are not set. Skipping admin creation.'
            );

            return;
        }

        if (Str::length($password) < 12) {
            $this->command?->error('PORTAL_ADMIN_PASSWORD must be at least 12 characters. Skipping.');

            return;
        }

        // Never echo the password anywhere.
        $admin = User::updateOrCreate(
            ['username' => $username],
            [
                'name'     => config('portal.admin.name'),
                'email'    => config('portal.admin.email') ?: null,
                'password' => $password, // hashed cast handles hashing
            ]
        );

        $admin->forceFill([
            'role'      => User::ROLE_ADMIN,
            'is_active' => true,
        ])->save();

        // Grant the bootstrap admin access to every registered application.
        $admin->applications()->syncWithoutDetaching(
            Application::query()->pluck('id')->all()
        );

        $this->command?->info("Portal administrator [{$username}] is ready.");
    }
}