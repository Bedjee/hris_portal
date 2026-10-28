<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() === true;
    }

    public function rules(): array
    {
        return [
            'name'      => ['required', 'string', 'max:255'],
           'username' => [
    'required',
    'string',
    'max:255',
    'regex:/^[a-zA-Z0-9._-]+$/',
    'unique:users,username',
],
            'email'     => ['nullable', 'email', 'max:255', 'unique:users,email'],
            'password'  => ['required', 'confirmed', Password::min(12)->letters()->numbers()->symbols()],
            'employment_status' => [
    'nullable',
    'string',
    Rule::in(array_keys(config('portal.employment_statuses'))),
],
            'role'      => ['required', 'string', Rule::in(config('portal.roles'))],
            'office_id' => [
                'nullable',
                'integer',
                Rule::exists('offices', 'id')->where('is_active', true),
            ],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}