<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Milestone;
use App\Models\Setting;
use App\Models\Store;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeDetailController extends Controller
{
    public function __invoke(Store $store, Employee $employee): Response
    {
        abort_unless($store->is_active, 404);
        abort_unless($employee->store_id === $store->id, 404);

        $milestones = Milestone::query()
            ->forStore($store->id)
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get(['id', 'name', 'color', 'icon', 'max_points']);

        $byMilestone = $employee->scores()->get()->keyBy('milestone_id');

        $breakdown = $milestones->map(fn (Milestone $m) => [
            'milestone_id' => $m->id,
            'name' => $m->name,
            'color' => $m->color,
            'icon' => $m->icon,
            'points' => (int) ($byMilestone[$m->id]->points ?? 0),
            'max_points' => $m->max_points,
        ])->all();

        $total = (int) collect($breakdown)->sum('points');

        // Compute the employee's rank within the store.
        $allTotals = Employee::query()
            ->forStore($store->id)
            ->where('is_active', true)
            ->withSum('scores as total_points', 'points')
            ->get(['id'])
            ->map(fn ($row) => (int) ($row->total_points ?? 0))
            ->sortDesc()
            ->values();

        $rank = $allTotals->search(fn ($value) => $value === $total);
        $rank = $rank === false ? null : ($rank + 1);

        return Inertia::render('employee-detail', [
            'store' => [
                'id' => $store->id,
                'number' => $store->number,
                'name' => $store->name,
            ],
            'employee' => [
                'id' => $employee->id,
                'name' => $employee->name,
                'avatar_color' => $employee->avatar_color,
                'total' => $total,
                'rank' => $rank,
                'breakdown' => $breakdown,
            ],
            'target' => $store->target_points,
            'brand' => Setting::getBrandName(),
        ]);
    }
}
