<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() === true;
    }

    public function rules(): array
    {
        $userId = $this->route('user')->id;

        return [
            'name'      => ['required', 'string', 'max:255'],
            'username' => [
    'required',
    'string',
    'max:255',
    'regex:/^[a-zA-Z0-9._-]+$/',
    'unique:users,username',

            ],
            'email'     => [
                'nullable',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($userId),
            ],
            'password'  => ['nullable', 'confirmed', Password::min(12)->letters()->numbers()->symbols()],
            'role'      => ['required', 'string', Rule::in(config('portal.roles'))],
            'employment_status' => [
    'nullable',
    'string',
    Rule::in(array_keys(config('portal.employment_statuses'))),
],
            'office_id' => [
                'nullable',
                'integer',
                Rule::exists('offices', 'id')->where('is_active', true),
            ],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}