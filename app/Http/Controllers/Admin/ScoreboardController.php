<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ScoreboardUpdateRequest;
use App\Models\Employee;
use App\Models\Milestone;
use App\Models\Score;
use App\Models\Store;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ScoreboardController extends Controller
{
    public function index(): Response
    {
        /** @var Store $store */
        $store = app('current.store');

        $milestones = Milestone::query()
            ->forStore($store->id)
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get(['id', 'name', 'color', 'max_points']);

        $employees = Employee::query()
            ->forStore($store->id)
            ->where('is_active', true)
            ->with('scores:id,employee_id,milestone_id,points')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get(['id', 'name', 'avatar_color']);

        $rows = $employees->map(function (Employee $employee) use ($milestones) {
            $byMilestone = $employee->scores->keyBy('milestone_id');

            return [
                'id' => $employee->id,
                'name' => $employee->name,
                'avatar_color' => $employee->avatar_color,
                'points' => $milestones->mapWithKeys(fn (Milestone $m) => [
                    $m->id => (int) ($byMilestone[$m->id]->points ?? 0),
                ])->all(),
                'total' => (int) $employee->scores->sum('points'),
            ];
        });

        return Inertia::render('admin/scoreboard', [
            'milestones' => $milestones,
            'employees' => $rows,
            'target' => $store->target_points,
        ]);
    }

    public function update(ScoreboardUpdateRequest $request): RedirectResponse
    {
        /** @var Store $store */
        $store = app('current.store');

        $employeeIds = Employee::query()->forStore($store->id)->pluck('id')->all();
        $milestoneIds = Milestone::query()->forStore($store->id)->pluck('id')->all();

        DB::transaction(function () use ($request, $employeeIds, $milestoneIds): void {
            foreach ($request->validated('scores') as $row) {
                if (! in_array($row['employee_id'], $employeeIds, true)) {
                    continue;
                }
                if (! in_array($row['milestone_id'], $milestoneIds, true)) {
                    continue;
                }

                Score::updateOrCreate(
                    [
                        'employee_id' => $row['employee_id'],
                        'milestone_id' => $row['milestone_id'],
                    ],
                    [
                        'points' => $row['points'],
                    ],
                );
            }
        });

        return back()->with('success', 'Scoreboard saved.');
    }
}
