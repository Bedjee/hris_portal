<?php

namespace App\Http\Requests\Auth;

use App\Services\UserImportService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class PasswordChangeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'current_password' => ['required', 'current_password'],
            'password'         => [
                'required',
                'string',
                'max:255',                      // bcrypt truncation guard
                'confirmed',
                Password::min(8)->letters()->numbers(),
                'different:current_password',
                'not_in:'.UserImportService::DEFAULT_PASSWORD,  // ← no hardcoded string
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'password.different'                 => 'Your new password must be different from your current one.',
            'password.not_in'                    => 'The default password is not allowed. Choose something else.',
            'current_password.current_password'  => 'The current password is incorrect.',
            'password.max'                       => 'The password is too long (max 255 characters).',
        ];
    }
}