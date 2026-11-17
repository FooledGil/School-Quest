<?php

namespace App\Services;

use App\Models\User;
use App\Models\Achievement;
use App\Models\UserAchievement;
use Carbon\Carbon;

class AchievementService
{
    /**
     * Check and unlock achievements for the user.
     *
     * @return array{achievements: array<int, array{id:int, name:string, description:string, exp_bonus:int}>, total_exp_bonus:int}
     */
    public function checkAchievements(User $user): array
    {
        $achievements = Achievement::all();
        $counts = $this->progressCounts($user);

        $unlocked = [];
        $totalBonus = 0;

        foreach ($achievements as $ach) {
            if ($user->achievements()->where('achievement_id', $ach->id)->exists()) {
                continue; // Already unlocked
            }

            if (!$this->meetsRequirement($ach, $counts, (int) ($user->level ?: 1), (int) ($user->streak_days ?: 0))) {
                continue;
            }

            UserAchievement::create([
                'user_id' => $user->id,
                'achievement_id' => $ach->id,
                'earned_at' => now(),
            ]);

            $bonus = (int) ($ach->exp_bonus ?: 0);
            $user->exp += $bonus;
            $user->save();

            $unlocked[] = [
                'id' => $ach->id,
                'name' => $ach->name,
                'description' => $ach->description,
                'exp_bonus' => $bonus,
            ];
            $totalBonus += $bonus;
        }

        return [
            'achievements' => $unlocked,
            'total_exp_bonus' => $totalBonus,
        ];
    }

    /**
     * Preview which achievements would unlock if the user completed one more quest.
     * Used only for UI estimates (no data is written).
     *
     * @return array{achievements: array<int, array{id:int, name:string, description:string, exp_bonus:int}>, total_exp_bonus:int}
     */
    public function previewUnlocks(User $user, ?string $questCategory = null, int $additionalExp = 0): array
    {
        $achievements = Achievement::all();
        $counts = $this->progressCounts($user);

        // Simulate the quest currently being previewed as already completed.
        $counts['total']++;
        $counts['daily']++;
        if ($questCategory === 'piket') {
            $counts['piket']++;
        }
        if ($questCategory === 'social') {
            $counts['social']++;
        }

        $simulatedLevel = ExpService::calculateLevel(($user->exp ?: 0) + max(0, $additionalExp));

        $unlocked = [];
        $totalBonus = 0;

        foreach ($achievements as $ach) {
            if ($user->achievements()->where('achievement_id', $ach->id)->exists()) {
                continue;
            }

            if (!$this->meetsRequirement($ach, $counts, $simulatedLevel, (int) ($user->streak_days ?: 0))) {
                continue;
            }

            $bonus = (int) ($ach->exp_bonus ?: 0);
            $unlocked[] = [
                'id' => $ach->id,
                'name' => $ach->name,
                'description' => $ach->description,
                'exp_bonus' => $bonus,
            ];
            $totalBonus += $bonus;
        }

        return [
            'achievements' => $unlocked,
            'total_exp_bonus' => $totalBonus,
        ];
    }

    /**
     * Current progress counters used by achievement requirements.
     *
     * @return array{total:int, daily:int, piket:int, social:int}
     */
    private function progressCounts(User $user): array
    {
        return [
            'total' => $user->questCompletions()->count(),
            'daily' => $user->questCompletions()->whereDate('completed_at', Carbon::today())->count(),
            'piket' => $user->questCompletions()->whereHas('quest', function ($q) {
                $q->where('category', 'piket');
            })->count(),
            'social' => $user->questCompletions()->whereHas('quest', function ($q) {
                $q->where('category', 'social');
            })->count(),
        ];
    }

    /**
     * Evaluate one achievement requirement against progress counters.
     */
    private function meetsRequirement(Achievement $ach, array $counts, int $level, int $streakDays): bool
    {
        return match ($ach->requirement_type) {
            'total_quests' => $counts['total'] >= $ach->requirement_value,
            'daily_quests' => $counts['daily'] >= $ach->requirement_value,
            'streak' => $streakDays >= $ach->requirement_value,
            'level' => $level >= $ach->requirement_value,
            'category_piket' => $counts['piket'] >= $ach->requirement_value,
            'category_social' => $counts['social'] >= $ach->requirement_value,
            // Mock logic for Subject Expert for simplicity
            'subject_expert' => $counts['total'] >= 10,
            default => false,
        };
    }
}
