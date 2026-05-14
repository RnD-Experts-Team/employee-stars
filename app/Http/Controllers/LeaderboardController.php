<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Milestone;
use App\Models\Setting;
use App\Models\Store;
use Inertia\Inertia;
use Inertia\Response;

class LeaderboardController extends Controller
{
    public function __invoke(Store $store): Response
    {
        abort_unless($store->is_active, 404);

        $milestones = Milestone::query()
            ->forStore($store->id)
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get(['id', 'name', 'slug', 'color', 'icon', 'max_points']);

        $employees = Employee::query()
            ->forStore($store->id)
            ->where('is_active', true)
            ->with(['scores:id,employee_id,milestone_id,points'])
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get(['id', 'name', 'avatar_color']);

        $payload = $employees->map(function (Employee $employee) use ($milestones) {
            $byMilestone = $employee->scores->keyBy('milestone_id');

            $breakdown = $milestones->map(fn (Milestone $m) => [
                'milestone_id' => $m->id,
                'name' => $m->name,
                'color' => $m->color,
                'icon' => $m->icon,
                'points' => (int) ($byMilestone[$m->id]->points ?? 0),
                'max_points' => $m->max_points,
            ])->all();

            return [
                'id' => $employee->id,
                'name' => $employee->name,
                'avatar_color' => $employee->avatar_color,
                'total' => (int) $employee->scores->sum('points'),
                'breakdown' => $breakdown,
            ];
        })
            ->sortByDesc('total')
            ->values()
            ->map(function (array $row, int $index) {
                $row['rank'] = $index + 1;

                return $row;
            })
            ->all();

        return Inertia::render('leaderboard', [
            'store' => [
                'id' => $store->id,
                'number' => $store->number,
                'name' => $store->name,
            ],
            'employees' => $payload,
            'milestones' => $milestones,
            'target' => $store->target_points,
            'brand' => Setting::getBrandName(),
            'title' => $store->board_title,
            'tagline' => $store->board_tagline ?? '',
        ]);
    }
}
