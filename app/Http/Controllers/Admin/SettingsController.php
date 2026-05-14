<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SettingsUpdateRequest;
use App\Models\Setting;
use App\Models\Store;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SettingsController extends Controller
{
    public function edit(): Response
    {
        /** @var Store $store */
        $store = app('current.store');

        return Inertia::render('admin/settings', [
            'settings' => [
                'target_points' => $store->target_points,
                'board_title' => $store->board_title,
                'board_tagline' => $store->board_tagline ?? '',
                'brand_name' => Setting::getBrandName(),
            ],
            'isSuperAdmin' => (bool) $this->user()?->isSuperAdmin(),
        ]);
    }

    public function update(SettingsUpdateRequest $request): RedirectResponse
    {
        /** @var Store $store */
        $store = app('current.store');

        $store->update($request->validated());

        if ($this->user()?->isSuperAdmin() && $request->filled('brand_name')) {
            Setting::put('brand_name', (string) $request->input('brand_name'));
        }

        return back()->with('success', 'Settings saved.');
    }

    private function user(): ?\App\Models\User
    {
        return request()->user();
    }
}
