<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->isSuperAdmin();
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $userId = $this->route('user')?->id;
        $isCreate = $userId === null;

        return [
            'name' => ['required', 'string', 'max:120'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($userId),
            ],
            'role' => ['required', 'in:super_admin,manager'],
            'store_ids' => [
                'nullable',
                'array',
                'required_if:role,manager',
                Rule::when(
                    $this->input('role') === 'manager',
                    ['min:1'],
                ),
            ],
            'store_ids.*' => [
                'integer',
                Rule::exists('stores', 'id'),
            ],
            'password' => [
                $isCreate ? 'required' : 'nullable',
                'string',
                'min:8',
                'confirmed',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'store_ids.required_if' => 'A store manager must be assigned to at least one store.',
            'store_ids.min' => 'A store manager must be assigned to at least one store.',
        ];
    }
}
