<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class EnableSsoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() === true;
    }

    public function rules(): array
{
    return [
        'redirect_uri'     => ['required', 'url:http,https', 'max:2048'],
        'sso_initiate_url' => ['required', 'url:http,https', 'max:2048'],
    ];
}

    public function messages(): array
    {
        return [
            'redirect_uri.url' => 'The redirect URI must be a full http(s) URL.',
        ];
    }
}