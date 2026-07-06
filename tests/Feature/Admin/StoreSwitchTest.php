<?php

namespace Tests\Feature\Admin;

use App\Models\Store;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StoreSwitchTest extends TestCase
{
    use RefreshDatabase;

    public function test_super_admin_can_switch_to_any_store(): void
    {
        $storeA = Store::factory()->create();
        $storeB = Store::factory()->create();
        $user = $this->superAdmin();

        $this->actingAs($user)
            ->post(route('admin.stores.switch', $storeB))
            ->assertRedirect(route('dashboard'));

        $this->assertSame($storeB->id, session('admin.current_store_id'));
    }

    public function test_manager_can_switch_between_their_assigned_stores(): void
    {
        $storeA = Store::factory()->create();
        $storeB = Store::factory()->create();
        $manager = $this->managerForStores($storeA, $storeB);

        $this->actingAs($manager)
            ->post(route('admin.stores.switch', $storeB))
            ->assertRedirect(route('dashboard'));

        $this->assertSame($storeB->id, session('admin.current_store_id'));
    }

    public function test_manager_cannot_switch_to_unassigned_store(): void
    {
        $ownStore = Store::factory()->create();
        $unassignedStore = Store::factory()->create();
        $manager = $this->managerForStore($ownStore);

        $this->actingAs($manager)
            ->post(route('admin.stores.switch', $unassignedStore))
            ->assertForbidden();
    }
}
