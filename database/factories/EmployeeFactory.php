<?php

namespace Database\Factories;

use App\Models\Employee;
use App\Models\Store;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Employee>
 */
class EmployeeFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $colors = ['#E8651F', '#2E9F45', '#1E6FD9', '#7B3FB8', '#E13F2E', '#D85A1E', '#0E9F6E', '#8E44AD'];

        return [
            'store_id' => Store::factory(),
            'name' => fake()->firstName(),
            'avatar_color' => fake()->randomElement($colors),
            'sort_order' => 0,
            'is_active' => true,
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['is_active' => false]);
    }
}
