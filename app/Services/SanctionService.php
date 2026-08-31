<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserSanction;
use Carbon\Carbon;

class SanctionService
{
    /**
     * Deduct EXP from a student, recalculate their level, and log sanction.
     */
    public function applyExpDeduction(User $user, int $expAmount, string $reason, User $admin): UserSanction
    {
        $expToDeduct = abs($expAmount);
        $oldExp = $user->exp ?: 0;
        $newExp = max(0, $oldExp - $expToDeduct);
        $user->exp = $newExp;
        $user->level = ExpService::calculateLevel($newExp);
        $user->save();

        return UserSanction::create([
            'user_id' => $user->id,
            'admin_id' => $admin->id,
            'type' => 'exp_deduction',
            'amount' => -$expToDeduct,
            'reason' => $reason,
            'is_active' => true,
            'is_acknowledged' => false,
        ]);
    }

    /**
     * Mute a student from posting in The Realm for specified duration in minutes.
     * Pass -1 for permanent mute.
     */
    public function applyMute(User $user, int $durationMinutes, string $reason, User $admin): UserSanction
    {
        $expiresAt = $durationMinutes > 0 
            ? Carbon::now()->addMinutes($durationMinutes) 
            : Carbon::now()->addYears(10); // Permanent

        $user->muted_until = $expiresAt;
        $user->save();

        return UserSanction::create([
            'user_id' => $user->id,
            'admin_id' => $admin->id,
            'type' => 'mute',
            'amount' => $durationMinutes,
            'reason' => $reason,
            'expires_at' => $expiresAt,
            'is_active' => true,
            'is_acknowledged' => false,
        ]);
    }

    /**
     * Reset student's consecutive day streak to 0.
     */
    public function applyStreakReset(User $user, string $reason, User $admin): UserSanction
    {
        $user->streak_days = 0;
        $user->save();

        return UserSanction::create([
            'user_id' => $user->id,
            'admin_id' => $admin->id,
            'type' => 'streak_reset',
            'amount' => 0,
            'reason' => $reason,
            'is_active' => true,
            'is_acknowledged' => false,
        ]);
    }

    /**
     * Issue an official reprimand / warning scroll to the student.
     */
    public function applyWarning(User $user, string $reason, User $admin): UserSanction
    {
        return UserSanction::create([
            'user_id' => $user->id,
            'admin_id' => $admin->id,
            'type' => 'warning',
            'amount' => null,
            'reason' => $reason,
            'is_active' => true,
            'is_acknowledged' => false,
        ]);
    }

    /**
     * Unmute a student before expiration.
     */
    public function unmute(User $user, User $admin): void
    {
        $user->muted_until = null;
        $user->save();

        // Deactivate active mute sanctions
        UserSanction::where('user_id', $user->id)
            ->where('type', 'mute')
            ->where('is_active', true)
            ->update(['is_active' => false]);
    }
}
