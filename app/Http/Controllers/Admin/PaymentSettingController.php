<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PaymentSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentSettingController extends Controller
{
    /**
     * Display the payment settings management form.
     */
    public function index()
    {
        $settings = PaymentSetting::getSettings();

        return Inertia::render('Admin/PaymentSettings/Index', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update the dynamic payment settings.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'bank_name' => 'required|string|max:100',
            'bank_account_name' => 'required|string|max:150', // Book Owner
            'bank_account_number' => 'required|string|max:50', // Book Number
            'telebirr_phone' => 'required|string|max:50',
            'telebirr_name' => 'required|string|max:150',
            // Diaspora dollar account (optional, but all three are needed to publish it)
            'dollar_bank_name' => 'nullable|required_with:dollar_account_name,dollar_account_number|string|max:100',
            'dollar_account_name' => 'nullable|required_with:dollar_bank_name,dollar_account_number|string|max:150',
            'dollar_account_number' => 'nullable|required_with:dollar_bank_name,dollar_account_name|string|max:50',
            'instructions' => 'nullable|string|max:1000',
        ], [
            'bank_name.required' => 'The bank name is required (e.g. Commercial Bank of Ethiopia).',
            'bank_account_name.required' => 'The book owner (account holder name) is required.',
            'bank_account_number.required' => 'The book number (account number) is required.',
            'telebirr_phone.required' => 'The Telebirr phone number is required.',
            'telebirr_name.required' => 'The Telebirr account name is required.',
        ]);

        $settings = PaymentSetting::getSettings();
        $settings->update($validated);

        return redirect()->back()->with('success', 'Bank and Telebirr payment account details updated successfully!');
    }
}
