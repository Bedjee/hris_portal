<?php

namespace Tests\Feature\Admin;

use App\Models\AuditLog;
use App\Models\Office;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OfficeManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_an_office(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->post('/admin/offices', [
            'name' => 'Bids and Awards Committee',
            'code' => 'bac',
        ])->assertRedirect();

        $this->assertDatabaseHas('offices', [
            'name' => 'Bids and Awards Committee',
            'code' => 'BAC',   // normalized to uppercase
        ]);
        $this->assertDatabaseHas('audit_logs', ['action' => 'office.created']);
    }

    public function test_office_code_must_be_unique(): void
    {
        Office::factory()->create(['code' => 'HRMO']);
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->post('/admin/offices', [
            'name' => 'Another Office',
            'code' => 'HRMO',
        ])->assertSessionHasErrors('code');
    }

    public function test_office_can_be_renamed_but_code_stays_the_same(): void
    {
        $office = Office::factory()->create(['name' => 'Old Name', 'code' => 'HRMO']);
        $admin  = User::factory()->admin()->create();

        $this->actingAs($admin)->put("/admin/offices/{$office->id}", [
            'name' => 'New Name',
            'code' => 'CHANGED',   // must be ignored
        ]);

        $office->refresh();
        $this->assertSame('New Name', $office->name);
        $this->assertSame('HRMO', $office->code);

        $this->assertDatabaseHas('audit_logs', ['action' => 'office.renamed']);
    }

    public function test_office_can_be_deactivated_and_reactivated(): void
    {
        $office = Office::factory()->create(['is_active' => true]);
        $admin  = User::factory()->admin()->create();

        $this->actingAs($admin)->patch("/admin/offices/{$office->id}/toggle-active");
        $this->assertFalse($office->fresh()->is_active);

        $this->actingAs($admin)->patch("/admin/offices/{$office->id}/toggle-active");
        $this->assertTrue($office->fresh()->is_active);

        $this->assertDatabaseHas('audit_logs', ['action' => 'office.deactivated']);
        $this->assertDatabaseHas('audit_logs', ['action' => 'office.activated']);
    }

    public function test_deactivated_office_cannot_be_assigned_to_a_new_user(): void
    {
        $office = Office::factory()->create(['is_active' => false]);
        $admin  = User::factory()->admin()->create();

        $this->actingAs($admin)->post('/admin/users', [
            'name'                  => 'New User',
            'username'              => 'newuser',
            'password'              => 'Password!2345',
            'password_confirmation' => 'Password!2345',
            'role'                  => 'user',
            'office_id'             => $office->id,
        ])->assertSessionHasErrors('office_id');
    }

    public function test_non_admin_cannot_manage_offices(): void
    {
        $this->actingAs(User::factory()->create())
            ->get('/admin/offices')
            ->assertForbidden();

        $this->actingAs(User::factory()->create())
            ->post('/admin/offices', ['name' => 'X', 'code' => 'X'])
            ->assertForbidden();
    }
}