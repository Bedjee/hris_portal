<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class OfficeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() === true;
    }

    public function rules(): array
    {
        $office = $this->route('office');

        $rules = [
            'name' => ['required', 'string', 'max:255'],
        ];

        // Code is only set on create and never editable afterward.
        if (! $office) {
            $rules['code'] = [
                'required',
                'string',
                'max:50',
                'alpha_dash',
                Rule::unique('offices', 'code'),
            ];
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'code.alpha_dash' => 'The code may only contain letters, numbers, dashes, and underscores.',
            'code.unique'     => 'That office code is already in use.',
        ];
    }
}