<?php

namespace Database\Factories;

use App\Models\Store;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Store>
 */
class StoreFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'number' => sprintf('03795-%05d', fake()->unique()->numberBetween(1, 99999)),
            'name' => fake()->optional()->city(),
            'target_points' => 40,
            'board_title' => 'Daily Stars Performance',
            'board_tagline' => 'FOCUS. EXECUTE. DELIVER. REPEAT.',
            'is_active' => true,
        ];
    }
}
