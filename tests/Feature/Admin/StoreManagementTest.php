<?php

namespace Tests\Feature\Admin;

use App\Models\Store;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StoreManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_managers_cannot_access_stores_admin(): void
    {
        $user = $this->managerForStore();

        $this->actingAs($user)
            ->get(route('admin.stores.index'))
            ->assertForbidden();
    }

    public function test_super_admin_can_list_stores(): void
    {
        Store::factory()->count(3)->create();
        $user = $this->superAdmin();

        $this->actingAs($user)
            ->get(route('admin.stores.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/stores')
                ->has('stores', 3),
            );
    }

    public function test_super_admin_can_create_store(): void
    {
        $user = $this->superAdmin();

        $this->actingAs($user)
            ->post(route('admin.stores.store'), [
                'number' => '03795-99012',
                'name' => 'Eastside',
                'target_points' => 45,
                'board_title' => 'Eastside Daily',
                'board_tagline' => 'GO TEAM',
                'is_active' => true,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('stores', [
            'number' => '03795-99012',
            'name' => 'Eastside',
            'target_points' => 45,
        ]);
    }

    public function test_store_number_must_be_unique(): void
    {
        Store::factory()->create(['number' => '03795-99099']);
        $user = $this->superAdmin();

        $this->actingAs($user)
            ->from(route('admin.stores.index'))
            ->post(route('admin.stores.store'), [
                'number' => '03795-99099',
                'target_points' => 40,
                'board_title' => 'Test',
            ])
            ->assertSessionHasErrors('number');
    }

    public function test_super_admin_can_update_store(): void
    {
        $store = Store::factory()->create();
        $user = $this->superAdmin();

        $this->actingAs($user)
            ->put(route('admin.stores.update', $store), [
                'number' => $store->number,
                'name' => 'Renamed',
                'target_points' => 60,
                'board_title' => 'Test',
                'is_active' => true,
            ])
            ->assertRedirect();

        $this->assertSame('Renamed', $store->fresh()->name);
        $this->assertSame(60, $store->fresh()->target_points);
    }

    public function test_super_admin_can_delete_store(): void
    {
        $store = Store::factory()->create();
        $user = $this->superAdmin();

        $this->actingAs($user)
            ->delete(route('admin.stores.destroy', $store))
            ->assertRedirect();

        $this->assertDatabaseMissing('stores', ['id' => $store->id]);
    }
}
