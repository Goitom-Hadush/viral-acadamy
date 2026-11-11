<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class LocaleController extends Controller
{
    public function switch(Request $request, string $locale): RedirectResponse
    {
        $supported = config('app.supported_locales', ['en', 'ti', 'am']);

        if (! in_array($locale, $supported, true)) {
            abort(404);
        }

        $request->session()->put('locale', $locale);

        return back()->withCookie(cookie()->forever('locale', $locale));
    }
}
