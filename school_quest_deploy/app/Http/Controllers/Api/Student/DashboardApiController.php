<?php

namespace App\Http\Controllers\Api\Student;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use App\Models\Quest;
use App\Models\Schedule;
use App\Models\PiketSchedule;
use App\Services\ExpService;
use App\Services\QuestGeneratorService;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardApiController extends Controller
{
    public function index(Request $request, QuestGeneratorService $questService)
    {
        $user = $request->user();

        // Ensure daily quests are generated
        $questService->generateForUser($user);

        $today = Carbon::today();
        $todayDayIso = $today->dayOfWeekIso;

        // Maintain / update daily streak on dashboard access
        if (!$user->last_activity_date) {
            $user->streak_days = 1;
            $user->last_activity_date = $today;
            $user->save();
        } else {
            $lastActivity = Carbon::parse($user->last_activity_date)->startOfDay();
            if ($lastActivity->isYesterday()) {
                $user->streak_days = ($user->streak_days ?: 0) + 1;
                $user->last_activity_date = $today;
                $user->save();
            } elseif ($lastActivity->isBefore(Carbon::yesterday())) {
                $user->streak_days = 1;
                $user->last_activity_date = $today;
                $user->save();
            } elseif (($user->streak_days ?: 0) < 1) {
                $user->streak_days = 1;
                $user->last_activity_date = $today;
                $user->save();
            }
        }

        $dayNames = [
            1 => 'Senin',
            2 => 'Selasa',
            3 => 'Rabu',
            4 => 'Kamis',
            5 => 'Jumat',
            6 => 'Sabtu',
            7 => 'Minggu',
        ];

        // Allow query param ?day=1..5 for viewing other days' timetable
        $requestedDay = $request->query('day');
        $dayOfWeek = ($requestedDay && is_numeric($requestedDay) && $requestedDay >= 1 && $requestedDay <= 7)
            ? (int) $requestedDay
            : $todayDayIso;

        $userClass = $user->class ?: 'XII RPL';

        // Class schedule for requested / today
        $schedules = Schedule::with('subject')
            ->where('class', $userClass)
            ->where('day_of_week', $dayOfWeek)
            ->orderBy('time_start')
            ->get();

        // Piket schedule for requested / today
        $piketSchedule = PiketSchedule::with(['members.user' => function($q) {
                $q->select('id', 'name', 'avatar', 'avatar_seed', 'class');
            }])
            ->where('class', $userClass)
            ->where('day_of_week', $dayOfWeek)
            ->first();

        $completedQuestIds = $user->questCompletions()
            ->whereDate('completed_at', $today)
            ->pluck('quest_id')
            ->toArray();

        $recentQuests = Quest::where(function ($query) use ($today, $user) {
                $query->where(function ($q) use ($today, $user) {
                    $q->where('type', 'main')
                        ->where('available_date', $today->toDateString())
                        ->where(function ($sub) use ($user) {
                            $sub->whereNull('class')->orWhere('class', $user->class);
                        });
                })->orWhere(function ($q) {
                    $q->where('type', 'additional')->where('is_active', true);
                });
            })
            ->whereNotIn('id', $completedQuestIds)
            ->take(4)
            ->get();

        $catchUp = ExpService::getCatchUpMultiplier($user);
        $recentQuests->each(fn ($quest) => ExpService::attachRewardPreview($user, $quest, $catchUp));

        $allAchievements = Achievement::all();
        $userAchievementIds = $user->achievements()->pluck('achievement_id')->toArray();

        $achievements = $allAchievements->map(function ($ach) use ($userAchievementIds) {
            $ach->is_unlocked = in_array($ach->id, $userAchievementIds);
            return $ach;
        });

        $streakDays = max(1, (int) ($user->streak_days ?: 1));

        $stats = [
            'exp' => $user->exp ?: 0,
            'weekly_exp' => $user->weekly_exp ?: 0,
            'level' => $user->level ?: 1,
            'rank' => ExpService::getRankName($user->level ?: 1),
            'streak' => $streakDays,
            'streak_days' => $streakDays,
            'quests_completed' => $user->questCompletions()->count(),
            'next_level_exp' => $user->next_level_exp,
            'current_level_base_exp' => $user->current_level_base_exp,
            'exp_in_level' => $user->exp_in_level,
            'exp_needed_in_level' => $user->exp_needed_in_level,
            'exp_percentage' => $user->exp_percentage,
            'exp_remaining' => $user->exp_remaining,
        ];

        // Active sanction check
        $activeSanction = $user->sanctions()
            ->where('is_active', true)
            ->where('is_acknowledged', false)
            ->latest()
            ->first();

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
                    'level' => $user->level ?: 1,
                    'exp' => $user->exp ?: 0,
                    'weekly_exp' => $user->weekly_exp ?: 0,
                    'streak_days' => $streakDays,
                    'avatar' => $user->avatar,
                    'avatar_seed' => $user->avatar_seed,
                    'rank_name' => $stats['rank'],
                    'has_completed_onboarding' => (bool) $user->has_completed_onboarding,
                    'is_muted' => (bool) $user->is_muted,
                    'mute_remaining_human' => $user->mute_remaining_human,
                    'next_level_exp' => $user->next_level_exp,
                    'current_level_base_exp' => $user->current_level_base_exp,
                    'exp_in_level' => $user->exp_in_level,
                    'exp_needed_in_level' => $user->exp_needed_in_level,
                    'exp_percentage' => $user->exp_percentage,
                    'exp_remaining' => $user->exp_remaining,
                ],
                'stats' => $stats,
                'schedules' => $schedules,
                'schedule_meta' => [
                    'day_of_week' => $dayOfWeek,
                    'day_name' => $dayNames[$dayOfWeek] ?? 'Senin',
                    'today_day_of_week' => $todayDayIso,
                    'today_day_name' => $dayNames[$todayDayIso] ?? 'Senin',
                ],
                'piket' => $piketSchedule,
                'recent_quests' => $recentQuests,
                'exp_boost' => $catchUp,
                'achievements' => $achievements,
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
}
