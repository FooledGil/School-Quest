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

        // 1. Generate Subject Quests for user's class
        $schedules = Schedule::where('class', $user->class)
            ->where('day_of_week', $dayOfWeek)
            ->with('subject')
            ->orderBy('time_start')
            ->get();

        // Unique by subject to prevent duplicate quests for multi-period subjects
        $uniqueSubjectSchedules = $schedules->unique('subject_id');

        foreach ($uniqueSubjectSchedules as $schedule) {
            $subject = $schedule->subject;
            if (!$subject) continue;

            $activityNames = ['Upacara Bendera', 'Apel Pagi', 'Apel Sore', 'ESKUL', 'Kokurikuler'];
            $isActivity = in_array($subject->name, $activityNames);

            if ($isActivity) {
                $title = "Kegiatan " . $subject->name;
                $description = "Ikuti kegiatan {$subject->name} hari ini dengan tertib dan disiplin.";
                $category = 'activity';
                $exp = 40;
                $difficulty = 'easy';
            } else {
                $title = "Selesaikan Tugas " . $subject->name;
                $teacherInfo = $schedule->teacher ? " bersama {$schedule->teacher}" : "";
                $description = "Ikuti pelajaran {$subject->name}{$teacherInfo} dan selesaikan tugas/praktikum yang diberikan.";
                $category = 'subject';
                $exp = in_array($subject->name, ['Konsentrasi Keahlian RPL', 'Mata Pelajaran Pilihan RPL']) ? 65 : 50;
                $difficulty = in_array($subject->name, ['Konsentrasi Keahlian RPL', 'Mata Pelajaran Pilihan RPL', 'Matematika']) ? 'medium' : 'easy';
            }

            Quest::firstOrCreate(
                [
                    'title' => $title,
                    'is_daily' => true,
                    'available_date' => $today->toDateString(),
                    'class' => $user->class,
                    'category' => $category,
                ],
                [
                    'description' => $description,
                    'type' => 'main',
                    'exp_reward' => $exp,
                    'difficulty' => $difficulty,
                    'icon' => $subject->icon ?? '📚',
                ]
            );
        }

        // 2. Generate Piket Quests
        $isPiket = $user->piketMemberships()
            ->whereHas('piketSchedule', function($q) use ($dayOfWeek, $user) {
                $q->where('day_of_week', $dayOfWeek)
                  ->where('class', $user->class);
            })->exists();

        if ($isPiket) {
            Quest::firstOrCreate(
                [
                    'title' => "Tugas Piket Kelas",
                    'is_daily' => true,
                    'available_date' => $today->toDateString(),
                    'class' => $user->class,
                    'category' => 'piket',
                ],
                [
                    'description' => "Laksanakan tugas piket kebersihan kelas {$user->class} hari ini.",
                    'type' => 'main',
                    'exp_reward' => 80,
                    'difficulty' => 'medium',
                    'icon' => '🧹',
                ]
            );
        }
    }
}
