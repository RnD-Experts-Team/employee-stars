<?php

namespace Database\Seeders;

use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            SettingsSeeder::class,
            StoreSeeder::class,
            MilestoneSeeder::class,
            EmployeeSeeder::class,
        ]);

        User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'super@pneunited.com',
            'is_super_admin' => true,
            'store_id' => null,
        ]);

        $brookhaven = Store::query()->where('number', '03795-00030')->first();
        $midtown = Store::query()->where('number', '03795-00041')->first();

        User::factory()->create([
            'name' => 'Brookhaven Manager',
            'email' => 'brookhaven@pneunited.com',
            'store_id' => $brookhaven?->id,
            'is_super_admin' => false,
        ]);

        User::factory()->create([
            'name' => 'Midtown Manager',
            'email' => 'midtown@pneunited.com',
            'store_id' => $midtown?->id,
            'is_super_admin' => false,
        ]);
    }
}
