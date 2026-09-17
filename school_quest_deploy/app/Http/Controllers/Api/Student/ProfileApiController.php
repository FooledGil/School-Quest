<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use App\Models\UserSanction;
use App\Services\ExpService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class ProfileApiController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user()->load([
            'achievements.achievement',
            'questCompletions' => function ($q) {
                $q->latest('completed_at')->take(10)->with('quest');
            }
        ]);

        $user->rank_name = ExpService::getRankName($user->level ?: 1);

        $allAchievements = Achievement::all();
        $userAchievementIds = $user->achievements->pluck('achievement_id')->toArray();

        $achievements = $allAchievements->map(function ($ach) use ($userAchievementIds) {
            $ach->is_unlocked = in_array($ach->id, $userAchievementIds);
            return $ach;
        });

        return response()->json([
            'status' => 'success',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'nisn' => $user->nisn,
                    'class' => $user->class,
                    'role' => $user->role,
                    'avatar' => $user->avatar,
                    'avatar_seed' => $user->avatar_seed,
                    'exp' => $user->exp ?: 0,
                    'weekly_exp' => $user->weekly_exp ?: 0,
                    'level' => $user->level ?: 1,
                    'rank_name' => $user->rank_name,
                    'streak_days' => $user->streak_days ?: 0,
                    'next_level_exp' => $user->next_level_exp,
                    'current_level_base_exp' => $user->current_level_base_exp,
                    'exp_in_level' => $user->exp_in_level,
                    'exp_needed_in_level' => $user->exp_needed_in_level,
                    'exp_percentage' => $user->exp_percentage,
                    'exp_remaining' => $user->exp_remaining,
                    'has_completed_onboarding' => (bool) $user->has_completed_onboarding,
                    'is_muted' => (bool) $user->is_muted,
                    'mute_remaining_human' => $user->mute_remaining_human,
                ],
                'achievements' => $achievements,
                'recent_completions' => $user->questCompletions->map(function ($c) {
                    return [
                        'id' => $c->id,
                        'quest_title' => $c->quest?->title,
                        'category' => $c->quest?->category,
                        'exp_earned' => $c->exp_earned,
                        'status' => $c->status,
                        'completed_at' => $c->completed_at?->format('d M Y, H:i'),
                        'rejection_reason' => $c->rejection_reason,
                    ];
                }),
            ],
        ]);
    }

    public function updateAvatar(Request $request)
    {
        $request->validate([
            'avatar_seed' => 'required|string|max:100',
        ]);

        $user = $request->user();
        $this->deleteOldStorageAvatar($user);

        $user->avatar_seed = $request->avatar_seed;
        $user->avatar = null;
        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Avatar pixel bot berhasil disimpan!',
            'avatar_seed' => $user->avatar_seed,
        ]);
    }

    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar_file' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $user = $request->user();
        $this->deleteOldStorageAvatar($user);

        $path = $request->file('avatar_file')->store('avatars', 'public');
        \App\Services\StorageMirrorService::mirrorToRoot($path);

        $user->avatar = '/storage/' . $path;
        $user->avatar_seed = null;
        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Foto avatar berhasil diperbarui!',
            'avatar' => $user->avatar,
        ]);
    }

    public function resetAvatar(Request $request)
    {
        $user = $request->user();
        $this->deleteOldStorageAvatar($user);

        $user->avatar = null;
        $user->avatar_seed = null;
        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Avatar telah dikembalikan ke siluet default!',
        ]);
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'password' => 'required|min:6|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Password lama tidak sesuai.',
            ], 422);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Password berhasil diperbarui!',
        ]);
    }

    public function completeOnboarding(Request $request)
    {
        $user = $request->user();
        $user->has_completed_onboarding = true;
        $user->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Onboarding berhasil diselesaikan.',
        ]);
    }

    public function acknowledgeSanction(Request $request, UserSanction $sanction)
    {
        $user = $request->user();
        if ($sanction->user_id === $user->id) {
            $sanction->update(['is_acknowledged' => true]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Pemberitahuan sanksi telah dikonfirmasi.',
        ]);
    }

    private function deleteOldStorageAvatar($user)
    {
        if ($user->avatar && str_starts_with($user->avatar, '/storage/avatars/')) {
            $relativeFilePath = str_replace('/storage/', '', $user->avatar);
            if (Storage::disk('public')->exists($relativeFilePath)) {
                Storage::disk('public')->delete($relativeFilePath);
            }
        }
    }
}
