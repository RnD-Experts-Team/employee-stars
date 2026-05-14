<?php

namespace App\Support;

use App\Models\Store;
use App\Models\User;
use Illuminate\Support\Facades\Session;

/**
 * Resolves the active "current store" for an authenticated admin user.
 *
 * - Store managers are pinned to their assigned store.
 * - Super admins select a store via a session key; falling back to the first
 *   active store if none has been chosen yet.
 */
class CurrentStore
{
    private const SESSION_KEY = 'admin.current_store_id';

    public function __construct(private readonly ?Store $store = null) {}

    public static function resolve(User $user): ?Store
    {
        if (! $user->isSuperAdmin()) {
            return $user->store;
        }

        $sessionStoreId = Session::get(self::SESSION_KEY);
        if ($sessionStoreId) {
            $store = Store::query()->find($sessionStoreId);
            if ($store) {
                return $store;
            }
        }

        return Store::query()->where('is_active', true)->orderBy('id')->first();
    }

    public static function set(int $storeId): void
    {
        Session::put(self::SESSION_KEY, $storeId);
    }

    public static function clear(): void
    {
        Session::forget(self::SESSION_KEY);
    }
}
