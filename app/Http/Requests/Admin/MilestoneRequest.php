<?php

namespace App\Http\Requests\Admin;

use App\Models\Store;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class MilestoneRequest extends FormRequest
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
        $milestoneId = $this->route('milestone')?->id;
        /** @var Store $store */
        $store = app('current.store');

        return [
            'name' => ['required', 'string', 'max:60'],
            'slug' => [
                'nullable',
                'string',
                'max:80',
                Rule::unique('milestones', 'slug')
                    ->where(fn ($query) => $query->where('store_id', $store->id))
                    ->ignore($milestoneId),
            ],
            'color' => ['required', 'string', 'regex:/^#[0-9A-Fa-f]{6}$/'],
            'icon' => ['required', 'string', 'max:64'],
            'max_points' => ['required', 'integer', 'min:1', 'max:100'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}
