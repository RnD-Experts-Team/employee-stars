<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    public function run(): void
    {
        $defaults = [
            'brand_name' => 'PNE Pizza',
        ];

        foreach ($defaults as $key => $value) {
            Setting::put($key, $value);
        }
    }
}
