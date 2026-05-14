<?php

namespace Tests\Feature\Admin;

use App\Models\Store;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StoreSwitchTest extends TestCase
{
    use RefreshDatabase;

    public function test_super_admin_can_switch_active_store(): void
    {
        $storeA = Store::factory()->create();
        $storeB = Store::factory()->create();
        $user = $this->superAdmin();

        $this->actingAs($user)
            ->post(route('admin.stores.switch', $storeB))
            ->assertRedirect(route('dashboard'));

        $this->assertSame($storeB->id, session('admin.current_store_id'));
    }

    public function test_manager_cannot_switch_stores(): void
    {
        $store = Store::factory()->create();
        $user = $this->managerForStore();

        $this->actingAs($user)
            ->post(route('admin.stores.switch', $store))
            ->assertForbidden();
    }
}
