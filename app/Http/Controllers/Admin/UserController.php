<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UserRequest;
use App\Models\Store;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        $users = User::query()
            ->with('stores:id,number,name')
            ->orderByDesc('is_super_admin')
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'is_super_admin'])
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_super_admin' => $user->is_super_admin,
                'stores' => $user->stores
                    ->map(fn (Store $store) => [
                        'id' => $store->id,
                        'number' => $store->number,
                        'name' => $store->name,
                    ])
                    ->values(),
            ]);

        return Inertia::render('admin/users', [
            'users' => $users,
            'stores' => Store::query()
                ->orderBy('number')
                ->get(['id', 'number', 'name']),
        ]);
    }

    public function store(UserRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'], // hashed via the model cast
            'is_super_admin' => $data['role'] === 'super_admin',
        ]);

        $this->syncStores($user, $data);

        return back()->with('success', 'User created.');
    }

    public function update(UserRequest $request, User $user): RedirectResponse
    {
        $data = $request->validated();

        $user->fill([
            'name' => $data['name'],
            'email' => $data['email'],
            'is_super_admin' => $data['role'] === 'super_admin',
        ]);

        if (! empty($data['password'])) {
            $user->password = $data['password']; // hashed via the model cast
        }

        $user->save();

        $this->syncStores($user, $data);

        return back()->with('success', 'User updated.');
    }

    public function destroy(User $user): RedirectResponse
    {
        if ($user->id === request()->user()?->id) {
            return back()->with('error', 'You cannot delete your own account.');
        }

        $user->delete();

        return back()->with('success', 'User removed.');
    }

    /**
     * @param  array<string, mixed>  $data
     */
    private function syncStores(User $user, array $data): void
    {
        if ($data['role'] === 'super_admin') {
            $user->stores()->detach();

            return;
        }

        $user->stores()->sync($data['store_ids'] ?? []);
    }
}
