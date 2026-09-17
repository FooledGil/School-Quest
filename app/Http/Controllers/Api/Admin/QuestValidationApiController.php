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

        $completion->update([
            'status' => 'approved',
            'validated_by' => $request->user()->id,
            'validated_at' => now(),
        ]);

        $result = $expService->addExp($user, $completion->exp_earned);

        $user->refresh();

        $bonusMsg = ($result['bonus_exp'] ?? 0) > 0
            ? " (Termasuk +{$result['bonus_exp']} EXP {$result['catch_up']['title']}!)"
            : "";

        return response()->json([
            'status' => 'success',
            'message' => "Quest \"{$completion->quest->title}\" untuk {$user->name} telah di-approve! +{$result['exp_gained']} EXP{$bonusMsg} diberikan.",
            'data' => [
                'exp_gained' => $result['exp_gained'],
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
