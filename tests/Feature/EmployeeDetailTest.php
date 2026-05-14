<?php

namespace Tests\Feature;

use App\Models\Employee;
use App\Models\Milestone;
use App\Models\Score;
use App\Models\Store;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EmployeeDetailTest extends TestCase
{
    use RefreshDatabase;

    public function test_employee_detail_is_publicly_accessible(): void
    {
        $store = Store::factory()->create();
        $employee = Employee::factory()->for($store)->create();

        $this->get(route('employee.show', [$store, $employee]))->assertOk();
    }

    public function test_employee_detail_returns_breakdown(): void
    {
        $store = Store::factory()->create(['target_points' => 12]);
        $time = Milestone::factory()->for($store)->create([
            'name' => 'Time',
            'max_points' => 6,
        ]);
        $cleaning = Milestone::factory()->for($store)->create([
            'name' => 'Cleaning',
            'max_points' => 6,
        ]);

        $employee = Employee::factory()->for($store)->create(['name' => 'Alice']);
        Score::factory()->create([
            'employee_id' => $employee->id,
            'milestone_id' => $time->id,
            'points' => 6,
        ]);
        Score::factory()->create([
            'employee_id' => $employee->id,
            'milestone_id' => $cleaning->id,
            'points' => 4,
        ]);

        $this->get(route('employee.show', [$store, $employee]))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('employee-detail')
                ->where('employee.name', 'Alice')
                ->where('employee.total', 10)
                ->where('target', 12)
                ->has('employee.breakdown', 2)
                ->where('employee.breakdown.0.points', 6)
                ->where('employee.breakdown.1.points', 4),
            );
    }

    public function test_employee_from_another_store_returns_404(): void
    {
        $storeA = Store::factory()->create();
        $storeB = Store::factory()->create();
        $employee = Employee::factory()->for($storeB)->create();

        $this->get(route('employee.show', [$storeA, $employee]))->assertNotFound();
    }
}
