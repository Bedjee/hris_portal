<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() === true;
    }

    public function rules(): array
    {
        $id = $this->route('application')->id;

        return [
            'name'        => ['required', 'string', 'max:255'],
            'slug'        => ['required', 'string', 'max:255', 'alpha_dash', Rule::unique('applications', 'slug')->ignore($id)],
            'description' => ['nullable', 'string', 'max:500'],
            'url'         => ['required', 'url:http,https', 'max:2048'],
            'icon'        => ['nullable', 'string', 'max:50'],
            'is_active'   => ['sometimes', 'boolean'],
            'sort_order'  => ['sometimes', 'integer', 'min:0', 'max:9999'],
        ];
    }
}