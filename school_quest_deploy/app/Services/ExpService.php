<?php

namespace App\Services;

use App\Models\User;
use Carbon\Carbon;

class ExpService
{
    /**
     * Calculate level from total accumulated EXP using scalable quadratic progression.
     * Curve: Total EXP required for Level L = 60 * (L - 1)^2 + 90 * (L - 1)
     */
    public static function calculateLevel(int $exp): int
    {
        if ($exp <= 0) {
            return 1;
        }

        // Solving 60*(L-1)^2 + 90*(L-1) - exp = 0
        $discriminant = 8100 + (240 * $exp);
        $levelMinusOne = floor((-90 + sqrt($discriminant)) / 120);

        return max(1, (int) $levelMinusOne + 1);
    }

    /**
     * Total cumulative EXP required to reach a specific level.
     */
    public static function getExpForLevel(int $level): int
    {
        if ($level <= 1) {
            return 0;
        }

        $l = $level - 1;
        return (int) (60 * ($l * $l) + 90 * $l);
    }

    /**
     * Total cumulative EXP required to reach the next level (level + 1).
     */
    public static function getNextLevelExp(int $level): int
    {
        return self::getExpForLevel($level + 1);
    }

    /**
     * Base cumulative EXP when the current level was reached.
     */
    public static function getCurrentLevelBaseExp(int $level): int
    {
        return self::getExpForLevel($level);
    }

    /**
     * Delta EXP needed between current level and next level.
     */
    public static function getExpRequiredForNextLevel(int $level): int
    {
        return self::getNextLevelExp($level) - self::getCurrentLevelBaseExp($level);
    }

    /**
     * EXP gained within the current level.
     */
    public static function getExpInCurrentLevel(int $exp, int $level): int
    {
        $base = self::getCurrentLevelBaseExp($level);
        return max(0, $exp - $base);
    }

    /**
     * Percentage progress within the current level (0.0 to 100.0).
     */
    public static function getLevelPercentage(int $exp, int $level): float
    {
        $base = self::getCurrentLevelBaseExp($level);
        $target = self::getNextLevelExp($level);
        $delta = max(1, $target - $base);
        $current = max(0, $exp - $base);

        return round(min(100.0, ($current / $delta) * 100), 1);
    }

    /**
     * Complete breakdown of user's level progression.
     */
    public static function getLevelProgress(int $exp, ?int $level = null): array
    {
        $lvl = $level ?: self::calculateLevel($exp);
        $baseExp = self::getCurrentLevelBaseExp($lvl);
        $targetExp = self::getNextLevelExp($lvl);
        $deltaNeeded = max(1, $targetExp - $baseExp);
        $expInLevel = max(0, $exp - $baseExp);
        $expRemaining = max(0, $targetExp - $exp);
        $percentage = round(min(100.0, ($expInLevel / $deltaNeeded) * 100), 1);

        return [
            'level' => $lvl,
            'rank_name' => self::getRankName($lvl),
            'total_exp' => $exp,
            'current_level_base_exp' => $baseExp,
            'next_level_exp' => $targetExp,
            'exp_in_level' => $expInLevel,
            'exp_needed_in_level' => $deltaNeeded,
            'exp_remaining' => $expRemaining,
            'percentage' => $percentage,
        ];
    }

    /**
     * Ensure the user's weekly EXP is reset if entering a new week.
     */
    public static function ensureWeeklyCycle(User $user): void
    {
        $startOfWeek = Carbon::now()->startOfWeek();

        if (!$user->weekly_reset_at || Carbon::parse($user->weekly_reset_at)->lt($startOfWeek)) {
            $user->weekly_exp = 0;
            $user->weekly_reset_at = $startOfWeek;
        }
    }

    /**
     * Reset weekly EXP for all students whose cycle has expired.
     */
    public static function resetWeeklyAllStudents(): int
    {
        $startOfWeek = Carbon::now()->startOfWeek();

        return User::where('role', 'student')
            ->where(function ($query) use ($startOfWeek) {
                $query->whereNull('weekly_reset_at')
                      ->orWhere('weekly_reset_at', '<', $startOfWeek);
            })
            ->update([
                'weekly_exp' => 0,
                'weekly_reset_at' => $startOfWeek,
            ]);
    }

