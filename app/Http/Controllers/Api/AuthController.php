<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\ExpService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Handle mobile login with Email, NISN, or Username.
     */
    public function login(Request $request)
    {
        $request->validate([
            'login' => 'required|string',
            'password' => 'required|string',
            'device_name' => 'nullable|string',
        ]);

        $loginInput = trim($request->login);
        $isEmail = filter_var($loginInput, FILTER_VALIDATE_EMAIL);

        if ($isEmail) {
            $user = User::where('email', $loginInput)->first();
        } else {
            $user = User::where('nisn', $loginInput)
                ->orWhere('name', $loginInput)
                ->first();
        }

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Kredensial tidak sesuai dengan data kami.',
            ], 422);
        }

        if ($user->is_banned) {
            return response()->json([
                'status' => 'error',
                'message' => 'Akun Anda telah dinonaktifkan oleh administrator.',
            ], 403);
        }

        // Initialize or maintain streak on successful login
        $today = \Carbon\Carbon::today();
        if (!$user->last_activity_date) {
            $user->streak_days = 1;
            $user->last_activity_date = $today;
            $user->save();
        } else {
            $lastActivity = \Carbon\Carbon::parse($user->last_activity_date)->startOfDay();
            if ($lastActivity->isYesterday()) {
                $user->streak_days = ($user->streak_days ?: 0) + 1;
                $user->last_activity_date = $today;
                $user->save();
            } elseif ($lastActivity->isBefore(\Carbon\Carbon::yesterday())) {
                $user->streak_days = 1;
                $user->last_activity_date = $today;
                $user->save();
            } elseif ($user->streak_days == 0) {
                $user->streak_days = 1;
                $user->last_activity_date = $today;
                $user->save();
            }
        }

        $deviceName = $request->device_name ?: 'flutter-mobile-app';
        $token = $user->createToken($deviceName)->plainTextToken;

        $user->rank_name = ExpService::getRankName($user->level ?: 1);

        return response()->json([
            'status' => 'success',
            'message' => 'Login berhasil.',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'nisn' => $user->nisn,
                'role' => $user->role,
                'class' => $user->class,
                'level' => $user->level ?: 1,
                'exp' => $user->exp ?: 0,
                'weekly_exp' => $user->weekly_exp ?: 0,
                'streak_days' => $user->streak_days ?: 0,
                'avatar' => $user->avatar,
                'avatar_seed' => $user->avatar_seed,
                'rank_name' => $user->rank_name,
                'has_completed_onboarding' => (bool) $user->has_completed_onboarding,
                'is_muted' => (bool) $user->is_muted,
                'muted_until' => $user->muted_until?->toIso8601String(),
                'mute_remaining_human' => $user->mute_remaining_human,
            ],
        ]);
    }

    /**
     * Get the authenticated user info.
     */
    public function me(Request $request)
    {
        $user = $request->user();
        $user->rank_name = ExpService::getRankName($user->level ?: 1);

        // Check active sanction
        $activeSanction = $user->sanctions()
            ->where('is_active', true)
            ->where('is_acknowledged', false)
            ->latest()
            ->first();

        return response()->json([
            'status' => 'success',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'nisn' => $user->nisn,
                'role' => $user->role,
                'class' => $user->class,
                'level' => $user->level ?: 1,
                'exp' => $user->exp ?: 0,
                'weekly_exp' => $user->weekly_exp ?: 0,
                'streak_days' => $user->streak_days ?: 0,
                'avatar' => $user->avatar,
                'avatar_seed' => $user->avatar_seed,
                'rank_name' => $user->rank_name,
                'next_level_exp' => $user->next_level_exp,
                'current_level_base_exp' => $user->current_level_base_exp,
                'exp_in_level' => $user->exp_in_level,
                'exp_needed_in_level' => $user->exp_needed_in_level,
                'exp_percentage' => $user->exp_percentage,
                'exp_remaining' => $user->exp_remaining,
                'has_completed_onboarding' => (bool) $user->has_completed_onboarding,
                'is_muted' => (bool) $user->is_muted,
                'muted_until' => $user->muted_until?->toIso8601String(),
                'mute_remaining_human' => $user->mute_remaining_human,
                'active_sanction' => $activeSanction ? [
                    'id' => $activeSanction->id,
                    'type' => $activeSanction->type,
                    'reason' => $activeSanction->reason,
                    'amount' => $activeSanction->amount,
                    'expires_at' => $activeSanction->expires_at?->format('d M Y, H:i'),
                ] : null,
            ],
        ]);
    }

    /**
     * Logout and revoke current token.
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Berhasil logout.',
        ]);
    }

    /**
     * Report forgotten password by student / user.
     */
    public function reportForgotPassword(Request $request)
    {
        $request->validate([
            'identifier' => 'required|string|max:100',
            'notes' => 'nullable|string|max:500',
        ]);

        \App\Models\PasswordResetRequest::ensureTableExists();

        $identifier = trim($request->identifier);
        $normalized = mb_strtolower($identifier);

        $user = User::where(function ($q) use ($normalized) {
            $q->whereRaw('LOWER(nisn) = ?', [$normalized])
                ->orWhereRaw('LOWER(name) = ?', [$normalized])
                ->orWhereRaw('LOWER(email) = ?', [$normalized]);
        })->first();

        // Do not create a request for an identity that does not exist.
        if (!$user) {
            return response()->json([
                'status' => 'error',
                'success' => false,
                'message' => 'Identitas tidak ditemukan. Periksa kembali Nama Lengkap, NISN, atau Email yang terdaftar di SchoolQuest.',
                'errors' => [
                    'identifier' => ['Identitas tidak ditemukan. Periksa kembali Nama Lengkap, NISN, atau Email Anda.'],
                ],
            ], 422);
        }

        // Check if there is already a pending request (same account or same identifier, case-insensitive)
        $existing = \App\Models\PasswordResetRequest::where('status', 'pending')
            ->where(function ($q) use ($normalized, $user) {
                $q->where('user_id', $user->id)
                    ->orWhereRaw('LOWER(identifier) = ?', [$normalized]);
            })->first();

        if ($existing) {
            return response()->json([
                'status' => 'success',
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
            'status' => 'success',
            'message' => 'Laporan lupa kata sandi berhasil dikirim! Silakan hubungi Admin atau Wali Kelas untuk konfirmasi reset ke password bawaan (password).',
        ]);
    }
}
