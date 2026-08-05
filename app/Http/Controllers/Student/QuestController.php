<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Quest;
use App\Models\QuestCompletion;
use App\Services\ExpService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class QuestController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $today = Carbon::today();

        $completedQuestIds = $user->questCompletions()
            ->whereDate('completed_at', $today)
            ->pluck('quest_id')
            ->toArray();

        // Main quests (Daily)
        $mainQuests = Quest::where('type', 'main')
            ->where('available_date', $today->toDateString())
            ->get()
            ->map(function($q) use ($completedQuestIds) {
                $q->completed = in_array($q->id, $completedQuestIds);
                return $q;
            });

        // Additional quests
        $additionalQuests = Quest::where('type', 'additional')
            ->where('is_active', true)
            ->get()
            ->map(function($q) use ($completedQuestIds) {
                $q->completed = in_array($q->id, $completedQuestIds);
                return $q;
            });

        return Inertia::render('Student/Quests', [
            'mainQuests' => $mainQuests,
            'additionalQuests' => $additionalQuests,
        ]);
    }

    public function complete(Quest $quest, ExpService $expService)
    {
        $user = Auth::user();
        $today = Carbon::today();

        // Check if already completed today
        $alreadyCompleted = QuestCompletion::where('user_id', $user->id)
            ->where('quest_id', $quest->id)
            ->whereDate('completed_at', $today)
            ->exists();

        if ($alreadyCompleted) {
            return back()->with('error', 'Quest sudah diselesaikan hari ini.');
        }

        $oldLevel = $user->level;

        QuestCompletion::create([
            'user_id' => $user->id,
            'quest_id' => $quest->id,
            'completed_at' => now(),
            'exp_earned' => $quest->exp_reward,
        ]);

        $expService->addExp($user, $quest->exp_reward);

        $user->refresh();
        $newLevel = $user->level;

        $flashData = [
            'success' => "Quest Selesai! +{$quest->exp_reward} EXP",
            'exp_gained' => $quest->exp_reward,
        ];

        if ($newLevel > $oldLevel) {
            $flashData['level_up'] = true;
            $flashData['new_level'] = $newLevel;
        }

        return back()->with($flashData);
    }
}