    /**
     * Calculate Underdog / Challenger Surge catch-up multiplier for students trailing behind.
     * Prevents early-bird top students from completely dominating the leaderboard.
     */
    public static function getCatchUpMultiplier(User $user): array
    {
        self::ensureWeeklyCycle($user);

        // Fetch top 3 weekly scores among students
        $topThreeWeekly = User::where('role', 'student')
            ->where('id', '!=', $user->id)
            ->orderByDesc('weekly_exp')
            ->take(3)
            ->pluck('weekly_exp')
            ->toArray();

        $topThreshold = !empty($topThreeWeekly) ? end($topThreeWeekly) : 0;
        $userWeekly = $user->weekly_exp ?: 0;
        $gap = max(0, $topThreshold - $userWeekly);

        // Tier 1: Substantial gap from Top 3 (gap >= 100 EXP) -> +25% bonus
        if ($topThreshold >= 100 && $gap >= 100) {
            return [
                'has_boost' => true,
                'multiplier' => 1.25,
                'bonus_percentage' => 25,
                'title' => 'Challenger Surge',
                'reason' => 'Bonus +25% EXP aktif! Kejar ketertinggalan menuju Top 3!',
                'gap_to_top3' => $gap,
            ];
        }

        // Tier 2: Moderate gap (gap >= 50 EXP) -> +15% bonus
        if ($topThreshold >= 50 && $gap >= 50) {
            return [
                'has_boost' => true,
                'multiplier' => 1.15,
                'bonus_percentage' => 15,
                'title' => 'Underdog Boost',
                'reason' => 'Bonus +15% EXP aktif! Peluang mengejar peringkat atas!',
                'gap_to_top3' => $gap,
            ];
        }

        return [
            'has_boost' => false,
            'multiplier' => 1.0,
            'bonus_percentage' => 0,
            'title' => 'Normal',
            'reason' => 'Perolehan EXP standar.',
            'gap_to_top3' => $gap,
        ];
    }

    /**
     * Add EXP to a user, recalculate level, update weekly exp, streak, check achievements, and return status.
     */
    public function addExp(User $user, int $expAmount, bool $applyCatchUp = true): array
    {
        self::ensureWeeklyCycle($user);

        $catchUp = $applyCatchUp 
            ? self::getCatchUpMultiplier($user) 
            : ['has_boost' => false, 'multiplier' => 1.0, 'bonus_percentage' => 0];

        $bonusExp = $catchUp['has_boost'] 
            ? (int) round($expAmount * ($catchUp['multiplier'] - 1.0)) 
            : 0;
        $totalExpGained = $expAmount + $bonusExp;

        $oldLevel = $user->level ?: 1;
        $user->exp = max(0, ($user->exp ?: 0) + $totalExpGained);
        $user->weekly_exp = max(0, ($user->weekly_exp ?: 0) + $totalExpGained);
        $newLevel = self::calculateLevel($user->exp);
        $user->level = $newLevel;

        $this->updateStreak($user);
        $user->save();

        // Check if new level unlocks achievements
        app(AchievementService::class)->checkAchievements($user);

        // If achievements rewarded bonus EXP, refresh level once more
        $finalLevel = self::calculateLevel($user->exp);
        if ($finalLevel !== $user->level) {
            $user->level = $finalLevel;
            $user->save();
        }

        return [
            'level_up' => $finalLevel > $oldLevel,
            'old_level' => $oldLevel,
            'new_level' => $finalLevel,
            'exp_base' => $expAmount,
            'bonus_exp' => $bonusExp,
            'exp_gained' => $totalExpGained,
            'weekly_exp' => $user->weekly_exp,
            'catch_up' => $catchUp,
            'rank_name' => self::getRankName($finalLevel),
        ];
    }

    protected function updateStreak(User $user): void
    {
        $today = Carbon::today();

        if (!$user->last_activity_date) {
            $user->streak_days = 1;
            $user->last_activity_date = $today;
            return;
        }

        $lastActivity = Carbon::parse($user->last_activity_date)->startOfDay();

        if ($lastActivity->isYesterday()) {
            $user->streak_days = ($user->streak_days ?: 0) + 1;
            $user->last_activity_date = $today;
        } elseif ($lastActivity->isBefore(Carbon::yesterday())) {
            $user->streak_days = 1;
            $user->last_activity_date = $today;
        }
    }

    /**
     * Rich fantasy rank titles scaling from Level 1 up to Level 60+
     */
    public static function getRankName(int $level): string
    {
        if ($level <= 2) return 'Novice';
        if ($level <= 4) return 'Apprentice';
        if ($level <= 7) return 'Adept';
        if ($level <= 10) return 'Warrior';
        if ($level <= 14) return 'Knight';
        if ($level <= 19) return 'Champion';
        if ($level <= 24) return 'Hero';
        if ($level <= 29) return 'Vanguard';
        if ($level <= 34) return 'Master';
        if ($level <= 39) return 'Grandmaster';
        if ($level <= 44) return 'Legend';
        if ($level <= 49) return 'Mythic';
        if ($level <= 59) return 'Divine';

        return 'Immortal';
    }
}
