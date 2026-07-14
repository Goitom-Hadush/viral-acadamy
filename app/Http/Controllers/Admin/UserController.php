<?php

namespace App\Http\Controllers\Admin; // <-- THIS MUST SAY ADMIN

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::orderBy('created_at', 'desc')->get();
        
        if (request()->wantsJson() || request()->is('test-users')) {
            return response()->json(['users' => $users]);
        }
        
        return Inertia::render('Admin/Users/Index', [
            'users' => $users
        ]);
    }

    public function changeRole(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => 'required|in:admin,instructor,student',
        ]);

        $user->update($validated);

        return redirect()->back()->with('success', "User role updated to {$validated['role']} successfully.");
    }
}