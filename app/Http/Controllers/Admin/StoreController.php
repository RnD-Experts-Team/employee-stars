<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreRequest;
use App\Models\Store;
use App\Support\CurrentStore;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class StoreController extends Controller
{
    public function index(): Response
    {
        $stores = Store::query()
            ->withCount(['employees', 'milestones', 'users'])
            ->orderBy('number')
            ->get();

        return Inertia::render('admin/stores', [
            'stores' => $stores,
        ]);
    }

    public function store(StoreRequest $request): RedirectResponse
    {
        Store::create($request->validated());

        return back()->with('success', 'Store added.');
    }

    public function update(StoreRequest $request, Store $store): RedirectResponse
    {
        $store->update($request->validated());

        return back()->with('success', 'Store updated.');
    }

    public function destroy(Request $request, Store $store): RedirectResponse
    {
        $user = $request->user();
        if ($user && CurrentStore::resolve($user)?->id === $store->id) {
            CurrentStore::clear();
        }

        $store->delete();

        return back()->with('success', 'Store removed.');
    }
}
