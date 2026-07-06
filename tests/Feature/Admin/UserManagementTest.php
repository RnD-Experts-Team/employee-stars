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

    public function test_super_admin_can_create_a_store_manager_with_one_store(): void
    {
        $store = Store::factory()->create();
        $admin = $this->superAdmin();

        $this->actingAs($admin)
            ->post(route('admin.users.store'), [
                'name' => 'Dana Reyes',
                'email' => 'dana@pneunited.com',
                'role' => 'manager',
                'store_ids' => [$store->id],
                'password' => 'secret-pass',
                'password_confirmation' => 'secret-pass',
            ])
            ->assertRedirect();

        $created = User::query()->where('email', 'dana@pneunited.com')->first();

        $this->assertNotNull($created);
        $this->assertFalse($created->is_super_admin);
        $this->assertTrue(Hash::check('secret-pass', $created->password));
        $this->assertDatabaseHas('store_user', [
            'user_id' => $created->id,
            'store_id' => $store->id,
        ]);
    }

    public function test_super_admin_can_assign_multiple_stores(): void
    {
        $storeA = Store::factory()->create();
        $storeB = Store::factory()->create();
        $storeC = Store::factory()->create();
        $admin = $this->superAdmin();

        $this->actingAs($admin)
            ->post(route('admin.users.store'), [
                'name' => 'Regional',
                'email' => 'regional@pneunited.com',
                'role' => 'manager',
                'store_ids' => [$storeA->id, $storeB->id, $storeC->id],
                'password' => 'secret-pass',
                'password_confirmation' => 'secret-pass',
            ])
            ->assertRedirect();

        $created = User::query()->where('email', 'regional@pneunited.com')->first();

        $this->assertSame(3, $created->stores()->count());
    }

    public function test_super_admin_can_create_another_super_admin_without_store(): void
    {
        $admin = $this->superAdmin();

        $this->actingAs($admin)
            ->post(route('admin.users.store'), [
                'name' => 'Root',
                'email' => 'root@pneunited.com',
                'role' => 'super_admin',
                'store_ids' => [],
                'password' => 'secret-pass',
                'password_confirmation' => 'secret-pass',
            ])
            ->assertRedirect();

        $created = User::query()->where('email', 'root@pneunited.com')->first();
        $this->assertTrue($created->is_super_admin);
        $this->assertSame(0, $created->stores()->count());
    }

    public function test_manager_role_requires_at_least_one_store(): void
    {
        $admin = $this->superAdmin();

        $this->actingAs($admin)
            ->from(route('admin.users.index'))
            ->post(route('admin.users.store'), [
                'name' => 'No Store',
                'email' => 'nostore@pneunited.com',
                'role' => 'manager',
                'store_ids' => [],
                'password' => 'secret-pass',
                'password_confirmation' => 'secret-pass',
            ])
            ->assertSessionHasErrors('store_ids');
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
                'store_ids' => [$store->id],
                'password' => 'secret-pass',
                'password_confirmation' => 'different',
            ])
            ->assertSessionHasErrors('password');
    }

    public function test_super_admin_can_reassign_a_manager_to_different_stores(): void
    {
        $storeA = Store::factory()->create();
        $storeB = Store::factory()->create();
        $storeC = Store::factory()->create();
        $manager = $this->managerForStores($storeA, $storeB);
        $admin = $this->superAdmin();

        $this->actingAs($admin)
            ->put(route('admin.users.update', $manager), [
                'name' => $manager->name,
                'email' => $manager->email,
                'role' => 'manager',
                'store_ids' => [$storeB->id, $storeC->id],
            ])
            ->assertRedirect();

        $assigned = $manager->fresh()->stores()->pluck('stores.id')->all();
        sort($assigned);
        $expected = [$storeB->id, $storeC->id];
        sort($expected);
        $this->assertSame($expected, $assigned);
    }

    public function test_updating_without_password_keeps_existing_password(): void
    {
        $store = Store::factory()->create();
        $manager = $this->managerForStore($store);
        $manager->password = 'original-pass';
        $manager->save();
        $admin = $this->superAdmin();

        $this->actingAs($admin)
            ->put(route('admin.users.update', $manager), [
                'name' => 'Renamed',
                'email' => $manager->email,
                'role' => 'manager',
                'store_ids' => [$store->id],
            ])
            ->assertRedirect();

        $this->assertTrue(Hash::check('original-pass', $manager->fresh()->password));
        $this->assertSame('Renamed', $manager->fresh()->name);
    }

    public function test_promoting_manager_to_super_admin_detaches_stores(): void
    {
        $storeA = Store::factory()->create();
        $storeB = Store::factory()->create();
        $manager = $this->managerForStores($storeA, $storeB);
        $admin = $this->superAdmin();

        $this->actingAs($admin)
            ->put(route('admin.users.update', $manager), [
                'name' => $manager->name,
                'email' => $manager->email,
                'role' => 'super_admin',
                'store_ids' => [],
            ])
            ->assertRedirect();

        $this->assertTrue($manager->fresh()->is_super_admin);
        $this->assertSame(0, $manager->fresh()->stores()->count());
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
        $victim = $this->managerForStore();

        $this->actingAs($admin)
            ->delete(route('admin.users.destroy', $victim))
            ->assertRedirect();

        $this->assertDatabaseMissing('users', ['id' => $victim->id]);
    }
}
