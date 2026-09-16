<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\ExpService;
use Inertia\Inertia;

class AdminStudentController extends Controller
{
    public function index()
    {
        $students = User::where('role', 'student')->get()->map(function($s) {
            $s->rank_name = ExpService::getRankName($s->level);
            return $s;
        });

        return Inertia::render('Admin/Students/Index', [
            'students' => $students
        ]);
    }

    public function show(User $student)
    {
        if ($student->role !== 'student') abort(404);

        $student->load(['achievements.achievement', 'questCompletions' => function($q) {
            $q->latest('completed_at')->with('quest');
        }]);
        $student->rank_name = ExpService::getRankName($student->level);

        return Inertia::render('Admin/Students/Show', [
            'student' => $student
        ]);
    }
}
