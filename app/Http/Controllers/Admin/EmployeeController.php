<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\EmployeeRequest;
use App\Models\Employee;
use App\Models\Store;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class EmployeeController extends Controller
{
    public function index(): Response
    {
        /** @var Store $store */
        $store = app('current.store');

        $employees = Employee::query()
            ->forStore($store->id)
            ->withSum('scores as total_points', 'points')
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get(['id', 'store_id', 'name', 'avatar_color', 'is_active', 'sort_order']);

        return Inertia::render('admin/employees', [
            'employees' => $employees,
        ]);
    }

    public function store(EmployeeRequest $request): RedirectResponse
    {
        /** @var Store $store */
        $store = app('current.store');

        Employee::create([
            ...$request->validated(),
            'store_id' => $store->id,
            'sort_order' => (int) Employee::query()->forStore($store->id)->max('sort_order') + 1,
        ]);

        return back()->with('success', 'Employee added.');
    }

    public function update(EmployeeRequest $request, Employee $employee): RedirectResponse
    {
        $this->ensureBelongsToCurrentStore($employee);

        $employee->update($request->validated());

        return back()->with('success', 'Employee updated.');
    }

    public function destroy(Employee $employee): RedirectResponse
    {
        $this->ensureBelongsToCurrentStore($employee);

        $employee->delete();

        return back()->with('success', 'Employee removed.');
    }

    private function ensureBelongsToCurrentStore(Employee $employee): void
    {
        /** @var Store $store */
        $store = app('current.store');

        if ($employee->store_id !== $store->id) {
            throw new NotFoundHttpException;
        }
    }
}
