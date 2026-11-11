<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class InstructorController extends Controller
{
    public function index()
    {
        $instructors = User::where('role', 'instructor')
            ->withCount('courses')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Admin/Instructors/Index', [
            'instructors' => $instructors,
            'stats' => [
                'total'    => $instructors->count(),
                'active'   => $instructors->where('status', 'active')->count(),
                'inactive' => $instructors->where('status', 'inactive')->count(),
                'courses'  => $instructors->sum('courses_count'),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'         => 'required|string|max:255',
            'email'        => 'nullable|email|unique:users,email',
            'phone'        => 'required|string|unique:users,phone',
            'password'     => 'required|string|min:8|confirmed',
            'avatar'       => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'social_media' => 'nullable|array',
            'social_media.telegram'  => 'nullable|string|max:255',
            'social_media.whatsapp'  => 'nullable|string|max:255',
            'social_media.instagram' => 'nullable|url|max:255',
            'social_media.facebook'  => 'nullable|url|max:255',
            'social_media.twitter'   => 'nullable|url|max:255',
            'social_media.linkedin'  => 'nullable|url|max:255',
            'social_media.youtube'   => 'nullable|url|max:255',
            'social_media.tiktok'    => 'nullable|url|max:255',
        ]);

        if ($request->hasFile('avatar')) {
            $validated['avatar'] = $request->file('avatar')
                ->store('avatars', 'public');
        }

        $validated['role']     = 'instructor';
        $validated['status']   = 'active';
        $validated['password'] = Hash::make($validated['password']);

        // Clean social media — remove empty entries
        if (isset($validated['social_media'])) {
            $validated['social_media'] = array_filter(
                $validated['social_media'],
                fn ($v) => !empty($v)
            );
        }

        User::create($validated);

        return redirect()->route('admin.instructors.index')
            ->with('success', 'Instructor account created successfully!');
    }

    public function update(Request $request, User $user)
    {
        abort_if($user->role !== 'instructor', 403);

        $validated = $request->validate([
            'name'         => 'required|string|max:255',
            'email'        => 'nullable|email|unique:users,email,' . $user->id,
            'phone'        => 'required|string|unique:users,phone,' . $user->id,
            'password'     => 'nullable|string|min:8|confirmed',
            'avatar'       => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
            'social_media' => 'nullable|array',
            'social_media.telegram'  => 'nullable|string|max:255',
            'social_media.whatsapp'  => 'nullable|string|max:255',
            'social_media.instagram' => 'nullable|url|max:255',
            'social_media.facebook'  => 'nullable|url|max:255',
            'social_media.twitter'   => 'nullable|url|max:255',
            'social_media.linkedin'  => 'nullable|url|max:255',
            'social_media.youtube'   => 'nullable|url|max:255',
            'social_media.tiktok'    => 'nullable|url|max:255',
        ]);

        // Avatar upload
        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            $validated['avatar'] = $request->file('avatar')
                ->store('avatars', 'public');
        } else {
            unset($validated['avatar']);
        }

        // Password — only update if provided
        if (!empty($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        // Clean social media
        if (isset($validated['social_media'])) {
            $validated['social_media'] = array_filter(
                $validated['social_media'],
                fn ($v) => !empty($v)
            );
        }

        $user->update($validated);

        return redirect()->route('admin.instructors.index')
            ->with('success', 'Instructor profile updated successfully!');
    }

    public function toggleStatus(User $user)
    {
        abort_if($user->role !== 'instructor', 403);

        $newStatus = $user->status === 'active' ? 'inactive' : 'active';
        $user->update(['status' => $newStatus]);

        $msg = $newStatus === 'active'
            ? "{$user->name} is now active."
            : "{$user->name} has been deactivated.";

        return redirect()->back()->with('success', $msg);
    }

    public function destroy(User $user)
    {
        abort_if($user->role !== 'instructor', 403);

        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar);
        }

        $user->delete();

        return redirect()->route('admin.instructors.index')
            ->with('success', 'Instructor deleted successfully.');
    }
}
