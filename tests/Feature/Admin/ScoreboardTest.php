<?php

namespace Tests\Feature\Admin;

use App\Models\Employee;
use App\Models\Milestone;
use App\Models\Score;
use App\Models\Store;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ScoreboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_manager_sees_scoreboard_matrix_for_their_store(): void
    {
        $store = Store::factory()->create();
        $user = $this->managerForStore($store);
        Employee::factory()->for($store)->count(2)->create();
        Milestone::factory()->for($store)->count(3)->create();

        // Different store - should NOT appear
        $otherStore = Store::factory()->create();
        Employee::factory()->for($otherStore)->count(5)->create();
        Milestone::factory()->for($otherStore)->count(2)->create();

        $this->actingAs($user)
            ->get(route('admin.scoreboard.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/scoreboard')
                ->has('employees', 2)
                ->has('milestones', 3),
            );
    }

    public function test_manager_can_save_scores(): void
    {
        $store = Store::factory()->create();
        $user = $this->managerForStore($store);
        $employee = Employee::factory()->for($store)->create();
        $milestone = Milestone::factory()->for($store)->create(['max_points' => 6]);

        $this->actingAs($user)
            ->put(route('admin.scoreboard.update'), [
                'scores' => [[
                    'employee_id' => $employee->id,
                    'milestone_id' => $milestone->id,
                    'points' => 4,
                ]],
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('scores', [
            'employee_id' => $employee->id,
            'milestone_id' => $milestone->id,
            'points' => 4,
        ]);
    }

    public function test_saving_existing_score_updates_instead_of_duplicating(): void
    {
        $store = Store::factory()->create();
        $user = $this->managerForStore($store);
        $employee = Employee::factory()->for($store)->create();
        $milestone = Milestone::factory()->for($store)->create(['max_points' => 6]);
        Score::factory()->create([
            'employee_id' => $employee->id,
            'milestone_id' => $milestone->id,
            'points' => 2,
        ]);

        $this->actingAs($user)
            ->put(route('admin.scoreboard.update'), [
                'scores' => [[
                    'employee_id' => $employee->id,
                    'milestone_id' => $milestone->id,
                    'points' => 5,
                ]],
            ])
            ->assertRedirect();

        $this->assertSame(1, Score::query()->count());
        $this->assertDatabaseHas('scores', [
            'employee_id' => $employee->id,
            'milestone_id' => $milestone->id,
            'points' => 5,
        ]);
    }

    public function test_manager_cannot_submit_scores_for_other_stores(): void
    {
        $store = Store::factory()->create();
        $otherStore = Store::factory()->create();
        $user = $this->managerForStore($store);
        $foreignEmployee = Employee::factory()->for($otherStore)->create();
        $foreignMilestone = Milestone::factory()->for($otherStore)->create();

        $this->actingAs($user)
            ->from(route('admin.scoreboard.index'))
            ->put(route('admin.scoreboard.update'), [
                'scores' => [[
                    'employee_id' => $foreignEmployee->id,
                    'milestone_id' => $foreignMilestone->id,
                    'points' => 3,
                ]],
            ])
            ->assertSessionHasErrors('scores.0.employee_id');
    }

    public function test_score_cannot_exceed_milestone_cap(): void
    {
        $store = Store::factory()->create();
        $user = $this->managerForStore($store);
        $employee = Employee::factory()->for($store)->create();
        $milestone = Milestone::factory()->for($store)->create(['max_points' => 6]);

        $this->actingAs($user)
            ->from(route('admin.scoreboard.index'))
            ->put(route('admin.scoreboard.update'), [
                'scores' => [[
                    'employee_id' => $employee->id,
                    'milestone_id' => $milestone->id,
                    'points' => 99,
                ]],
            ])
            ->assertSessionHasErrors('scores.0.points');
    }
}
