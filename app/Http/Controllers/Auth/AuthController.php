<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\User;

class AuthController extends Controller
{
    public function showLogin()
    {
        return Inertia::render('Auth/Login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'login' => 'required|string',
            'password' => 'required|string',
        ]);

        $loginInput = $request->login;
        $isEmail = filter_var($loginInput, FILTER_VALIDATE_EMAIL);

        $user = null;
        if ($isEmail) {
            $user = \App\Models\User::where('email', $loginInput)->first();
        } else {
            // Check NISN or Name
            $user = \App\Models\User::where('nisn', $loginInput)
                ->orWhere('name', $loginInput)
                ->first();
        }

        if ($user && Auth::attempt([
            'id' => $user->id,
            'password' => $request->password
        ])) {
            $request->session()->regenerate();

            $intendedUrl = Auth::user()->role === 'admin' 
                ? redirect()->intended('/admin/dashboard')->getTargetUrl()
                : redirect()->intended('/dashboard')->getTargetUrl();

            return Inertia::location($intendedUrl);
        }

        return back()->withErrors([
            'login' => 'Kredensial tidak sesuai dengan data kami.',
        ]);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Inertia::location('/');
    }
}
