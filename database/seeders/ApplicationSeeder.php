<?php

namespace Database\Seeders;

use App\Models\Application;
use Illuminate\Database\Seeder;

class ApplicationSeeder extends Seeder
{
    public function run(): void
    {
        foreach (config('portal.applications') as $definition) {
            Application::updateOrCreate(
                ['slug' => $definition['slug']],
                [
                    'name'        => $definition['name'],
                    'description' => $definition['description'],
                    'url'         => $definition['url'],
                    'icon'        => $definition['icon'],
                    'sort_order'  => $definition['sort_order'],
                    'is_active'   => true,
                ]
            );
        }
    }
}