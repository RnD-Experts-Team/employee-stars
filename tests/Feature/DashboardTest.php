<?php

namespace Tests\Feature;

use App\Models\Store;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_the_login_page(): void
    {
        $this->get(route('dashboard'))->assertRedirect(route('login'));
    }

    public function test_authenticated_managers_can_visit_the_dashboard(): void
    {
        $user = $this->managerForStore();

        $this->actingAs($user)->get(route('dashboard'))->assertOk();
    }

    public function test_manager_without_a_store_is_forbidden(): void
    {
        $user = User::factory()->create(['is_super_admin' => false]);
        // No stores attached via pivot.

        $this->actingAs($user)->get(route('dashboard'))->assertForbidden();
    }

    public function test_super_admin_with_stores_lands_on_dashboard(): void
    {
        Store::factory()->create();
        $user = $this->superAdmin();

        $this->actingAs($user)->get(route('dashboard'))->assertOk();
    }
}
