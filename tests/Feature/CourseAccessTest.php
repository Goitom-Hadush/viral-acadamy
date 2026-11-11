<?php

namespace Tests\Feature;

use App\Models\Course;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CourseAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_to_login_when_viewing_a_course(): void
    {
        $course = Course::factory()->create(['status' => 'published']);

        $response = $this->get(route('courses.show', $course));

        $response->assertRedirectToRoute('login');
    }
}
