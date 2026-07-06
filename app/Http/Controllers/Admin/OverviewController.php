<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Store;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class OverviewController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $stores = Store::query()
            ->orderBy('number')
            ->get(['id', 'number', 'name', 'target_points', 'is_active']);

        $rows = $stores->map(function (Store $store) use ($user): array {
            $totals = DB::table('scores')
                ->join('employees', 'scores.employee_id', '=', 'employees.id')
                ->where('employees.store_id', $store->id)
                ->select('employees.id', DB::raw('SUM(scores.points) as total'), 'employees.name')
                ->groupBy('employees.id', 'employees.name')
                ->get();

            $activeEmployees = $store->employees()->where('is_active', true)->count();
            $champions = $totals->filter(fn ($row) => (int) $row->total >= $store->target_points)->count();
            $totalPoints = (int) $totals->sum('total');
            $leader = $totals->sortByDesc('total')->first();

            return [
                'id' => $store->id,
                'number' => $store->number,
                'name' => $store->name,
                'target_points' => $store->target_points,
                'is_active' => $store->is_active,
                'employees' => $activeEmployees,
                'champions' => $champions,
                'total_points' => $totalPoints,
                'team_progress' => $activeEmployees > 0
                    ? (int) round(($totalPoints / max($activeEmployees * $store->target_points, 1)) * 100)
                    : 0,
                'leader' => $leader ? [
                    'name' => $leader->name,
                    'points' => (int) $leader->total,
                ] : null,
                'can_manage' => (bool) $user?->canManageStore($store),
            ];
        });

        return Inertia::render('admin/overview', [
            'stores' => $rows,
        ]);
    }
}
