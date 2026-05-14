<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class SettingsUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'target_points' => ['required', 'integer', 'min:1', 'max:1000'],
            'board_title' => ['required', 'string', 'max:120'],
            'board_tagline' => ['nullable', 'string', 'max:160'],
        ];

        if ($this->user()?->isSuperAdmin()) {
            $rules['brand_name'] = ['sometimes', 'required', 'string', 'max:80'];
        }

        return $rules;
    }
}
