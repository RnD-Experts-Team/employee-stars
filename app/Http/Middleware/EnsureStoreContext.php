<?php

namespace App\Http\Middleware;

use App\Support\CurrentStore;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Resolves the active store for the request and binds it on the container as
 * "current.store". Routes that need store scoping can resolve it from the
 * container or via app(\App\Models\Store::class).
 */
class EnsureStoreContext
{
    /**
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if (! $user) {
            return $next($request);
        }

        $store = CurrentStore::resolve($user);

        if (! $store) {
            if ($user->isSuperAdmin()) {
                return redirect()->route('admin.stores.index')
                    ->with('warning', 'Create your first store to get started.');
            }

            abort(403, 'No store assigned to this account.');
        }

        app()->instance('current.store', $store);

        return $next($request);
    }
}
