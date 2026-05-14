<?php

namespace Tests\Feature\Admin;

use App\Models\Milestone;
use App\Models\Store;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MilestoneManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_access_milestones_page(): void
    {
        $this->get(route('admin.milestones.index'))->assertRedirect(route('login'));
    }

    public function test_manager_can_create_milestone_with_auto_slug(): void
    {
        $store = Store::factory()->create();
        $user = $this->managerForStore($store);

        $this->actingAs($user)
            ->post(route('admin.milestones.store'), [
                'name' => 'Cleaning Standards',
                'color' => '#1E6FD9',
                'icon' => 'sparkles',
                'max_points' => 6,
                'is_active' => true,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('milestones', [
            'store_id' => $store->id,
            'name' => 'Cleaning Standards',
            'slug' => 'cleaning-standards',
            'max_points' => 6,
        ]);
    }

    public function test_same_slug_allowed_across_different_stores(): void
    {
        $storeA = Store::factory()->create();
        $storeB = Store::factory()->create();
        Milestone::factory()->for($storeA)->create(['slug' => 'time']);

        $user = $this->managerForStore($storeB);

        $this->actingAs($user)
            ->post(route('admin.milestones.store'), [
                'name' => 'Time',
                'color' => '#2E9F45',
                'icon' => 'clock',
                'max_points' => 6,
            ])
            ->assertRedirect();

        $this->assertSame(2, Milestone::query()->where('slug', 'time')->count());
    }

    public function test_manager_cannot_update_other_stores_milestone(): void
    {
        $userStore = Store::factory()->create();
        $otherStore = Store::factory()->create();
        $user = $this->managerForStore($userStore);
        $foreign = Milestone::factory()->for($otherStore)->create();

        $this->actingAs($user)
            ->put(route('admin.milestones.update', $foreign), [
                'name' => 'Hijacked',
                'color' => '#000000',
                'icon' => 'star',
                'max_points' => 9,
            ])
            ->assertNotFound();
    }

    public function test_manager_can_delete_their_milestone(): void
    {
        $store = Store::factory()->create();
        $user = $this->managerForStore($store);
        $milestone = Milestone::factory()->for($store)->create();

        $this->actingAs($user)
            ->delete(route('admin.milestones.destroy', $milestone))
            ->assertRedirect();

        $this->assertDatabaseMissing('milestones', ['id' => $milestone->id]);
    }

    public function test_milestone_max_points_must_be_positive(): void
    {
        $user = $this->managerForStore();

        $this->actingAs($user)
            ->from(route('admin.milestones.index'))
            ->post(route('admin.milestones.store'), [
                'name' => 'Test',
                'color' => '#000000',
                'icon' => 'star',
                'max_points' => 0,
            ])
            ->assertSessionHasErrors('max_points');
    }
}
