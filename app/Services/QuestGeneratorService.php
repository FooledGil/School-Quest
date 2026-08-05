<?php

namespace App\Services;

use App\Models\User;
use App\Models\Quest;
use App\Models\Schedule;
use App\Models\PiketSchedule;
use Carbon\Carbon;

class QuestGeneratorService
{
    public function generateForUser(User $user)
    {
        if ($user->role !== 'student' || !$user->class) {
            return;
        }

        $today = Carbon::today();
        $dayOfWeek = $today->dayOfWeekIso; // 1 (Mon) - 7 (Sun)
        
        if ($dayOfWeek > 5) return; // Only Mon-Fri

        // 1. Generate Subject Quests
        $schedules = Schedule::where('class', $user->class)
            ->where('day_of_week', $dayOfWeek)
            ->with('subject')
            ->get();

        foreach ($schedules as $schedule) {
            $title = "Selesaikan Tugas " . $schedule->subject->name;
            Quest::firstOrCreate(
                [
                    'title' => $title,
                    'is_daily' => true,
                    'available_date' => $today->toDateString(),
                    'category' => 'subject',
                ],
                [
                    'description' => "Ikuti pelajaran {$schedule->subject->name} dan selesaikan tugas yang diberikan.",
                    'type' => 'main',
                    'exp_reward' => 50,
                    'difficulty' => 'easy',
                    'icon' => $schedule->subject->icon,
                ]
            );
        }

        // 2. Generate Piket Quests
        $isPiket = $user->piketMemberships()
            ->whereHas('piketSchedule', function($q) use ($dayOfWeek) {
                $q->where('day_of_week', $dayOfWeek);
            })->exists();

        if ($isPiket) {
            Quest::firstOrCreate(
                [
                    'title' => "Tugas Piket Kelas",
                    'is_daily' => true,
                    'available_date' => $today->toDateString(),
                    'category' => 'piket',
                ],
                [
                    'description' => "Laksanakan tugas piket kebersihan kelas hari ini.",
                    'type' => 'main',
                    'exp_reward' => 80,
                    'difficulty' => 'medium',
                    'icon' => '🧹',
                ]
            );
        }
    }
}
