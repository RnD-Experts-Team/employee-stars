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
        // Logged-in managers go straight to their assigned store's public board.
        $user = $request->user();
        if ($user && ! $user->isSuperAdmin() && $user->store) {
            return redirect()->route('leaderboard', $user->store);
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
