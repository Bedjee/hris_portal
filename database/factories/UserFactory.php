<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        return [
            'name'              => fake()->name(),
            'username'          => fake()->unique()->userName(),
            'email'             => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password'          => 'password', // hashed by the model cast
            'role'              => User::ROLE_USER,
            'employment_status' => 'regular',
            'office_id'         => null,
            'is_active'         => true,
            'remember_token'    => Str::random(10),
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['is_active' => false]);
    }

    public function admin(): static
    {
        return $this->state(fn () => ['role' => User::ROLE_ADMIN]);
    }

    public function mustChangePassword(): static
{
    return $this->state(fn () => ['must_change_password' => true]);
}

public function jobOrder(): static
{
    return $this->state(fn () => ['employment_status' => 'job_order']);
}
}