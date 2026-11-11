<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CertificateSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class CertificateSettingController extends Controller
{
    public function index()
    {
        $this->assertAdmin();

        return Inertia::render('Admin/CertificateSettings/Index', [
            'settings' => CertificateSetting::forDisplay(),
            'migrations_missing' => ! Schema::hasTable('certificate_settings'),
        ]);
    }

    public function update(Request $request)
    {
        $this->assertAdmin();

        if (! Schema::hasTable('certificate_settings')) {
            return redirect()->back()->with('error', 'Please run php artisan migrate first.');
        }

        $validated = $request->validate([
            'signer_name' => 'required|string|max:150',
            'signer_title' => 'required|string|max:150',
            'organization' => 'required|string|max:150',
            'signature' => 'nullable|image|mimes:png,jpg,jpeg,webp|max:3072',
        ]);

        $settings = CertificateSetting::getSettings();
        $settings->fill([
            'signer_name' => $validated['signer_name'],
            'signer_title' => $validated['signer_title'],
            'organization' => $validated['organization'],
        ]);

        if ($request->hasFile('signature')) {
            if ($settings->signature_path) {
                Storage::disk('public')->delete($settings->signature_path);
            }
            $settings->signature_path = $request->file('signature')->store('signatures', 'public');
        }

        $settings->save();

        return redirect()->back()->with('success', 'Certificate signature updated.');
    }

    public function destroySignature()
    {
        $this->assertAdmin();

        if (Schema::hasTable('certificate_settings')) {
            $settings = CertificateSetting::getSettings();
            if ($settings->signature_path) {
                Storage::disk('public')->delete($settings->signature_path);
                $settings->update(['signature_path' => null]);
            }
        }

        return redirect()->back()->with('success', 'Signature image removed.');
    }

    private function assertAdmin(): void
    {
        if (! auth()->check() || auth()->user()->role !== 'admin') {
            abort(403, 'Only admins can manage certificate settings.');
        }
    }
}
