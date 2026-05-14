<?php

namespace App\Http\Requests\Admin;

use App\Models\Milestone;
use App\Models\Store;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class ScoreboardUpdateRequest extends FormRequest
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
        /** @var Store $store */
        $store = app('current.store');

        return [
            'scores' => ['required', 'array'],
            'scores.*.employee_id' => [
                'required',
                'integer',
                Rule::exists('employees', 'id')->where('store_id', $store->id),
            ],
            'scores.*.milestone_id' => [
                'required',
                'integer',
                Rule::exists('milestones', 'id')->where('store_id', $store->id),
            ],
            'scores.*.points' => ['required', 'integer', 'min:0', 'max:100'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            /** @var Store $store */
            $store = app('current.store');

            $caps = Milestone::query()
                ->forStore($store->id)
                ->pluck('max_points', 'id');

            foreach ($this->input('scores', []) as $index => $row) {
                $milestoneId = (int) ($row['milestone_id'] ?? 0);
                $points = (int) ($row['points'] ?? 0);
                $cap = (int) ($caps[$milestoneId] ?? 0);

                if ($cap > 0 && $points > $cap) {
                    $validator->errors()->add(
                        "scores.$index.points",
                        "Points cannot exceed the milestone cap of $cap.",
                    );
                }
            }
        });
    }
}
