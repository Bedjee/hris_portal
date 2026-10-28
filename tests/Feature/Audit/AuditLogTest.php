<?php

namespace Tests\Feature\Audit;

use App\Models\Application;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\RateLimiter;
use Tests\TestCase;

class AuditLogTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        RateLimiter::clear('');
    }

    public function test_login_is_recorded(): void
    {
        $user = User::factory()->create(['password' => 'Password!2345']);

        $this->post('/login', ['username' => $user->username, 'password' => 'Password!2345']);

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $user->id,
            'action'  => 'auth.login',
        ]);
    }

    public function test_logout_is_recorded(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->post('/logout');

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $user->id,
            'action'  => 'auth.logout',
        ]);
    }

    public function test_failed_login_is_not_recorded(): void
    {
        $user = User::factory()->create(['password' => 'Password!2345']);

        $this->post('/login', ['username' => $user->username, 'password' => 'wrong']);

        $this->assertDatabaseMissing('audit_logs', ['action' => 'auth.login']);
    }

    public function test_admin_creating_user_is_recorded(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->post('/admin/users', [
            'name'                  => 'New User',
            'username'              => 'newuser',
            'password'              => 'Password!2345',
            'password_confirmation' => 'Password!2345',
            'role'                  => 'user',
            'is_active'             => true,
        ]);

        $this->assertDatabaseHas('audit_logs', [
            'user_id' => $admin->id,
            'action'  => 'user.created',
        ]);
    }

    public function test_deactivation_is_recorded_and_never_leaks_password(): void
    {
        $admin  = User::factory()->admin()->create();
        $target = User::factory()->create();

        $this->actingAs($admin)->patch("/admin/users/{$target->id}/toggle-active");

        $log = AuditLog::where('action', 'user.deactivated')->first();
        $this->assertNotNull($log);
        $this->assertSame($admin->id, $log->user_id);
        $this->assertSame($target->id, $log->subject_id);

        $encoded = json_encode($log->context);
        $this->assertStringNotContainsString('password', $encoded);
        $this->assertStringNotContainsString('Password', $encoded);
    }

    public function test_application_access_sync_records_added_and_removed(): void
    {
        $admin  = User::factory()->admin()->create();
        $target = User::factory()->create();

        $a = Application::factory()->create();
        $b = Application::factory()->create();

        $target->applications()->attach($a->id);

        $this->actingAs($admin)->put("/admin/users/{$target->id}/applications", [
            'applications' => [$b->id],
        ]);

        $log = AuditLog::where('action', 'user.applications_synced')->first();
        $this->assertNotNull($log);
        $this->assertSame([$b->id], $log->context['added']);
        $this->assertSame([$a->id], $log->context['removed']);
    }

    public function test_non_admin_cannot_view_audit_log(): void
    {
        $this->actingAs(User::factory()->create())
            ->get('/admin/audit-logs')
            ->assertForbidden();
    }

    public function test_admin_can_view_audit_log(): void
    {
        $admin = User::factory()->admin()->create();
        AuditLog::factory()->create(['user_id' => $admin->id]);

        $this->actingAs($admin)
            ->get('/admin/audit-logs')
            ->assertOk();
    }
}