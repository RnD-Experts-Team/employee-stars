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
     * Create a manager-role user attached to the given (or a new) store.
     */
    protected function managerForStore(?Store $store = null): User
    {
        $store ??= Store::factory()->create();

        return User::factory()->create([
            'store_id' => $store->id,
            'is_super_admin' => false,
        ]);
    }

    protected function superAdmin(): User
    {
        return User::factory()->create([
            'store_id' => null,
            'is_super_admin' => true,
        ]);
    }
}
