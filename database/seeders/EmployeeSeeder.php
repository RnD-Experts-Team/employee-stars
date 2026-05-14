<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\Milestone;
use App\Models\Score;
use App\Models\Store;
use Illuminate\Database\Seeder;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        $palette = ['#E8651F', '#2E9F45', '#1E6FD9', '#7B3FB8', '#E13F2E', '#0E9F6E', '#D85A1E', '#8E44AD', '#1a60bf', '#c8521a'];

        $rosters = [
            '03795-00030' => [
                ['name' => 'Hossam',    'scores' => []],
                ['name' => 'Wajde',     'scores' => ['Time' => 6, 'Cleaning' => 6, 'Standards' => 5]],
                ['name' => 'Fandy',     'scores' => []],
                ['name' => 'Jayden',    'scores' => ['Time' => 6, 'Cleaning' => 6, 'Standards' => 4]],
                ['name' => 'Sebastian', 'scores' => ['Time' => 6, 'Cleaning' => 6, 'Standards' => 3]],
                ['name' => 'Richard',   'scores' => ['Time' => 6, 'Cleaning' => 6, 'Standards' => 2, 'Teamwork' => 6]],
                ['name' => 'Rhonda',    'scores' => []],
                ['name' => 'Yacoub',    'scores' => ['Time' => 6, 'Cleaning' => 6, 'Standards' => 5]],
                ['name' => 'Darrell',   'scores' => ['Time' => 3, 'Cleaning' => 3, 'Standards' => 3]],
                ['name' => 'Eamhani',   'scores' => ['Time' => 6, 'Cleaning' => 6]],
                ['name' => 'Love',      'scores' => ['Time' => 6, 'Cleaning' => 6, 'Standards' => 6, 'Teamwork' => 4]],
            ],
            '03795-00041' => [
                ['name' => 'Priya',     'scores' => ['Time' => 6, 'Cleaning' => 5, 'Standards' => 6, 'Teamwork' => 6, 'Golden' => 4]],
                ['name' => 'Marcus',    'scores' => ['Time' => 6, 'Cleaning' => 6, 'Standards' => 4]],
                ['name' => 'Aaliyah',   'scores' => ['Time' => 5, 'Cleaning' => 6, 'Standards' => 5, 'Teamwork' => 2]],
                ['name' => 'Diego',     'scores' => []],
                ['name' => 'Imani',     'scores' => ['Time' => 6, 'Cleaning' => 6]],
            ],
        ];

        foreach ($rosters as $storeNumber => $roster) {
            $store = Store::query()->where('number', $storeNumber)->first();
            if (! $store) {
                continue;
            }

            $milestones = Milestone::query()->forStore($store->id)->get()->keyBy('name');

            foreach ($roster as $index => $row) {
                $employee = Employee::updateOrCreate(
                    ['store_id' => $store->id, 'name' => $row['name']],
                    [
                        'avatar_color' => $palette[$index % count($palette)],
                        'sort_order' => $index,
                        'is_active' => true,
                    ],
                );

                foreach ($row['scores'] as $milestoneName => $points) {
                    $milestone = $milestones->get($milestoneName);
                    if (! $milestone) {
                        continue;
                    }

                    Score::updateOrCreate(
                        ['employee_id' => $employee->id, 'milestone_id' => $milestone->id],
                        ['points' => $points],
                    );
                }
            }
        }
    }
}
