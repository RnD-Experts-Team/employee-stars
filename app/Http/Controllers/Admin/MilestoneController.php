<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\MilestoneRequest;
use App\Models\Milestone;
use App\Models\Store;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class MilestoneController extends Controller
{
    public function index(): Response
    {
        /** @var Store $store */
        $store = app('current.store');

        $milestones = Milestone::query()
            ->forStore($store->id)
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get(['id', 'store_id', 'name', 'slug', 'color', 'icon', 'max_points', 'sort_order', 'is_active']);

        return Inertia::render('admin/milestones', [
            'milestones' => $milestones,
        ]);
    }

    public function store(MilestoneRequest $request): RedirectResponse
    {
        /** @var Store $store */
        $store = app('current.store');

        Milestone::create([
            ...$request->validated(),
            'store_id' => $store->id,
            'sort_order' => (int) Milestone::query()->forStore($store->id)->max('sort_order') + 1,
        ]);

        return back()->with('success', 'Milestone added.');
    }

    public function update(MilestoneRequest $request, Milestone $milestone): RedirectResponse
    {
        $this->ensureBelongsToCurrentStore($milestone);

        $milestone->update($request->validated());

        return back()->with('success', 'Milestone updated.');
    }

    public function destroy(Milestone $milestone): RedirectResponse
    {
        $this->ensureBelongsToCurrentStore($milestone);

        $milestone->delete();

        return back()->with('success', 'Milestone removed.');
    }

    private function ensureBelongsToCurrentStore(Milestone $milestone): void
    {
        /** @var Store $store */
        $store = app('current.store');

        if ($milestone->store_id !== $store->id) {
            throw new NotFoundHttpException;
        }
    }
}
