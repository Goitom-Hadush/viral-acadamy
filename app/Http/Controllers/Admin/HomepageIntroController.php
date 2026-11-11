<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class HomepageIntroController extends Controller
{
    private const INTRO_PATH = 'intro/welcome.mp4';

    public function index(): Response
    {
        $hasIntro = Storage::disk('public')->exists(self::INTRO_PATH);

        return Inertia::render('Admin/Intro/Index', [
            'introVideo' => $hasIntro
                ? [
                    'src' => '/media/'.self::INTRO_PATH,
                    'updated_at' => Storage::disk('public')->lastModified(self::INTRO_PATH),
                ]
                : null,
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'video' => 'required|file|mimes:mp4,mov,webm|max:512000',
        ]);

        Storage::disk('public')->makeDirectory('intro');
        $request->file('video')->storeAs('intro', 'welcome.mp4', 'public');

        cache()->forget('intro_welcome_exists');
        cache()->forget('homepage.payload.v5');

        return redirect()->back()->with('success', 'Homepage introduction video uploaded.');
    }

    public function destroy(): RedirectResponse
    {
        Storage::disk('public')->delete(self::INTRO_PATH);

        cache()->forget('intro_welcome_exists');
        cache()->forget('homepage.payload.v5');

        return redirect()->back()->with('success', 'Homepage introduction video removed.');
    }
}
