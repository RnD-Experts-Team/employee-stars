<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreRequest extends FormRequest
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
        $storeId = $this->route('store')?->id;

        return [
            'number' => [
                'required',
                'string',
                'max:32',
                Rule::unique('stores', 'number')->ignore($storeId),
            ],
            'name' => ['nullable', 'string', 'max:120'],
            'target_points' => ['required', 'integer', 'min:1', 'max:1000'],
            'board_title' => ['required', 'string', 'max:120'],
            'board_tagline' => ['nullable', 'string', 'max:160'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
