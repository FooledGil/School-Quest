<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Models\Quest;
use App\Models\QuestCompletion;
use App\Services\QuestGeneratorService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class QuestApiController extends Controller
{
    public function index(Request $request, QuestGeneratorService $questService)
    {
        $user = $request->user();
        $today = Carbon::today();

        // Ensure daily quests are generated
        $questService->generateForUser($user);

        // Get today's completions with their status
        $todayCompletions = $user->questCompletions()
            ->whereDate('completed_at', $today)
            ->get()
            ->keyBy('quest_id');

        // Main quests (Daily) - filtered for user's class
        $mainQuests = Quest::where('type', 'main')
            ->where('available_date', $today->toDateString())
            ->where(function ($q) use ($user) {
                $q->whereNull('class')->orWhere('class', $user->class);
            })
            ->get()
            ->map(function ($q) use ($todayCompletions) {
                $completion = $todayCompletions->get($q->id);
                $q->completed = $completion !== null;
                $q->submission_status = $completion?->status ?? null;
                $q->rejection_reason = $completion?->rejection_reason ?? null;
                $q->submitted_proof_text = $completion?->proof_text ?? null;
                $q->submitted_proof_image = $completion?->proof_image ? Storage::url($completion->proof_image) : null;
                return $q;
            });

        // Additional quests
        $additionalQuests = Quest::where('type', 'additional')
            ->where('is_active', true)
            ->get()
            ->map(function ($q) use ($todayCompletions) {
                $completion = $todayCompletions->get($q->id);
                $q->completed = $completion !== null && $completion->status === 'approved';
                $q->submission_status = $completion?->status ?? null;
                $q->rejection_reason = $completion?->rejection_reason ?? null;
                $q->submitted_proof_text = $completion?->proof_text ?? null;
                $q->submitted_proof_image = $completion?->proof_image ? Storage::url($completion->proof_image) : null;
                return $q;
            });

        return response()->json([
            'status' => 'success',
            'data' => [
                'main_quests' => $mainQuests,
                'additional_quests' => $additionalQuests,
            ],
        ]);
    }

    public function complete(Request $request, Quest $quest)
    {
        $user = $request->user();
        $today = Carbon::today();

        $request->validate([
            'proof_text' => 'nullable|string|max:1000|required_without:proof_image',
            'proof_image' => 'nullable|image|max:5120|required_without:proof_text',
        ]);

        // Check if already submitted today (pending or approved)
        $existingCompletion = QuestCompletion::where('user_id', $user->id)
            ->where('quest_id', $quest->id)
            ->whereDate('completed_at', $today)
            ->whereIn('status', ['pending', 'approved'])
            ->exists();

        if ($existingCompletion) {
            return response()->json([
                'status' => 'error',
                'message' => 'Quest sudah disubmit atau diselesaikan hari ini.',
            ], 422);
        }

        // Delete any rejected submission for today so they can resubmit
        QuestCompletion::where('user_id', $user->id)
            ->where('quest_id', $quest->id)
            ->whereDate('completed_at', $today)
            ->where('status', 'rejected')
            ->delete();

        $proofImagePath = null;
        if ($request->hasFile('proof_image')) {
            $proofImagePath = $request->file('proof_image')->store('quest_proofs', 'public');
            \App\Services\StorageMirrorService::mirrorToRoot($proofImagePath);
        }

        $completion = QuestCompletion::create([
            'user_id' => $user->id,
            'quest_id' => $quest->id,
            'completed_at' => now(),
            'exp_earned' => $quest->exp_reward,
            'status' => 'pending',
            'proof_text' => $request->proof_text,
            'proof_image' => $proofImagePath,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Bukti pengerjaan quest berhasil dikirim! Menunggu validasi admin.',
            'data' => [
                'completion_id' => $completion->id,
                'status' => 'pending',
                'proof_image_url' => $proofImagePath ? Storage::url($proofImagePath) : null,
            ],
        ]);
    }
}
