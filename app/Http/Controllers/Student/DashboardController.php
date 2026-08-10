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

        $recentQuests = Quest::where(function($query) use ($today) {
                $query->where(function($q) use ($today) {
                    $q->where('type', 'main')->where('available_date', $today->toDateString());
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
            'rank' => ExpService::getRankName($user->level),
            'streak' => $user->streak_days,
            'questsCompleted' => $user->questCompletions()->count(),
            'nextLevelExp' => pow($user->level, 2) * 100,
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
