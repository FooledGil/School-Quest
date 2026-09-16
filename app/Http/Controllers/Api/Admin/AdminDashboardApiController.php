<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Quest;
use App\Models\QuestCompletion;
use App\Models\User;
use App\Services\ExpService;
use Carbon\Carbon;
use Illuminate\Http\Request;

class AdminDashboardApiController extends Controller
{
    public function index()
    {
        $today = Carbon::today();

        $stats = [
            'total_students' => User::where('role', 'student')->count(),
            'total_quests' => Quest::where('is_active', true)->count(),
            'completions_today' => QuestCompletion::whereDate('completed_at', $today)->count(),
            'pending_validations' => QuestCompletion::where('status', 'pending')->count(),
            'avg_level' => round(User::where('role', 'student')->avg('level') ?: 1, 1),
        ];

        $topPerformers = User::where('role', 'student')
            ->orderByDesc('exp')
            ->take(5)
            ->get()
            ->map(function ($student) {
                return [
                    'id' => $student->id,
                    'name' => $student->name,
                    'class' => $student->class,
                    'level' => $student->level ?: 1,
                    'exp' => $student->exp ?: 0,
                    'rank_name' => ExpService::getRankName($student->level ?: 1),
                    'avatar' => $student->avatar,
                    'avatar_seed' => $student->avatar_seed,
                ];
            });

        $recentCompletions = QuestCompletion::with(['user', 'quest'])
            ->latest('completed_at')
            ->take(5)
            ->get()
            ->map(function ($c) {
                return [
                    'id' => $c->id,
                    'student_name' => $c->user?->name,
                    'quest_title' => $c->quest?->title,
                    'exp_earned' => $c->exp_earned,
                    'status' => $c->status,
                    'completed_at_human' => $c->completed_at?->diffForHumans(),
                ];
            });

        return response()->json([
            'status' => 'success',
            'data' => [
                'stats' => $stats,
                'top_performers' => $topPerformers,
                'recent_completions' => $recentCompletions,
            ],
        ]);
    }
}
