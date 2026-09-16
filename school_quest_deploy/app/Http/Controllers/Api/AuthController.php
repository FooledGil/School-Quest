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
}
