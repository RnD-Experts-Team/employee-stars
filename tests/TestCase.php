<?php

namespace Tests;

use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Laravel\Fortify\Features;

abstract class TestCase extends BaseTestCase
{
    protected function skipUnlessFortifyHas(string $feature, ?string $message = null): void
    {
        if (! Features::enabled($feature)) {
            $this->markTestSkipped($message ?? "Fortify feature [{$feature}] is not enabled.");
        }
    }

    /**
     * Create a manager-role user attached to a single store (or a fresh one).
     */
    protected function managerForStore(?Store $store = null): User
    {
        $store ??= Store::factory()->create();

        return $this->managerForStores($store);
    }

    /**
     * Create a manager-role user attached to one or more stores via the pivot.
     */
    protected function managerForStores(Store ...$stores): User
    {
        $user = User::factory()->create(['is_super_admin' => false]);
        $user->stores()->sync(collect($stores)->pluck('id')->all());

        return $user;
    }

    protected function superAdmin(): User
    {
        return User::factory()->create(['is_super_admin' => true]);
    }
}
