<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Quest;
use App\Models\QuestCompletion;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class QuestController extends Controller
{
    public function index(\App\Services\QuestGeneratorService $questService)
    {
        $user = Auth::user();
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
            ->where(function($q) use ($user) {
                $q->whereNull('class')->orWhere('class', $user->class);
            })
            ->get()
            ->map(function($q) use ($todayCompletions) {
                $completion = $todayCompletions->get($q->id);
                $q->completed = $completion !== null;
                $q->submission_status = $completion?->status ?? null;
                $q->rejection_reason = $completion?->rejection_reason ?? null;
                return $q;
            });

        // Additional quests
        $additionalQuests = Quest::where('type', 'additional')
            ->where('is_active', true)
            ->get()
            ->map(function($q) use ($todayCompletions) {
                $completion = $todayCompletions->get($q->id);
                $q->completed = $completion !== null && $completion->status === 'approved';
                $q->submission_status = $completion?->status ?? null;
                $q->rejection_reason = $completion?->rejection_reason ?? null;
                return $q;
            });

        return Inertia::render('Student/Quests', [
            'mainQuests' => $mainQuests,
            'additionalQuests' => $additionalQuests,
        ]);
    }

    public function complete(Request $request, Quest $quest)
    {
        $user = Auth::user();
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
            return back()->with('error', 'Quest sudah disubmit atau diselesaikan hari ini.');
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
        }

        QuestCompletion::create([
            'user_id' => $user->id,
            'quest_id' => $quest->id,
            'completed_at' => now(),
            'exp_earned' => $quest->exp_reward,
            'status' => 'pending',
            'proof_text' => $request->proof_text,
            'proof_image' => $proofImagePath,
        ]);

        return back()->with('success', 'Bukti pengerjaan quest berhasil dikirim! Menunggu validasi admin.');
    }
}
