<?php

namespace Tests\Feature\Admin;

use App\Models\Setting;
use App\Models\Store;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_manager_can_view_settings(): void
    {
        $user = $this->managerForStore();

        $this->actingAs($user)
            ->get(route('admin.settings.edit'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page->component('admin/settings'));
    }

    public function test_manager_can_update_their_stores_target(): void
    {
        $store = Store::factory()->create(['target_points' => 30]);
        $user = $this->managerForStore($store);

        $this->actingAs($user)
            ->put(route('admin.settings.update'), [
                'target_points' => 50,
                'board_title' => 'Brookhaven Stars',
                'board_tagline' => 'WIN EVERY DAY',
            ])
            ->assertRedirect();

        $this->assertSame(50, $store->fresh()->target_points);
        $this->assertSame('Brookhaven Stars', $store->fresh()->board_title);
    }

    public function test_manager_cannot_change_brand_name(): void
    {
        $store = Store::factory()->create();
        $user = $this->managerForStore($store);
        Setting::put('brand_name', 'PNE Pizza');

        $this->actingAs($user)
            ->put(route('admin.settings.update'), [
                'target_points' => 40,
                'board_title' => 'Test',
                'brand_name' => 'Hacked Brand',
            ])
            ->assertRedirect();

        $this->assertSame('PNE Pizza', Setting::getBrandName());
    }

    public function test_super_admin_can_change_brand_name(): void
    {
        $store = Store::factory()->create();
        $user = $this->superAdmin();

        $this->actingAs($user)
            ->withSession(['admin.current_store_id' => $store->id])
            ->put(route('admin.settings.update'), [
                'target_points' => 40,
                'board_title' => 'Test',
                'brand_name' => 'PNE Tacos',
            ])
            ->assertRedirect();

        $this->assertSame('PNE Tacos', Setting::getBrandName());
    }

    public function test_target_points_must_be_positive(): void
    {
        $user = $this->managerForStore();

        $this->actingAs($user)
            ->from(route('admin.settings.edit'))
            ->put(route('admin.settings.update'), [
                'target_points' => 0,
                'board_title' => 'Title',
            ])
            ->assertSessionHasErrors('target_points');
    }
}
