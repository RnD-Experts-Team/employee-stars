<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use App\Models\Store;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\RedirectResponse;

class LandingController extends Controller
{
    public function __invoke(Request $request): Response|RedirectResponse
    {
        // Logged-in managers with exactly one store go straight to it. Managers
        // with multiple stores land on the chooser so they can pick.
        $user = $request->user();
        if ($user && ! $user->isSuperAdmin()) {
            $stores = $user->stores()->orderBy('number')->get();
            if ($stores->count() === 1) {
                return redirect()->route('leaderboard', $stores->first());
            }
        }

        $stores = Store::query()
            ->where('is_active', true)
            ->orderBy('number')
            ->get(['id', 'number', 'name']);

        return Inertia::render('landing', [
            'stores' => $stores,
            'brand' => Setting::getBrandName(),
        ]);
    }
}
