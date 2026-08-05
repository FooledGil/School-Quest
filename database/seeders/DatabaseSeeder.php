<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Subject;
use App\Models\Schedule;
use App\Models\PiketSchedule;
use App\Models\PiketMember;
use App\Models\Quest;
use App\Models\Achievement;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $password = Hash::make('password');

        // ADMINS
        User::create(['name' => 'Admin Sekolah', 'email' => 'admin@schoolquest.id', 'password' => Hash::make('admin123'), 'role' => 'admin']);
        User::create(['name' => 'Guru Piket', 'email' => 'guru@schoolquest.id', 'password' => Hash::make('guru123'), 'role' => 'admin']);

        // STUDENTS
        $students = [
            ['nisn' => '0012345001', 'name' => 'Andi Pratama', 'class' => 'X-A', 'exp' => 0],
            ['nisn' => '0012345002', 'name' => 'Budi Santoso', 'class' => 'X-A', 'exp' => 150],
            ['nisn' => '0012345003', 'name' => 'Citra Dewi', 'class' => 'X-A', 'exp' => 450],
            ['nisn' => '0012345004', 'name' => 'Dina Safitri', 'class' => 'X-B', 'exp' => 800],
            ['nisn' => '0012345005', 'name' => 'Eko Wijaya', 'class' => 'X-B', 'exp' => 1200],
            ['nisn' => '0012345006', 'name' => 'Fani Rahayu', 'class' => 'X-B', 'exp' => 300],
            ['nisn' => '0012345007', 'name' => 'Galih Putra', 'class' => 'X-A', 'exp' => 20],
            ['nisn' => '0012345008', 'name' => 'Hana Permata', 'class' => 'X-B', 'exp' => 500],
            ['nisn' => '0012345009', 'name' => 'Irfan Maulana', 'class' => 'X-A', 'exp' => 950],
            ['nisn' => '0012345010', 'name' => 'Jasmine Putri', 'class' => 'X-B', 'exp' => 100],
        ];

        $studentModels = [];
        foreach ($students as $s) {
            $studentModels[] = User::create([
                'nisn' => $s['nisn'],
                'name' => $s['name'],
                'password' => $password,
                'role' => 'student',
                'class' => $s['class'],
                'exp' => $s['exp'],
                'level' => floor(sqrt($s['exp'] / 100)) + 1,
            ]);
        }

        // SUBJECTS
        $subjectsData = [
            ['name' => 'Matematika', 'code' => 'MAT', 'icon' => '📐', 'color' => '#ef4444'],
            ['name' => 'B.Indonesia', 'code' => 'BIN', 'icon' => '📖', 'color' => '#3b82f6'],
            ['name' => 'IPA', 'code' => 'IPA', 'icon' => '🔬', 'color' => '#10b981'],
            ['name' => 'B.Inggris', 'code' => 'ENG', 'icon' => '💬', 'color' => '#8b5cf6'],
            ['name' => 'IPS', 'code' => 'IPS', 'icon' => '🌍', 'color' => '#f59e0b'],
            ['name' => 'Seni Budaya', 'code' => 'SBD', 'icon' => '🎨', 'color' => '#ec4899'],
            ['name' => 'PPKN', 'code' => 'PKN', 'icon' => '🤝', 'color' => '#14b8a6'],
            ['name' => 'Penjaskes', 'code' => 'PJK', 'icon' => '⚽', 'color' => '#f97316'],
            ['name' => 'Agama', 'code' => 'AGM', 'icon' => '🕌', 'color' => '#06b6d4'],
            ['name' => 'Prakarya', 'code' => 'PRK', 'icon' => '✂️', 'color' => '#64748b'],
        ];

        $subjects = [];
        foreach ($subjectsData as $sd) {
            $subjects[$sd['name']] = Subject::create($sd);
        }

        // SCHEDULES
        $classes = ['X-A', 'X-B'];
        $scheduleData = [
            1 => [ // Senin
                ['sub' => 'Matematika', 'start' => '07:30:00', 'end' => '09:00:00'],
                ['sub' => 'B.Indonesia', 'start' => '09:15:00', 'end' => '10:45:00'],
                ['sub' => 'IPA', 'start' => '11:00:00', 'end' => '12:30:00'],
            ],
            2 => [ // Selasa
                ['sub' => 'B.Inggris', 'start' => '07:30:00', 'end' => '09:00:00'],
                ['sub' => 'IPS', 'start' => '09:15:00', 'end' => '10:45:00'],
                ['sub' => 'Seni Budaya', 'start' => '11:00:00', 'end' => '12:30:00'],
            ],
            3 => [ // Rabu
                ['sub' => 'Matematika', 'start' => '07:30:00', 'end' => '09:00:00'],
                ['sub' => 'PPKN', 'start' => '09:15:00', 'end' => '10:45:00'],
                ['sub' => 'Penjaskes', 'start' => '11:00:00', 'end' => '12:30:00'],
            ],
            4 => [ // Kamis
                ['sub' => 'B.Indonesia', 'start' => '07:30:00', 'end' => '09:00:00'],
                ['sub' => 'IPA', 'start' => '09:15:00', 'end' => '10:45:00'],
                ['sub' => 'B.Inggris', 'start' => '11:00:00', 'end' => '12:30:00'],
            ],
            5 => [ // Jumat
                ['sub' => 'Agama', 'start' => '07:30:00', 'end' => '09:00:00'],
                ['sub' => 'Prakarya', 'start' => '09:15:00', 'end' => '10:45:00'],
            ],
        ];

        foreach ($classes as $c) {
            foreach ($scheduleData as $day => $lessons) {
                foreach ($lessons as $l) {
                    Schedule::create([
                        'day_of_week' => $day,
                        'subject_id' => $subjects[$l['sub']]->id,
                        'class' => $c,
                        'time_start' => $l['start'],
                        'time_end' => $l['end'],
                    ]);
                }
            }
        }

        // PIKET SCHEDULES
        $piketData = [
            1 => ['X-A' => 'Kelompok A', 'X-B' => 'Kelompok E'],
            2 => ['X-A' => 'Kelompok B', 'X-B' => 'Kelompok F'],
            3 => ['X-A' => 'Kelompok C', 'X-B' => 'Kelompok G'],
            4 => ['X-A' => 'Kelompok D', 'X-B' => 'Kelompok H'],
            5 => ['X-A' => 'Kelompok A', 'X-B' => 'Kelompok E'],
        ];

        foreach ($piketData as $day => $groups) {
            foreach ($groups as $class => $group) {
                $ps = PiketSchedule::create([
                    'day_of_week' => $day,
                    'class' => $class,
                    'group_name' => $group,
                ]);

                // Assign random student from that class
                $st = collect($studentModels)->where('class', $class)->random();
                PiketMember::create([
                    'piket_schedule_id' => $ps->id,
                    'user_id' => $st->id,
                ]);
            }
        }

        // ADDITIONAL QUESTS
        $quests = [
            ['Bersihkan Lapangan Sekolah', 'medium', 80, 'piket', '🧹'],
            ['Bersosialisasi dengan 3 Orang Baru', 'easy', 40, 'social', '👥'],
            ['Bantu Guru Membawa Buku ke Perpustakaan', 'easy', 35, 'social', '📚'],
            ['Ikut Kegiatan Ekstrakurikuler', 'medium', 70, 'activity', '🏃'],
            ['Rapikan Rak Buku Perpustakaan', 'easy', 45, 'piket', '📚'],
            ['Menjadi Mentor Teman Sebaya', 'hard', 150, 'social', '👨‍🏫'],
            ['Buat Poster Motivasi untuk Kelas', 'medium', 60, 'creative', '🎨'],
            ['Organisir Kegiatan Kebersihan Lingkungan', 'hard', 120, 'piket', '🌱'],
        ];

        foreach ($quests as $q) {
            Quest::create([
                'title' => $q[0],
                'description' => 'Deskripsi untuk quest ' . $q[0],
                'type' => 'additional',
                'category' => $q[3],
                'exp_reward' => $q[2],
                'difficulty' => $q[1],
                'icon' => $q[4],
                'is_active' => true,
            ]);
        }

        // ACHIEVEMENTS
        $achievements = [
            ['First Quest', 'Selesaikan 1 quest', '🎯', 'total_quests', 1, 50],
            ['Speed Runner', 'Selesaikan 5 quest dalam 1 hari', '⚡', 'daily_quests', 5, 100],
            ['On Fire', '7 hari streak beruntun', '🔥', 'streak', 7, 150],
            ['Quest Master', 'Selesaikan total 50 quest', '👑', 'total_quests', 50, 200],
            ['Subject Expert', 'Selesaikan semua main quest dalam seminggu', '🧠', 'subject_expert', 1, 250],
            ['Cleaning Hero', 'Selesaikan 10 quest piket', '✨', 'category_piket', 10, 100],
            ['Social Butterfly', 'Selesaikan 5 quest sosial', '🦋', 'category_social', 5, 100],
            ['Legendary', 'Capai level 10', '🌟', 'level', 10, 500],
        ];

        foreach ($achievements as $a) {
            Achievement::create([
                'name' => $a[0],
                'description' => $a[1],
                'icon' => $a[2],
                'requirement_type' => $a[3],
                'requirement_value' => $a[4],
                'exp_bonus' => $a[5],
            ]);
        }
    }
}
