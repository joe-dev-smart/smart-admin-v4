<?php

namespace App\Http\Controllers;

use App\Models\AppSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        return Inertia::render('Settings/Index', [
            'settings' => [
                'default_locale' => AppSetting::get('default_locale', 'es'),
            ],
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'default_locale' => 'required|in:es,en',
        ]);

        AppSetting::set('default_locale', $validated['default_locale']);

        return back()->with('success', 'settings.messages.updated');
    }
}
