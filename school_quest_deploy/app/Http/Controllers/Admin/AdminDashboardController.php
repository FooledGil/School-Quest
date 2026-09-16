<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Quest;
use App\Models\QuestCompletion;
use Carbon\Carbon;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today();

        $stats = [
            'total_students' => User::where('role', 'student')->count(),
            'total_quests' => Quest::where('is_active', true)->count(),
            'completions_today' => QuestCompletion::whereDate('completed_at', $today)->count(),
            'avg_level' => round(User::where('role', 'student')->avg('level') ?: 1, 1),
        ];

        $topPerformers = User::where('role', 'student')
            ->orderByDesc('exp')
            ->take(5)
            ->get();

        $recentCompletions = QuestCompletion::with(['user', 'quest'])
            ->latest('completed_at')
            ->take(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'topPerformers' => $topPerformers,
            'recentCompletions' => $recentCompletions,
        ]);
    }
}
