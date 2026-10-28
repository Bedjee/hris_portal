<?php

namespace Database\Factories;

use App\Models\Application;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Application>
 */
class ApplicationFactory extends Factory
{
    protected $model = Application::class;

    public function definition(): array
    {
        $name = fake()->unique()->words(2, true);

        return [
            'name'        => Str::title($name),
            'slug'        => Str::slug($name),
            'description' => fake()->sentence(),
            'url'         => 'https://'.Str::slug($name).'.example.test',
            'icon'        => 'document',
            'is_active'   => true,
            'sort_order'  => fake()->numberBetween(0, 100),
        ];
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['is_active' => false]);
    }
}