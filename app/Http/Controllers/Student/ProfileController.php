<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Services\ExpService;

class ProfileController extends Controller
{
    public function index()
    {
        $user = Auth::user()->load(['achievements.achievement', 'questCompletions' => function($q) {
            $q->latest('completed_at')->take(10)->with('quest');
        }]);

        $user->rank_name = ExpService::getRankName($user->level);
        $user->next_level_exp = pow($user->level, 2) * 100;

        return Inertia::render('Student/Profile', [
            'user' => $user
        ]);
    }
}
