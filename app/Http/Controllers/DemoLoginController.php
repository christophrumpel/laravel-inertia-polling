<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DemoLoginController extends Controller
{
    /**
     * Log the demo user in with a single click. Guarded to local/demo
     * environments so it can never be used in production.
     */
    public function __invoke(Request $request): RedirectResponse
    {
        abort_if(app()->isProduction(), 403);

        $user = User::query()->firstOrCreate(
            ['email' => 'christoph@laravel.com'],
            [
                'name' => 'Christoph',
                'password' => 'password',
                'email_verified_at' => now(),
            ],
        );

        Auth::login($user, remember: true);

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard'));
    }
}
