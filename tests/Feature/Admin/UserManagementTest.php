<?php

namespace Tests\Feature\Admin;

use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_managers_cannot_access_user_admin(): void
    {
        $user = $this->managerForStore();

        $this->actingAs($user)
            ->get(route('admin.users.index'))
            ->assertForbidden();
    }

    public function test_super_admin_can_list_users(): void
    {
        $this->managerForStore();
        $admin = $this->superAdmin();

        $this->actingAs($admin)
            ->get(route('admin.users.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/users')
                ->has('users')
                ->has('stores'),
            );
    }

    public function test_super_admin_can_create_a_store_manager(): void
    {
        $store = Store::factory()->create();
        $admin = $this->superAdmin();

        $this->actingAs($admin)
            ->post(route('admin.users.store'), [
                'name' => 'Dana Reyes',
                'email' => 'dana@pneunited.com',
                'role' => 'manager',
                'store_id' => $store->id,
                'password' => 'secret-pass',
                'password_confirmation' => 'secret-pass',
            ])
            ->assertRedirect();

        $created = User::query()->where('email', 'dana@pneunited.com')->first();

        $this->assertNotNull($created);
        $this->assertFalse($created->is_super_admin);
        $this->assertSame($store->id, $created->store_id);
        $this->assertTrue(Hash::check('secret-pass', $created->password));
    }

    public function test_super_admin_can_create_another_super_admin_without_store(): void
    {
        $admin = $this->superAdmin();

        $this->actingAs($admin)
            ->post(route('admin.users.store'), [
                'name' => 'Root',
                'email' => 'root@pneunited.com',
                'role' => 'super_admin',
                'store_id' => null,
                'password' => 'secret-pass',
                'password_confirmation' => 'secret-pass',
            ])
            ->assertRedirect();

        $created = User::query()->where('email', 'root@pneunited.com')->first();
        $this->assertTrue($created->is_super_admin);
        $this->assertNull($created->store_id);
    }

    public function test_manager_role_requires_a_store(): void
    {
        $admin = $this->superAdmin();

        $this->actingAs($admin)
            ->from(route('admin.users.index'))
            ->post(route('admin.users.store'), [
                'name' => 'No Store',
                'email' => 'nostore@pneunited.com',
                'role' => 'manager',
                'store_id' => null,
                'password' => 'secret-pass',
                'password_confirmation' => 'secret-pass',
            ])
            ->assertSessionHasErrors('store_id');
    }

    public function test_password_must_be_confirmed_on_create(): void
    {
        $store = Store::factory()->create();
        $admin = $this->superAdmin();

        $this->actingAs($admin)
            ->from(route('admin.users.index'))
            ->post(route('admin.users.store'), [
                'name' => 'Mismatch',
                'email' => 'mismatch@pneunited.com',
                'role' => 'manager',
                'store_id' => $store->id,
                'password' => 'secret-pass',
                'password_confirmation' => 'different',
            ])
            ->assertSessionHasErrors('password');
    }

    public function test_super_admin_can_reassign_a_manager_to_another_store(): void
    {
        $storeA = Store::factory()->create();
        $storeB = Store::factory()->create();
        $manager = User::factory()->create([
            'store_id' => $storeA->id,
            'is_super_admin' => false,
        ]);
        $admin = $this->superAdmin();

        $this->actingAs($admin)
            ->put(route('admin.users.update', $manager), [
                'name' => $manager->name,
                'email' => $manager->email,
                'role' => 'manager',
                'store_id' => $storeB->id,
            ])
            ->assertRedirect();

        $this->assertSame($storeB->id, $manager->fresh()->store_id);
    }

    public function test_updating_without_password_keeps_existing_password(): void
    {
        $store = Store::factory()->create();
        $manager = User::factory()->create([
            'store_id' => $store->id,
            'is_super_admin' => false,
            'password' => 'original-pass',
        ]);
        $admin = $this->superAdmin();

        $this->actingAs($admin)
            ->put(route('admin.users.update', $manager), [
                'name' => 'Renamed',
                'email' => $manager->email,
                'role' => 'manager',
                'store_id' => $store->id,
            ])
            ->assertRedirect();

        $this->assertTrue(Hash::check('original-pass', $manager->fresh()->password));
        $this->assertSame('Renamed', $manager->fresh()->name);
    }

    public function test_super_admin_cannot_delete_their_own_account(): void
    {
        $admin = $this->superAdmin();

        $this->actingAs($admin)
            ->delete(route('admin.users.destroy', $admin))
            ->assertRedirect();

        $this->assertDatabaseHas('users', ['id' => $admin->id]);
    }

    public function test_super_admin_can_delete_another_user(): void
    {
        $admin = $this->superAdmin();
        $victim = User::factory()->create([
            'is_super_admin' => false,
            'store_id' => Store::factory(),
        ]);

        $this->actingAs($admin)
            ->delete(route('admin.users.destroy', $victim))
            ->assertRedirect();

        $this->assertDatabaseMissing('users', ['id' => $victim->id]);
    }

    public function test_assigned_manager_is_scoped_to_their_store(): void
    {
        $store = Store::factory()->create();
        $manager = User::factory()->create([
            'store_id' => $store->id,
            'is_super_admin' => false,
        ]);

        $this->actingAs($manager)
            ->get(route('dashboard'))
            ->assertOk();

        $this->actingAs($manager)
            ->get(route('admin.users.index'))
            ->assertForbidden();
    }
}
