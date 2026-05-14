<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Milestone;
use App\Models\Store;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function __invoke(): Response
    {
        /** @var Store $store */
        $store = app('current.store');

        $target = $store->target_points;

        $employeeIds = Employee::query()->forStore($store->id)->pluck('id');

        $totalsByEmployee = DB::table('scores')
            ->whereIn('employee_id', $employeeIds)
            ->select('employee_id', DB::raw('SUM(points) as total'))
            ->groupBy('employee_id')
            ->pluck('total', 'employee_id');

        $activeEmployees = Employee::query()->forStore($store->id)->where('is_active', true)->count();
        $hitTarget = $totalsByEmployee->filter(fn ($total) => (int) $total >= $target)->count();
        $totalPoints = (int) $totalsByEmployee->sum();
        $activeMilestones = Milestone::query()->forStore($store->id)->where('is_active', true)->count();

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'employees' => $activeEmployees,
                'milestones' => $activeMilestones,
                'target' => $target,
                'hit_target' => $hitTarget,
                'total_points' => $totalPoints,
            ],
            'store' => $store->only(['id', 'number', 'name']),
        ]);
    }
}
