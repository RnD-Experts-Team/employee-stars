<?php

namespace Database\Seeders;

use App\Models\Milestone;
use App\Models\Store;
use Illuminate\Database\Seeder;

class MilestoneSeeder extends Seeder
{
    public function run(): void
    {
        $defaults = [
            ['name' => 'Time',      'color' => '#2E9F45', 'icon' => 'clock',    'max_points' => 6],
            ['name' => 'Cleaning',  'color' => '#1E6FD9', 'icon' => 'sparkles', 'max_points' => 6],
            ['name' => 'Standards', 'color' => '#7B3FB8', 'icon' => 'target',   'max_points' => 6],
            ['name' => 'Teamwork',  'color' => '#E8651F', 'icon' => 'users',    'max_points' => 6],
            ['name' => 'Golden',    'color' => '#E13F2E', 'icon' => 'crown',    'max_points' => 6],
        ];

        Store::query()->each(function (Store $store) use ($defaults): void {
            foreach ($defaults as $index => $milestone) {
                Milestone::updateOrCreate(
                    [
                        'store_id' => $store->id,
                        'slug' => str($milestone['name'])->slug()->value(),
                    ],
                    [...$milestone, 'sort_order' => $index, 'is_active' => true],
                );
            }
        });
    }
}
