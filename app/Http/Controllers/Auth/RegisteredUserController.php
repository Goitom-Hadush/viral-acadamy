<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register', [
            'status' => session('status') ?? session('success'),
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        // Normalize empty email string to null and trim inputs
        $normalizedEmail = $request->filled('email') ? strtolower(trim((string) $request->email)) : null;
        $normalizedPhone = trim((string) $request->phone);

        $request->merge([
            'name' => trim((string) $request->name),
            'email' => $normalizedEmail,
            'phone' => $normalizedPhone,
        ]);

        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:50', 'unique:'.User::class.',phone'],
            'email' => ['nullable', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class.',email'],
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ], [
            'phone.required' => 'The phone number is required.',
            'phone.unique' => 'This phone number is already registered. Please sign in or use a different phone number.',
            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'This email address is already registered. Please sign in or use a different email.',
            'password.required' => 'The password is required.',
            'password.confirmed' => 'The password confirmation does not match.',
        ]);

        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $normalizedEmail,
                'phone' => $normalizedPhone,
                'password' => Hash::make($request->password),
                'role' => 'student',
                'status' => 'active',
                'referral_code' => method_exists(User::class, 'generateUniqueReferralCode') ? User::generateUniqueReferralCode() : null,
            ]);

            \Log::info('User registered successfully', [
                'user_id' => $user->id,
                'phone' => $user->phone,
                'email' => $user->email,
                'role' => $user->role,
            ]);

            Auth::login($user);

            session()->flash('success', 'Your account has been created successfully! Welcome to Success Life Coaching.');
            session()->flash('status', 'Your account has been created successfully! Welcome to Success Life Coaching.');

            return redirect()
                ->route('student.dashboard')
                ->with('success', 'Your account has been created successfully! Welcome to Success Life Coaching.')
                ->with('status', 'Your account has been created successfully! Welcome to Success Life Coaching.');
        } catch (\Illuminate\Database\UniqueConstraintViolationException $e) {
            \Log::error('Registration duplicate error', ['error' => $e->getMessage()]);

            return back()
                ->withInput($request->except('password', 'password_confirmation'))
                ->withErrors([
                    'general' => 'An account with this phone number or email already exists. Please sign in instead.',
                ])
                ->with('error', 'An account with this phone number or email already exists.');
        } catch (\Throwable $e) {
            \Log::error('Registration failed', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);

            return back()
                ->withInput($request->except('password', 'password_confirmation'))
                ->withErrors([
                    'general' => 'Registration could not be completed: ' . $e->getMessage(),
                ])
                ->with('error', 'Registration could not be completed. Please try again.');
        }
    }
}
