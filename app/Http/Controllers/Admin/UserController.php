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
            ->with('store:id,number,name')
            ->orderByDesc('is_super_admin')
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'store_id', 'is_super_admin'])
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_super_admin' => $user->is_super_admin,
                'store' => $user->store
                    ? ['id' => $user->store->id, 'number' => $user->store->number, 'name' => $user->store->name]
                    : null,
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

        User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => $data['password'], // hashed via the model cast
            'is_super_admin' => $data['role'] === 'super_admin',
            'store_id' => $data['role'] === 'super_admin' ? null : $data['store_id'],
        ]);

        return back()->with('success', 'User created.');
    }

    public function update(UserRequest $request, User $user): RedirectResponse
    {
        $data = $request->validated();

        $user->fill([
            'name' => $data['name'],
            'email' => $data['email'],
            'is_super_admin' => $data['role'] === 'super_admin',
            'store_id' => $data['role'] === 'super_admin' ? null : $data['store_id'],
        ]);

        if (! empty($data['password'])) {
            $user->password = $data['password']; // hashed via the model cast
        }

        $user->save();

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
}
