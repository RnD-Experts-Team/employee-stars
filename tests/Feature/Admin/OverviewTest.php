<?php

namespace Tests\Feature\Admin;

use App\Models\Employee;
use App\Models\Milestone;
use App\Models\Score;
use App\Models\Store;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OverviewTest extends TestCase
{
    use RefreshDatabase;

    public function test_managers_cannot_view_network_overview(): void
    {
        $user = $this->managerForStore();

        $this->actingAs($user)
            ->get(route('admin.overview'))
            ->assertForbidden();
    }

    public function test_super_admin_sees_cross_store_summary(): void
    {
        // Numbers chosen so $storeA sorts first by number.
        $storeA = Store::factory()->create(['number' => '03795-00001', 'target_points' => 10]);
        $storeB = Store::factory()->create(['number' => '03795-00002', 'target_points' => 20]);

        $empA = Employee::factory()->for($storeA)->create(['name' => 'Alice']);
        $milestoneA = Milestone::factory()->for($storeA)->create(['max_points' => 10]);
        Score::factory()->create([
            'employee_id' => $empA->id,
            'milestone_id' => $milestoneA->id,
            'points' => 10,
        ]);

        Employee::factory()->for($storeB)->count(2)->create();

        $user = $this->superAdmin();

        $this->actingAs($user)
            ->get(route('admin.overview'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/overview')
                ->has('stores', 2)
                ->where('stores.0.number', $storeA->number)
                ->where('stores.0.champions', 1)
                ->where('stores.0.leader.name', 'Alice'),
            );
    }
}
