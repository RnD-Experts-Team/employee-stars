<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\Milestone;
use App\Models\Score;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Score>
 */
class ScoreFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'employee_id' => Employee::factory(),
            'milestone_id' => Milestone::factory(),
            'points' => fake()->numberBetween(0, 6),
        ];
    }
}
