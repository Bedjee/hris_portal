<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class SyncUserApplicationsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() === true;
    }

    public function rules(): array
    {
        return [
            'applications'   => ['present', 'array'],
            'applications.*' => ['integer', 'exists:applications,id'],
        ];
    }
}