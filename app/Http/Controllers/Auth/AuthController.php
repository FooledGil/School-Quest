<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Services\IdentityResolver;

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

        // Normalized lookup so names with trailing/double spaces still work.
        $user = IdentityResolver::find(trim($request->login));

        if ($user && Auth::attempt([
            'id' => $user->id,
            'password' => $request->password
        ])) {
            $request->session()->regenerate();

            $intendedUrl = Auth::user()->role === 'admin'
                ? redirect()->intended('/admin/dashboard')->getTargetUrl()
                : redirect()->intended('/dashboard')->getTargetUrl();

            // Return JSON response when animation header is present (both admin & student)
            if ($request->header('X-Login-Animation')) {
                return response()->json([
                    'success' => true,
                    'redirect' => $intendedUrl,
                ]);
            }

            // Fallback normal Inertia redirect (e.g. no animation requested)
            return Inertia::location($intendedUrl);
        }

        // Error: support both JSON (animation flow) and Inertia (fallback)
        if ($request->header('X-Login-Animation')) {
            return response()->json([
                'success' => false,
                'errors' => ['login' => 'Kredensial tidak sesuai dengan data kami.'],
            ], 422);
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

    /**
     * Handle public password reset request report from web login
     */
    public function reportForgotPassword(Request $request)
    {
        $request->validate([
            'identifier' => 'required|string|max:100',
            'notes' => 'nullable|string|max:500',
        ]);

        \App\Models\PasswordResetRequest::ensureTableExists();

        $identifier = trim($request->identifier);
        $normalized = IdentityResolver::normalize($identifier);

        // Handles trailing/double spaces and non-breaking spaces in stored names.
        $user = IdentityResolver::find($identifier);

        // Do not create a request for an identity that does not exist.
        // This prevents the admin queue from filling up with fake/typo identities.
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Identitas tidak ditemukan. Periksa kembali Nama Lengkap, NISN, atau Email yang terdaftar di SchoolQuest.',
                'errors' => [
                    'identifier' => ['Identitas tidak ditemukan. Periksa kembali Nama Lengkap, NISN, atau Email Anda.'],
                ],
            ], 422);
        }

        // Check if there is already a pending request (same account or normalized identifier).
        $existing = \App\Models\PasswordResetRequest::where('status', 'pending')
            ->get()
            ->first(function ($resetReq) use ($user, $normalized) {
                return (int) $resetReq->user_id === (int) $user->id
                    || IdentityResolver::normalize($resetReq->identifier) === $normalized;
            });

        if ($existing) {
            return response()->json([
                'success' => true,
                'message' => 'Laporan lupa kata sandi Anda sudah tercatat dan sedang menunggu konfirmasi Admin. Kata sandi akan disetel ke default: password.',
            ]);
        }

        \App\Models\PasswordResetRequest::create([
            'user_id' => $user->id,
            'identifier' => $identifier,
            'notes' => $request->notes,
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Laporan lupa kata sandi berhasil dikirim! Silakan hubungi Admin atau Wali Kelas untuk konfirmasi reset ke password bawaan (password).',
        ]);
    }
}
