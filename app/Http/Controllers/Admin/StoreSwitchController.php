<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Store;
use App\Support\CurrentStore;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class StoreSwitchController extends Controller
{
    public function __invoke(Request $request, Store $store): RedirectResponse
    {
        $user = $request->user();
        abort_unless($user && $user->canManageStore($store), 403);

        CurrentStore::set($store->id);

        return redirect()->route('dashboard')
            ->with('success', "Switched to {$store->displayName()}.");
    }
}
