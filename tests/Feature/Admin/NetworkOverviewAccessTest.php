<?php

namespace Tests\Feature\Admin;

use App\Models\Store;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NetworkOverviewAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_manager_can_view_network_overview_read_only(): void
    {
        $ownStore = Store::factory()->create();
        $otherStore = Store::factory()->create();
        $manager = $this->managerForStore($ownStore);

        $this->actingAs($manager)
            ->get(route('admin.overview'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/overview')
                ->has('stores', 2)
                ->where(
                    'stores',
                    fn ($stores) => collect($stores)->firstWhere('id', $ownStore->id)['can_manage'] === true
                        && collect($stores)->firstWhere('id', $otherStore->id)['can_manage'] === false,
                ),
            );
    }

    public function test_super_admin_can_manage_every_store_in_the_overview(): void
    {
        Store::factory()->count(3)->create();
        $admin = $this->superAdmin();

        $this->actingAs($admin)
            ->get(route('admin.overview'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/overview')
                ->has('stores', 3)
                ->where(
                    'stores',
                    fn ($stores) => collect($stores)->every(fn ($store) => $store['can_manage'] === true),
                ),
            );
    }

    public function test_multi_store_manager_sees_both_stores_in_available_stores_share(): void
    {
        $storeA = Store::factory()->create();
        $storeB = Store::factory()->create();
        $unassigned = Store::factory()->create();
        $manager = $this->managerForStores($storeA, $storeB);

        $this->actingAs($manager)
            ->get(route('dashboard'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->has('auth.availableStores', 2)
                ->where(
                    'auth.availableStores',
                    fn ($stores) => collect($stores)->pluck('id')->contains($storeA->id)
                        && collect($stores)->pluck('id')->contains($storeB->id)
                        && ! collect($stores)->pluck('id')->contains($unassigned->id),
                ),
            );
    }
}
