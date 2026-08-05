<?php

namespace App\Services;

use App\Models\User;
use Carbon\Carbon;

class ExpService
{
    public function addExp(User $user, int $expAmount)
    {
        $user->exp += $expAmount;
        $user->level = floor(sqrt($user->exp / 100)) + 1;
        
        $this->updateStreak($user);
        
        $user->save();
        
        // Let AchievementService check if new level unlocks anything
        app(AchievementService::class)->checkAchievements($user);
    }

    protected function updateStreak(User $user)
    {
        $today = Carbon::today();
        
        if (!$user->last_activity_date) {
            $user->streak_days = 1;
            $user->last_activity_date = $today;
            return;
        }

        $lastActivity = Carbon::parse($user->last_activity_date)->startOfDay();

        if ($lastActivity->isYesterday()) {
            $user->streak_days += 1;
            $user->last_activity_date = $today;
        } elseif ($lastActivity->isBefore(Carbon::yesterday())) {
            $user->streak_days = 1;
            $user->last_activity_date = $today;
        }
        // If it's today, do nothing to streak.
    }

    public static function getRankName(int $level): string
    {
        $ranks = [
            1 => 'Novice',
            2 => 'Apprentice',
            3 => 'Warrior',
            4 => 'Knight',
            5 => 'Champion',
            6 => 'Hero',
            7 => 'Legend',
            8 => 'Mythic',
            9 => 'Divine',
            10 => 'Immortal',
        ];

        if ($level > 10) return 'Immortal';
        if ($level < 1) return 'Novice';
        
        return $ranks[$level];
    }
}
