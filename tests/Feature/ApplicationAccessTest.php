<?php

namespace Tests\Feature;

use App\Models\Application;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ApplicationAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_dashboard_only_lists_authorized_active_applications(): void
    {
        $user = User::factory()->create();

        $granted = Application::factory()->create(['name' => 'DocTrak']);
        $notGranted = Application::factory()->create(['name' => 'iLeave']);
        $inactive = Application::factory()->inactive()->create(['name' => 'OJT']);

        $user->applications()->attach([$granted->id, $inactive->id]);

        $this->actingAs($user)
            ->get('/dashboard')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Dashboard')
                ->has('applications', 1)
                ->where('applications.0.name', 'DocTrak')
            );
    }

    public function test_user_cannot_launch_unauthorized_application(): void
    {
        $user = User::factory()->create();
        $app = Application::factory()->create();

        $this->actingAs($user)
            ->get("/applications/{$app->slug}/launch")
            ->assertForbidden();
    }

    public function test_user_can_launch_authorized_application(): void
    {
        $user = User::factory()->create();
        $app = Application::factory()->create(['url' => 'https://doctrak.example.test']);

        $user->applications()->attach($app->id);

        $this->actingAs($user)
            ->get("/applications/{$app->slug}/launch")
            ->assertRedirect('https://doctrak.example.test');
    }

    public function test_non_admin_cannot_reach_admin_area(): void
    {
        $this->actingAs(User::factory()->create())
            ->get('/admin/users')
            ->assertForbidden();
    }
}