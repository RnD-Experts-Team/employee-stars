<?php

namespace App\Support;

use App\Models\Store;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Session;

/**
 * Resolves the active "current store" for an authenticated admin user.
 *
 * - Super admins can manage every store; the "current store" is the one
 *   they last selected via the sidebar switcher.
 * - Store managers are pinned to the stores they're assigned to (many-to-many
 *   pivot). When a manager has multiple stores, they get a switcher too.
 */
class CurrentStore
{
    private const SESSION_KEY = 'admin.current_store_id';

    public static function resolve(User $user): ?Store
    {
        $sessionStoreId = Session::get(self::SESSION_KEY);

        if ($user->isSuperAdmin()) {
            if ($sessionStoreId) {
                $store = Store::query()->find($sessionStoreId);
                if ($store) {
                    return $store;
                }
            }

            return Store::query()->where('is_active', true)->orderBy('id')->first();
        }

        $assigned = $user->stores()->orderBy('number')->get();

        if ($assigned->isEmpty()) {
            return null;
        }

        if ($sessionStoreId) {
            $match = $assigned->firstWhere('id', $sessionStoreId);
            if ($match) {
                return $match;
            }
        }

        return $assigned->first();
    }

    /**
     * The stores a user is authorised to manage (i.e. edit).
     *
     * @return Collection<int, Store>
     */
    public static function authorizedStores(User $user): Collection
    {
        if ($user->isSuperAdmin()) {
            return Store::query()->orderBy('number')->get();
        }

        return $user->stores()->orderBy('number')->get();
    }

    public static function canManage(User $user, ?Store $store): bool
    {
        return $user->canManageStore($store);
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
