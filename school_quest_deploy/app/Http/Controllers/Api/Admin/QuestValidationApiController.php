<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\QuestCompletion;
use App\Services\ExpService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class QuestValidationApiController extends Controller
{
    public function index()
    {
        $submissions = QuestCompletion::with(['user', 'quest'])
            ->where('status', 'pending')
            ->latest()
            ->get()
            ->map(function ($completion) {
                $preview = $completion->user && $completion->quest
                    ? ExpService::getQuestRewardPreview(
                        $completion->user,
                        (int) $completion->exp_earned,
                        $completion->quest->category
                    )
                    : null;

                return [
                    'id' => $completion->id,
                    'student_id' => $completion->user?->id,
                    'student_name' => $completion->user?->name,
                    'student_nisn' => $completion->user?->nisn,
                    'student_avatar' => $completion->user?->avatar,
                    'student_avatar_seed' => $completion->user?->avatar_seed,
                    'quest_id' => $completion->quest?->id,
                    'quest_title' => $completion->quest?->title,
                    'quest_category' => $completion->quest?->category,
                    'quest_difficulty' => $completion->quest?->difficulty,
                    'exp_reward' => $completion->exp_earned,
                    'exp_base' => (int) $completion->exp_earned,
                    'catch_up' => $preview['catch_up'] ?? null,
                    'exp_catch_up_bonus' => $preview['catch_up_bonus'] ?? 0,
                    'exp_achievement_bonus' => $preview['achievement_bonus_exp'] ?? 0,
                    'exp_total_estimate' => $preview['exp_total_estimate'] ?? (int) $completion->exp_earned,
                    'proof_text' => $completion->proof_text,
                    'proof_image' => \App\Services\StorageMirrorService::mirrorToRoot($completion->proof_image),
                    'submitted_at_human' => $completion->completed_at?->diffForHumans(),
                    'submitted_at_full' => $completion->completed_at?->format('d M Y, H:i'),
                ];
            });

        $history = QuestCompletion::with(['user', 'quest', 'validator'])
            ->whereIn('status', ['approved', 'rejected'])
            ->latest('validated_at')
            ->limit(20)
            ->get()
            ->map(function ($completion) {
                return [
                    'id' => $completion->id,
                    'student_name' => $completion->user?->name,
                    'quest_title' => $completion->quest?->title,
                    'status' => $completion->status,
                    'exp_reward' => $completion->exp_earned,
                    'validated_by_name' => $completion->validator?->name ?? '-',
                    'validated_at_human' => $completion->validated_at?->diffForHumans(),
                    'rejection_reason' => $completion->rejection_reason,
                ];
            });

        return response()->json([
            'status' => 'success',
            'data' => [
                'submissions' => $submissions,
                'history' => $history,
            ],
        ]);
    }

    public function approve(Request $request, QuestCompletion $completion, ExpService $expService)
    {
        if ($completion->status !== 'pending') {
            return response()->json([
                'status' => 'error',
                'message' => 'Submission ini sudah divalidasi sebelumnya.',
            ], 422);
        }

        $user = $completion->user;
        $baseExp = (int) $completion->exp_earned;

        $completion->update([
            'status' => 'approved',
            'validated_by' => $request->user()->id,
            'validated_at' => now(),
        ]);

        $result = $expService->addExp($user, $baseExp);

        // Store the actual EXP awarded (base + catch-up + achievement bonuses)
        $completion->update(['exp_earned' => $result['total_exp_gained']]);

        $user->refresh();

        $breakdown = ["{$result['exp_base']} EXP dasar"];
        if (($result['bonus_exp'] ?? 0) > 0) {
            $breakdown[] = "+{$result['bonus_exp']} {$result['catch_up']['title']}";
        }
        if (($result['achievement_bonus_exp'] ?? 0) > 0) {
            $breakdown[] = "+{$result['achievement_bonus_exp']} bonus achievement";
        }

        return response()->json([
            'status' => 'success',
            'message' => "Quest \"{$completion->quest->title}\" untuk {$user->name} telah di-approve! +{$result['total_exp_gained']} EXP (".implode(', ', $breakdown).") diberikan.",
            'data' => [
                'exp_base' => $result['exp_base'],
                'exp_catch_up_bonus' => $result['bonus_exp'],
                'exp_achievement_bonus' => $result['achievement_bonus_exp'],
                'exp_gained' => $result['total_exp_gained'],
                'total_exp_gained' => $result['total_exp_gained'],
                'unlocked_achievements' => $result['unlocked_achievements'],
                'student_level' => $user->level,
                'student_exp' => $user->exp,
            ],
        ]);
    }

    public function reject(Request $request, QuestCompletion $completion)
    {
        if ($completion->status !== 'pending') {
            return response()->json([
                'status' => 'error',
                'message' => 'Submission ini sudah divalidasi sebelumnya.',
            ], 422);
        }

        $request->validate([
            'rejection_reason' => 'required|string|max:500',
        ]);

        $completion->update([
            'status' => 'rejected',
            'validated_by' => $request->user()->id,
            'validated_at' => now(),
            'rejection_reason' => $request->rejection_reason,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => "Quest \"{$completion->quest->title}\" ditolak.",
        ]);
    }
}
