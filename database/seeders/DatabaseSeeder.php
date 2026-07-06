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
        ]);

        $brookhaven = Store::query()->where('number', '03795-00030')->first();
        $midtown = Store::query()->where('number', '03795-00041')->first();

        $brookhavenManager = User::factory()->create([
            'name' => 'Brookhaven Manager',
            'email' => 'brookhaven@pneunited.com',
            'is_super_admin' => false,
        ]);
        if ($brookhaven) {
            $brookhavenManager->stores()->sync([$brookhaven->id]);
        }

        $midtownManager = User::factory()->create([
            'name' => 'Midtown Manager',
            'email' => 'midtown@pneunited.com',
            'is_super_admin' => false,
        ]);
        if ($midtown) {
            $midtownManager->stores()->sync([$midtown->id]);
        }

        // A multi-store manager, so the switcher UX is exercised out of the box.
        $multiStoreManager = User::factory()->create([
            'name' => 'Regional Manager',
            'email' => 'multi@pneunited.com',
            'is_super_admin' => false,
        ]);
        $multiStoreManager->stores()->sync(
            array_filter([$brookhaven?->id, $midtown?->id]),
        );
    }
}
