<?php

namespace Tests\Feature\Admin;

use App\Models\AuditLog;
use App\Models\Office;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UserImportTest extends TestCase
{
    use RefreshDatabase;

    private function csv(array $rows): UploadedFile
    {
        $content = "name,department,role\n";
        foreach ($rows as $row) {
            $content .= implode(',', $row)."\n";
        }

        return UploadedFile::fake()->createWithContent('users.csv', $content);
    }

    public function test_admin_can_import_users_from_csv(): void
    {
        $hrmo = Office::factory()->create(['code' => 'HRMO']);
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)->post('/admin/users/import', [
            'file' => $this->csv([
                ['Juan Dela Cruz Santos', 'HRMO', 'user'],
                ['Maria Reyes', 'HRMO', 'admin'],
            ]),
        ]);

        $response->assertRedirect('/admin/users');

        $this->assertDatabaseHas('users', [
            'username' => 'juan.santos',
            'role'     => 'user',
            'office_id' => $hrmo->id,
            'must_change_password' => true,
        ]);

        $this->assertDatabaseHas('users', [
            'username' => 'maria.reyes',
            'role'     => 'admin',
        ]);

        $juan = User::where('username', 'juan.santos')->first();
       $this->assertTrue(Hash::check('ahappierwayforward', $juan->password));

        $this->assertDatabaseHas('audit_logs', ['action' => 'users.bulk_imported']);
    }

    public function test_username_collisions_get_numeric_suffix(): void
    {
        Office::factory()->create(['code' => 'HRMO']);
        User::factory()->create(['username' => 'juan.santos']);
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->post('/admin/users/import', [
            'file' => $this->csv([
                ['Juan Santos', 'HRMO', 'user'],
                ['Juan Santos', 'HRMO', 'user'],
            ]),
        ]);

        $this->assertDatabaseHas('users', ['username' => 'juan.santos2']);
        $this->assertDatabaseHas('users', ['username' => 'juan.santos3']);
    }

    public function test_unknown_office_code_rejects_whole_import(): void
    {
        Office::factory()->create(['code' => 'HRMO']);
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin)->post('/admin/users/import', [
            'file' => $this->csv([
                ['Valid User', 'HRMO', 'user'],
                ['Bad User', 'NOPE', 'user'],
            ]),
        ]);

        $response->assertSessionHasErrors('file');
        $this->assertDatabaseMissing('users', ['name' => 'Valid User']);
        $this->assertSame(1, User::count()); // only the admin
    }

    public function test_invalid_role_rejects_whole_import(): void
    {
        Office::factory()->create(['code' => 'HRMO']);
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin)->post('/admin/users/import', [
            'file' => $this->csv([
                ['X Y', 'HRMO', 'superuser'],
            ]),
        ])->assertSessionHasErrors('file');

        $this->assertSame(1, User::count());
    }

    public function test_non_admin_cannot_import(): void
    {
        $this->actingAs(User::factory()->create())
            ->post('/admin/users/import', ['file' => $this->csv([['A B', 'HRMO', 'user']])])
            ->assertForbidden();
    }
}