<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\RateLimiter;
use Tests\TestCase;

class LoginRateLimitTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        RateLimiter::clear('login-attempt:alice|127.0.0.1');
        RateLimiter::clear('login-ip:127.0.0.1');
    }

    public function test_it_blocks_after_five_failed_attempts_for_same_credential_pair(): void
    {
        User::factory()->create(['username' => 'alice']);

        for ($i = 0; $i < 5; $i++) {
            $this->post('/login', ['username' => 'alice', 'password' => 'wrong'])
                ->assertSessionHasErrors('username');
        }

        $response = $this->post('/login', ['username' => 'alice', 'password' => 'wrong']);

        $response->assertSessionHasErrors('username');
        $errors = session('errors')->get('username');
        $this->assertStringContainsString('Too many login attempts', $errors[0]);
    }

    public function test_it_resets_the_failure_bucket_on_successful_login(): void
    {
        User::factory()->create([
            'username' => 'alice',
            'password' => bcrypt('correct-password'),
        ]);

        for ($i = 0; $i < 4; $i++) {
            $this->post('/login', ['username' => 'alice', 'password' => 'wrong'])
                ->assertSessionHasErrors('username');
        }

        $this->post('/login', ['username' => 'alice', 'password' => 'correct-password'])
            ->assertRedirect('/dashboard');

        for ($i = 0; $i < 4; $i++) {
            $this->post('/login', ['username' => 'alice', 'password' => 'wrong'])
                ->assertSessionHasErrors('username');
        }
    }

    public function test_it_throttles_the_route_itself_after_too_many_requests(): void
    {
        for ($i = 0; $i < 30; $i++) {
            $this->post('/login', ['username' => "user{$i}", 'password' => 'wrong']);
        }

        $this->post('/login', ['username' => 'user31', 'password' => 'wrong'])
            ->assertStatus(429);
    }
}