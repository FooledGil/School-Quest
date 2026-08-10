<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\QuestCompletion;
use App\Services\ExpService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class QuestValidationController extends Controller
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
                    'student_name' => $completion->user->name,
                    'student_nisn' => $completion->user->nisn,
                    'student_avatar_seed' => $completion->user->avatar_seed ?? $completion->user->name,
                    'quest_title' => $completion->quest->title,
                    'quest_category' => $completion->quest->category,
                    'quest_difficulty' => $completion->quest->difficulty,
                    'exp_reward' => $completion->exp_earned,
                    'proof_text' => $completion->proof_text,
                    'submitted_at' => $completion->completed_at->diffForHumans(),
                    'submitted_at_full' => $completion->completed_at->format('d M Y, H:i'),
                ];
            });

        // Also get recent history (approved/rejected)
        $history = QuestCompletion::with(['user', 'quest', 'validator'])
            ->whereIn('status', ['approved', 'rejected'])
            ->latest('validated_at')
            ->limit(20)
            ->get()
            ->map(function ($completion) {
                return [
                    'id' => $completion->id,
                    'student_name' => $completion->user->name,
                    'quest_title' => $completion->quest->title,
                    'status' => $completion->status,
                    'exp_reward' => $completion->exp_earned,
                    'validated_by_name' => $completion->validator?->name ?? '-',
                    'validated_at' => $completion->validated_at?->diffForHumans(),
                    'rejection_reason' => $completion->rejection_reason,
                ];
            });

        return Inertia::render('Admin/Quests/Validations', [
            'submissions' => $submissions,
            'history' => $history,
        ]);
    }

    public function approve(QuestCompletion $completion, ExpService $expService)
    {
        if ($completion->status !== 'pending') {
            return back()->with('error', 'Submission ini sudah divalidasi sebelumnya.');
        }

        $user = $completion->user;
        $oldLevel = $user->level;

        // Update status
        $completion->update([
            'status' => 'approved',
            'validated_by' => Auth::id(),
            'validated_at' => now(),
        ]);

        // Now give the EXP
        $expService->addExp($user, $completion->exp_earned);

        $user->refresh();
        $newLevel = $user->level;

        $flashData = [
            'success' => "Quest \"{$completion->quest->title}\" untuk {$user->name} telah di-approve! +{$completion->exp_earned} EXP diberikan.",
        ];

        return back()->with($flashData);
    }

    public function reject(Request $request, QuestCompletion $completion)
    {
        if ($completion->status !== 'pending') {
            return back()->with('error', 'Submission ini sudah divalidasi sebelumnya.');
        }

        $data = $request->validate([
            'rejection_reason' => 'nullable|string|max:500',
        ]);

        $completion->update([
            'status' => 'rejected',
            'rejection_reason' => $data['rejection_reason'] ?? null,
            'validated_by' => Auth::id(),
            'validated_at' => now(),
        ]);

        return back()->with('success', "Submission \"{$completion->quest->title}\" oleh {$completion->user->name} telah ditolak.");
    }
}
