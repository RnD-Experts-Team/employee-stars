<?php

namespace Tests\Feature;

use App\Models\Employee;
use App\Models\Milestone;
use App\Models\Score;
use App\Models\Store;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LeaderboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_landing_page_is_publicly_accessible(): void
    {
        Store::factory()->create();

        $this->get(route('landing'))->assertOk();
    }

    public function test_leaderboard_for_store_is_publicly_accessible(): void
    {
        $store = Store::factory()->create();

        $this->get(route('leaderboard', $store))->assertOk();
    }

    public function test_leaderboard_ranks_employees_by_total_points(): void
    {
        $store = Store::factory()->create(['target_points' => 20]);
        $milestone = Milestone::factory()->for($store)->create(['max_points' => 6]);

        $top = Employee::factory()->for($store)->create(['name' => 'Alex']);
        $bottom = Employee::factory()->for($store)->create(['name' => 'Sam']);

        Score::factory()->create(['employee_id' => $top->id, 'milestone_id' => $milestone->id, 'points' => 6]);
        Score::factory()->create(['employee_id' => $bottom->id, 'milestone_id' => $milestone->id, 'points' => 2]);

        $response = $this->get(route('leaderboard', $store));

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('leaderboard')
                ->where('target', 20)
                ->has('employees', 2)
                ->where('employees.0.name', 'Alex')
                ->where('employees.0.rank', 1)
                ->where('employees.0.total', 6)
                ->where('employees.1.name', 'Sam')
                ->where('employees.1.rank', 2),
            );
    }

    public function test_leaderboard_is_scoped_to_the_requested_store(): void
    {
        $storeA = Store::factory()->create();
        $storeB = Store::factory()->create();

        Employee::factory()->for($storeA)->create(['name' => 'Alice']);
        Employee::factory()->for($storeB)->create(['name' => 'Bob']);

        $this->get(route('leaderboard', $storeA))
            ->assertInertia(fn ($page) => $page
                ->has('employees', 1)
                ->where('employees.0.name', 'Alice'),
            );
    }

    public function test_inactive_employees_and_milestones_are_excluded(): void
    {
        $store = Store::factory()->create();
        Milestone::factory()->for($store)->create(['is_active' => false, 'max_points' => 5]);
        Employee::factory()->for($store)->inactive()->create();

        $this->get(route('leaderboard', $store))
            ->assertInertia(fn ($page) => $page
                ->has('employees', 0)
                ->has('milestones', 0),
            );
    }

    public function test_inactive_store_returns_404(): void
    {
        $store = Store::factory()->create(['is_active' => false]);

        $this->get(route('leaderboard', $store))->assertNotFound();
    }
}
