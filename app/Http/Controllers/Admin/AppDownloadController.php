<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AppDownload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AppDownloadController extends Controller
{
    public function index()
    {
        $this->assertAdmin();

        if (! Schema::hasTable('app_downloads')) {
            return Inertia::render('Admin/AppDownloads/Index', [
                'appDownload' => null,
                'migrations_missing' => true,
            ]);
        }

        return Inertia::render('Admin/AppDownloads/Index', [
            'appDownload' => AppDownload::current(),
            'migrations_missing' => false,
        ]);
    }

    public function update(Request $request)
    {
        $this->assertAdmin();

        if (! Schema::hasTable('app_downloads')) {
            return redirect()->back()->with('error', 'Please run php artisan migrate first.');
        }

        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'android_version' => 'nullable|string|max:40',
            'ios_version' => 'nullable|string|max:40',
            'android_store_url' => 'nullable|url|max:500',
            'ios_store_url' => 'nullable|url|max:500',
            'android_file' => 'nullable|file|max:204800',
            'ios_file' => 'nullable|file|max:204800',
            'remove_android' => 'sometimes|boolean',
            'remove_ios' => 'sometimes|boolean',
            'is_active' => 'sometimes|boolean',
        ]);

        // Allow apk/ipa even if mimes sniff fails (common on Windows)
        if ($request->hasFile('android_file')) {
            $ext = strtolower($request->file('android_file')->getClientOriginalExtension());
            if (! in_array($ext, ['apk', 'zip'], true)) {
                return redirect()->back()->withErrors(['android_file' => 'Android file must be an .apk']);
            }
        }
        if ($request->hasFile('ios_file')) {
            $ext = strtolower($request->file('ios_file')->getClientOriginalExtension());
            if (! in_array($ext, ['ipa', 'zip'], true)) {
                return redirect()->back()->withErrors(['ios_file' => 'iOS file must be an .ipa']);
            }
        }

        $row = AppDownload::current() ?? new AppDownload();

        $row->title = $validated['title'] ?? $row->title;
        $row->android_version = $validated['android_version'] ?? null;
        $row->ios_version = $validated['ios_version'] ?? null;
        $row->android_store_url = $validated['android_store_url'] ?? null;
        $row->ios_store_url = $validated['ios_store_url'] ?? null;
        $row->is_active = $request->boolean('is_active');

        if ($request->boolean('remove_android') && $row->android_path) {
            Storage::disk('public')->delete($row->android_path);
            $row->android_path = null;
            $row->android_original_name = null;
        }

        if ($request->boolean('remove_ios') && $row->ios_path) {
            Storage::disk('public')->delete($row->ios_path);
            $row->ios_path = null;
            $row->ios_original_name = null;
        }

        if ($request->hasFile('android_file')) {
            if ($row->android_path) {
                Storage::disk('public')->delete($row->android_path);
            }
            $file = $request->file('android_file');
            $row->android_path = $file->storeAs('app-downloads', Str::random(40).'.apk', 'public');
            $row->android_original_name = $file->getClientOriginalName();
        }

        if ($request->hasFile('ios_file')) {
            if ($row->ios_path) {
                Storage::disk('public')->delete($row->ios_path);
            }
            $file = $request->file('ios_file');
            $row->ios_path = $file->storeAs('app-downloads', Str::random(40).'.ipa', 'public');
            $row->ios_original_name = $file->getClientOriginalName();
        }

        $row->save();

        return redirect()->back()->with('success', 'App download files updated.');
    }

    private function assertAdmin(): void
    {
        if (! auth()->check() || auth()->user()->role !== 'admin') {
            abort(403, 'Only admins can manage app downloads.');
        }
    }
}
