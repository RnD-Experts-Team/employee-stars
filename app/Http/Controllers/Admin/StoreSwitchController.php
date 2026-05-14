<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Store;
use App\Support\CurrentStore;
use Illuminate\Http\RedirectResponse;

class StoreSwitchController extends Controller
{
    public function __invoke(Store $store): RedirectResponse
    {
        CurrentStore::set($store->id);

        return redirect()->route('dashboard')
            ->with('success', "Switched to {$store->displayName()}.");
    }
}
