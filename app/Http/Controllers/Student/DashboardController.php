<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use App\Models\Quest;
use App\Models\QuestCompletion;
use App\Models\Achievement;
use App\Services\QuestGeneratorService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Services\ExpService;

class DashboardController extends Controller
{
    public function index(QuestGeneratorService $questService)
    {
        $user = Auth::user();
        
        // Ensure daily quests are generated
        $questService->generateForUser($user);

        $today = Carbon::today();
        $dayOfWeek = $today->dayOfWeekIso;

        $schedules = Schedule::with('subject')
            ->where('class', $user->class)
            ->where('day_of_week', $dayOfWeek)
            ->orderBy('time_start')
            ->get();

        $completedQuestIds = $user->questCompletions()
            ->whereDate('completed_at', $today)
            ->pluck('quest_id')
            ->toArray();

        $recentQuests = Quest::where(function($query) use ($today, $user) {
                $query->where(function($q) use ($today, $user) {
                    $q->where('type', 'main')
                      ->where('available_date', $today->toDateString())
                      ->where(function($sub) use ($user) {
                          $sub->whereNull('class')->orWhere('class', $user->class);
                      });
                })->orWhere(function($q) {
                    $q->where('type', 'additional')->where('is_active', true);
                });
            })
            ->whereNotIn('id', $completedQuestIds)
            ->take(4)
            ->get();

        $allAchievements = Achievement::all();
        $userAchievementIds = $user->achievements()->pluck('achievement_id')->toArray();

        $achievements = $allAchievements->map(function($ach) use ($userAchievementIds) {
            $ach->isUnlocked = in_array($ach->id, $userAchievementIds);
            return $ach;
        });

        $stats = [
            'exp' => $user->exp,
            'level' => $user->level,
            'rank' => $user->rank_name,
            'streak' => $user->streak_days,
            'questsCompleted' => $user->questCompletions()->count(),
            'nextLevelExp' => $user->next_level_exp,
            'currentLevelBaseExp' => $user->current_level_base_exp,
            'expInLevel' => $user->exp_in_level,
            'expNeededInLevel' => $user->exp_needed_in_level,
            'expPercentage' => $user->exp_percentage,
            'expRemaining' => $user->exp_remaining,
        ];

        return Inertia::render('Student/Dashboard', [
            'user' => $user,
            'schedules' => $schedules,
            'stats' => $stats,
            'recentQuests' => $recentQuests,
            'achievements' => $achievements,
        ]);
    }
}
