<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\ExpService;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LeaderboardController extends Controller
{
    public function index()
    {
        // 1. Fail-safe lazy reset check: ensure any expired weekly cycles are reset
        ExpService::resetWeeklyAllStudents();

        $currentUser = Auth::user();
        if ($currentUser) {
            ExpService::ensureWeeklyCycle($currentUser);
        }

        // 2. Fetch Overall Leaderboard (Top 20)
        $overallStudents = User::where('role', 'student')
            ->orderByDesc('exp')
            ->orderBy('id')
            ->take(20)
            ->get()
            ->map(function ($student, $index) {
                return [
                    'id' => $student->id,
                    'name' => $student->name,
                    'class' => $student->class ?? 'Siswa',
                    'level' => $student->level ?: 1,
                    'exp' => $student->exp ?: 0,
                    'weekly_exp' => $student->weekly_exp ?: 0,
                    'avatar' => $student->avatar,
                    'avatar_seed' => $student->avatar_seed,
                    'rank_number' => $index + 1,
                    'rank_name' => ExpService::getRankName($student->level ?: 1),
                ];
            });

        // 3. Fetch Weekly Leaderboard (Top 20)
        $weeklyStudents = User::where('role', 'student')
            ->orderByDesc('weekly_exp')
            ->orderByDesc('exp')
            ->orderBy('id')
            ->take(20)
            ->get()
            ->map(function ($student, $index) {
                return [
                    'id' => $student->id,
                    'name' => $student->name,
                    'class' => $student->class ?? 'Siswa',
                    'level' => $student->level ?: 1,
                    'exp' => $student->exp ?: 0,
                    'weekly_exp' => $student->weekly_exp ?: 0,
                    'avatar' => $student->avatar,
                    'avatar_seed' => $student->avatar_seed,
                    'rank_number' => $index + 1,
                    'rank_name' => ExpService::getRankName($student->level ?: 1),
                ];
            });

        // 4. Calculate Current User's Specific Standing
        $myRank = null;
        if ($currentUser && $currentUser->role === 'student') {
            $userOverallRank = User::where('role', 'student')
                ->where('exp', '>', $currentUser->exp ?: 0)
                ->count() + 1;

            $userWeeklyRank = User::where('role', 'student')
                ->where('weekly_exp', '>', $currentUser->weekly_exp ?: 0)
                ->count() + 1;

            // Find student right above current user in weekly rankings for micro-goals
            $weeklyAhead = User::where('role', 'student')
                ->where('weekly_exp', '>', $currentUser->weekly_exp ?: 0)
                ->orderBy('weekly_exp', 'asc')
                ->first();

            $nextGap = $weeklyAhead ? max(1, ($weeklyAhead->weekly_exp - ($currentUser->weekly_exp ?: 0))) : 0;

            $catchUp = ExpService::getCatchUpMultiplier($currentUser);

            $myRank = [
                'id' => $currentUser->id,
                'name' => $currentUser->name,
                'class' => $currentUser->class ?? 'Siswa',
                'level' => $currentUser->level ?: 1,
                'exp' => $currentUser->exp ?: 0,
                'weekly_exp' => $currentUser->weekly_exp ?: 0,
                'overall_rank' => $userOverallRank,
                'weekly_rank' => $userWeeklyRank,
                'next_ahead_name' => $weeklyAhead ? $weeklyAhead->name : null,
                'next_ahead_gap' => $nextGap,
                'catch_up' => $catchUp,
            ];
        }

        // 5. Weekly Reset Metadata (7-day cycle: Monday 00:00 WIB)
        $now = Carbon::now();
        $nextReset = Carbon::now()->endOfWeek()->addSecond();
        $resetInfo = [
            'next_reset_at' => $nextReset->toIso8601String(),
            'formatted_schedule' => 'Setiap Senin, 00:00 WIB',
            'days_remaining' => (int) floor($now->diffInDays($nextReset)),
            'hours_remaining' => ((int) floor($now->diffInHours($nextReset))) % 24,
            'total_seconds_remaining' => (int) max(0, $now->diffInSeconds($nextReset)),
        ];

        return Inertia::render('Student/Leaderboard', [
            'students' => $overallStudents, // Backward compatibility
            'overallStudents' => $overallStudents,
            'weeklyStudents' => $weeklyStudents,
            'myRank' => $myRank,
            'resetInfo' => $resetInfo,
        ]);
    }
}
