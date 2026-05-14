<?php

namespace Database\Seeders;

use App\Models\Store;
use Illuminate\Database\Seeder;

class StoreSeeder extends Seeder
{
    public function run(): void
    {
        $stores = [
            [
                'number' => '03795-00030',
                'name' => 'Brookhaven',
                'target_points' => 40,
                'board_title' => 'Daily Stars Performance',
                'board_tagline' => 'FOCUS. EXECUTE. DELIVER. REPEAT.',
            ],
            [
                'number' => '03795-00041',
                'name' => 'Midtown',
                'target_points' => 35,
                'board_title' => 'Daily Stars Performance',
                'board_tagline' => 'EXECUTE WITH PRIDE.',
            ],
        ];

        foreach ($stores as $store) {
            Store::updateOrCreate(['number' => $store['number']], [...$store, 'is_active' => true]);
        }
    }
}
