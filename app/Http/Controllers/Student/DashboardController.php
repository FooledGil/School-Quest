<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
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

        $stats = [
            'exp' => $user->exp,
            'level' => $user->level,
            'rank' => ExpService::getRankName($user->level),
            'streak' => $user->streak_days,
            'nextLevelExp' => pow($user->level, 2) * 100,
        ];

        return Inertia::render('Student/Dashboard', [
            'user' => $user,
            'schedules' => $schedules,
            'stats' => $stats,
        ]);
    }
}
