<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered(): void
    {
        $response = $this->get('/register');

        $response->assertStatus(200);
    }

    public function test_new_users_can_register(): void
    {
        $response = $this->post('/register', [
            'name' => 'Test User',
            'phone' => '0912345678',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('student.dashboard', absolute: false));
        $response->assertSessionHas('success');
    }

    public function test_new_users_can_register_with_phone_only(): void
    {
        $response = $this->post('/register', [
            'name' => 'User Without Email',
            'phone' => '0922334455',
            'email' => '',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('student.dashboard', absolute: false));
        $this->assertDatabaseHas('users', [
            'phone' => '0922334455',
            'email' => null,
        ]);
    }

    public function test_multiple_users_can_register_without_email(): void
    {
        $user1 = $this->post('/register', [
            'name' => 'First Phone User',
            'phone' => '0933333331',
            'email' => '',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);
        $user1->assertRedirect(route('student.dashboard', absolute: false));

        auth()->logout();

        $user2 = $this->post('/register', [
            'name' => 'Second Phone User',
            'phone' => '0933333332',
            'email' => '',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);
        $user2->assertRedirect(route('student.dashboard', absolute: false));

        $this->assertDatabaseHas('users', ['phone' => '0933333331', 'email' => null]);
        $this->assertDatabaseHas('users', ['phone' => '0933333332', 'email' => null]);
    }

    public function test_registration_validation_fails_on_duplicate_phone(): void
    {
        $this->post('/register', [
            'name' => 'Existing User',
            'phone' => '0944444444',
            'email' => 'exist@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        auth()->logout();

        $response = $this->post('/register', [
            'name' => 'Duplicate Phone User',
            'phone' => '0944444444',
            'email' => 'other@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertSessionHasErrors(['phone']);
    }
}
