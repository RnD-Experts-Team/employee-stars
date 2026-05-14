<?php

namespace Tests\Feature\Admin;

use App\Models\Employee;
use App\Models\Store;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EmployeeManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_access_employees_page(): void
    {
        $this->get(route('admin.employees.index'))->assertRedirect(route('login'));
    }

    public function test_manager_can_list_employees(): void
    {
        $store = Store::factory()->create();
        $user = $this->managerForStore($store);
        Employee::factory()->for($store)->count(3)->create();
        Employee::factory()->count(2)->create(); // other-store employees, should be hidden

        $this->actingAs($user)
            ->get(route('admin.employees.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/employees')
                ->has('employees', 3),
            );
    }

    public function test_manager_can_create_employee_in_their_store(): void
    {
        $store = Store::factory()->create();
        $user = $this->managerForStore($store);

        $this->actingAs($user)
            ->post(route('admin.employees.store'), [
                'name' => 'Maya',
                'avatar_color' => '#E8651F',
                'is_active' => true,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('employees', [
            'name' => 'Maya',
            'store_id' => $store->id,
        ]);
    }

    public function test_manager_can_update_their_own_employee(): void
    {
        $store = Store::factory()->create();
        $user = $this->managerForStore($store);
        $employee = Employee::factory()->for($store)->create(['name' => 'Old']);

        $this->actingAs($user)
            ->put(route('admin.employees.update', $employee), [
                'name' => 'New',
                'avatar_color' => '#2E9F45',
                'is_active' => false,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('employees', [
            'id' => $employee->id,
            'name' => 'New',
            'is_active' => false,
        ]);
    }

    public function test_manager_cannot_touch_other_stores_employees(): void
    {
        $userStore = Store::factory()->create();
        $otherStore = Store::factory()->create();
        $user = $this->managerForStore($userStore);
        $foreign = Employee::factory()->for($otherStore)->create();

        $this->actingAs($user)
            ->put(route('admin.employees.update', $foreign), [
                'name' => 'Hack',
                'avatar_color' => '#000000',
                'is_active' => true,
            ])
            ->assertNotFound();
    }

    public function test_manager_can_delete_their_own_employee(): void
    {
        $store = Store::factory()->create();
        $user = $this->managerForStore($store);
        $employee = Employee::factory()->for($store)->create();

        $this->actingAs($user)
            ->delete(route('admin.employees.destroy', $employee))
            ->assertRedirect();

        $this->assertDatabaseMissing('employees', ['id' => $employee->id]);
    }

    public function test_employee_name_is_required(): void
    {
        $user = $this->managerForStore();

        $this->actingAs($user)
            ->from(route('admin.employees.index'))
            ->post(route('admin.employees.store'), ['name' => ''])
            ->assertSessionHasErrors('name');
    }
}
