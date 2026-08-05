<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\ExpService;
use Inertia\Inertia;

class LeaderboardController extends Controller
{
    public function index()
    {
        $students = User::where('role', 'student')
            ->orderByDesc('exp')
            ->take(20)
            ->get()
            ->map(function($student, $index) {
                $student->rank_number = $index + 1;
                $student->rank_name = ExpService::getRankName($student->level);
                return $student;
            });

        return Inertia::render('Student/Leaderboard', [
            'students' => $students
        ]);
    }
}
