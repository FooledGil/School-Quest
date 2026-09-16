<?php

namespace App\Services;

use App\Models\User;
use App\Models\Achievement;
use App\Models\UserAchievement;
use Carbon\Carbon;

class AchievementService
{
    public function checkAchievements(User $user)
    {
        $achievements = Achievement::all();
        $completionsCount = $user->questCompletions()->count();
        $socialCompletions = $user->questCompletions()->whereHas('quest', function($q) {
            $q->where('category', 'social');
        })->count();
        $piketCompletions = $user->questCompletions()->whereHas('quest', function($q) {
            $q->where('category', 'piket');
        })->count();
        $todayCompletions = $user->questCompletions()->whereDate('completed_at', Carbon::today())->count();

        foreach ($achievements as $ach) {
            if ($user->achievements()->where('achievement_id', $ach->id)->exists()) {
                continue; // Already unlocked
            }

            $unlocked = false;

            switch ($ach->requirement_type) {
                case 'total_quests':
                    $unlocked = $completionsCount >= $ach->requirement_value;
                    break;
                case 'daily_quests':
                    $unlocked = $todayCompletions >= $ach->requirement_value;
                    break;
                case 'streak':
                    $unlocked = $user->streak_days >= $ach->requirement_value;
                    break;
                case 'level':
                    $unlocked = $user->level >= $ach->requirement_value;
                    break;
                case 'category_piket':
                    $unlocked = $piketCompletions >= $ach->requirement_value;
                    break;
                case 'category_social':
                    $unlocked = $socialCompletions >= $ach->requirement_value;
                    break;
                // Add more cases as needed for specific logic (like Subject Expert)
                case 'subject_expert':
                    // Mock logic for Subject Expert for simplicity
                    $unlocked = $completionsCount >= 10; 
                    break;
            }

            if ($unlocked) {
                UserAchievement::create([
                    'user_id' => $user->id,
                    'achievement_id' => $ach->id,
                    'earned_at' => now(),
                ]);
                $user->exp += $ach->exp_bonus;
                $user->save();
            }
        }
    }
}
