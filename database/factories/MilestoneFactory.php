<?php

namespace Database\Factories;

use App\Models\Milestone;
use App\Models\Store;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Milestone>
 */
class MilestoneFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->unique()->word();

        return [
            'store_id' => Store::factory(),
            'name' => ucfirst($name),
            'slug' => Str::slug($name),
            'color' => fake()->randomElement(['#2E9F45', '#1E6FD9', '#7B3FB8', '#E8651F', '#E13F2E']),
            'icon' => fake()->randomElement(['star', 'clock', 'sparkles', 'target', 'crown', 'flame', 'trophy']),
            'max_points' => fake()->numberBetween(3, 10),
            'sort_order' => 0,
            'is_active' => true,
        ];
    }
}
