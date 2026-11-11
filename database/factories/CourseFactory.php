<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Course;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/** @extends Factory<Course> */
class CourseFactory extends Factory
{
    protected $model = Course::class;

    public function definition(): array
    {
        $title = fake()->unique()->sentence(3);

        return [
            'instructor_id' => User::factory()->state(['role' => 'instructor']),
            'category_id' => Category::factory(),
            'title' => $title,
            'slug' => Str::slug($title).'-'.fake()->unique()->numerify('####'),
            'description' => fake()->paragraph(),
            'thumbnail' => 'thumbnails/dummy.jpg',
            'price' => 800,
            'price_usd' => 25,
            'status' => 'draft',
        ];
    }
}
