<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\RateLimiter;
use Tests\TestCase;

class LoginTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        RateLimiter::clear('test');
    }

    public function test_user_can_login_with_username(): void
    {
        $user = User::factory()->create(['username' => 'juan', 'password' => 'Password!2345']);

        $response = $this->post('/login', [
            'username' => 'juan',
            'password' => 'Password!2345',
        ]);

        $response->assertRedirect('/dashboard');
        $this->assertAuthenticatedAs($user);
        $this->assertNotNull($user->fresh()->last_login_at);
    }

    public function test_login_fails_with_wrong_password(): void
    {
        User::factory()->create(['username' => 'juan', 'password' => 'Password!2345']);

        $this->post('/login', ['username' => 'juan', 'password' => 'wrong'])
            ->assertSessionHasErrors('username');

        $this->assertGuest();
    }

    public function test_inactive_user_cannot_login(): void
    {
        User::factory()->inactive()->create([
            'username' => 'juan',
            'password' => 'Password!2345',
        ]);

        $this->post('/login', ['username' => 'juan', 'password' => 'Password!2345'])
            ->assertSessionHasErrors('username');

        $this->assertGuest();
    }

    public function test_login_is_rate_limited(): void
    {
        User::factory()->create(['username' => 'juan', 'password' => 'Password!2345']);

        for ($i = 0; $i < 5; $i++) {
            $this->post('/login', ['username' => 'juan', 'password' => 'wrong']);
        }

        $this->post('/login', ['username' => 'juan', 'password' => 'Password!2345'])
            ->assertSessionHasErrors('username');

        $this->assertGuest();
    }

    public function test_inactive_user_session_is_killed_mid_session(): void
    {
        $user = User::factory()->create(['password' => 'Password!2345']);

        $this->actingAs($user);

        $user->forceFill(['is_active' => false])->save();

        $this->get('/dashboard')->assertRedirect('/login');
        $this->assertGuest();
    }
}