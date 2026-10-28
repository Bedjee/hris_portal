<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class PasswordChangeTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_with_must_change_password_is_redirected_to_change_page(): void
    {
        $user = User::factory()->create([
            'password'             => 'password',
            'must_change_password' => true,
        ]);

        $this->actingAs($user)
            ->get('/dashboard')
            ->assertRedirect('/password/change');
    }

    public function test_change_page_is_accessible_even_when_flagged(): void
    {
        $user = User::factory()->create([
            'password'             => 'password',
            'must_change_password' => true,
        ]);

        $this->actingAs($user)
            ->get('/password/change')
            ->assertOk();
    }

    public function test_user_can_change_password(): void
    {
        $user = User::factory()->create([
            'password'             => 'password',
            'must_change_password' => true,
        ]);

        $this->actingAs($user)->post('/password/change', [
            'current_password'      => 'password',
            'password'              => 'NewSecret123',
            'password_confirmation' => 'NewSecret123',
        ])->assertRedirect('/dashboard');

        $user->refresh();
        $this->assertTrue(Hash::check('NewSecret123', $user->password));
        $this->assertFalse($user->must_change_password);

        // No longer redirected
        $this->actingAs($user)->get('/dashboard')->assertOk();
    }

  public function test_cannot_reuse_the_default_password(): void
{
    $user = User::factory()->create([
        'password'             => 'ahappierwayforward',
        'must_change_password' => true,
    ]);

    $this->actingAs($user)->post('/password/change', [
        'current_password'      => 'ahappierwayforward',
        'password'              => 'ahappierwayforward',
        'password_confirmation' => 'ahappierwayforward',
    ])->assertSessionHasErrors('password');
}



    public function test_incorrect_current_password_is_rejected(): void
    {
        $user = User::factory()->create([
            'password'             => 'password',
            'must_change_password' => true,
        ]);

        $this->actingAs($user)->post('/password/change', [
            'current_password'      => 'wrong',
            'password'              => 'NewSecret123',
            'password_confirmation' => 'NewSecret123',
        ])->assertSessionHasErrors('current_password');
    }
}