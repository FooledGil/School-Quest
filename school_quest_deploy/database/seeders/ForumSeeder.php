<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\ForumThread;
use App\Models\ForumReply;
use App\Models\ForumLike;
use Illuminate\Database\Seeder;

class ForumSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first();
        $students = User::where('role', 'student')->take(10)->get();

        if ($students->count() === 0) return;

        $student1 = $students[0];
        $student2 = $students->count() > 1 ? $students[1] : $students[0];
        $student3 = $students->count() > 2 ? $students[2] : $students[0];
        $student4 = $students->count() > 3 ? $students[3] : $students[0];

        // 1. Pinned Welcome Thread by Admin
        $thread1 = ForumThread::create([
            'user_id' => $admin ? $admin->id : $student1->id,
            'category' => 'umum',
            'title' => '🏰 Selamat Datang di The Realm — Panduan Komunitas & Aturan Diskusi',
            'body' => "Halo semua petualang SchoolQuest!\n\nThe Realm adalah ruang publik bagi kita semua untuk saling bertukar strategi, menanyakan kendala quest pelajaran, membagikan pencapaian badge langka, atau memberikan saran pengembangan web.\n\nBeberapa pedoman dasar:\n1. Gunakan bahasa yang sopan dan saling mendukung sesama siswa.\n2. Pilih kategori yang tepat untuk postinganmu.\n3. Jangan ragu memberikan respon atau bantuan bagi rekan yang bertanya.\n\nSelamat bertualang dan semoga sukses mencapai level Immortal! ⚔️🛡️",
            'is_pinned' => true,
            'is_locked' => false,
            'views_count' => 142,
            'replies_count' => 3,
            'last_reply_at' => now()->subHours(2),
        ]);

        $reply1_1 = ForumReply::create([
            'forum_thread_id' => $thread1->id,
            'user_id' => $student1->id,
            'body' => 'Siap min! Keren banget fiturnya, jadi gampang diskusi bareng temen sekelas 🚀',
            'created_at' => now()->subHours(5),
        ]);

        $reply1_2 = ForumReply::create([
            'forum_thread_id' => $thread1->id,
            'user_id' => $student2->id,
            'body' => 'Mantap! Izin tanya min, apakah nanti ada fitur guild antar kelas?',
            'created_at' => now()->subHours(3),
        ]);

        // Nested reply to reply1_2
        ForumReply::create([
            'forum_thread_id' => $thread1->id,
            'user_id' => $admin ? $admin->id : $student3->id,
            'parent_id' => $reply1_2->id,
            'body' => 'Ide bagus! Fitur guild antar kelas saat ini sedang dalam pertimbangan pengembang.',
            'created_at' => now()->subHours(2),
        ]);

        // Likes for thread1
        ForumLike::create(['user_id' => $student1->id, 'likeable_type' => ForumThread::class, 'likeable_id' => $thread1->id]);
        ForumLike::create(['user_id' => $student2->id, 'likeable_type' => ForumThread::class, 'likeable_id' => $thread1->id]);
        ForumLike::create(['user_id' => $student3->id, 'likeable_type' => ForumThread::class, 'likeable_id' => $thread1->id]);

        // 2. Quest Tips Thread
        $thread2 = ForumThread::create([
            'user_id' => $student2->id,
            'category' => 'quest',
            'title' => '⚔️ Tips Cepat Selesaikan Quest Matematika & Dapatkan Bonus EXP!',
            'body' => "Halo teman-teman, mau share trik nih buat quest harian Matematika yang materinya rumus turunan & integral.\n\nBiasakan kerjakan sebelum jam 12 siang agar tidak menumpuk dengan jadwal piket kelas sore hari. Jangan lupa upload bukti foto catatan yang jelas agar validasi admin cepat di-approve!\n\nAda yang punya referensi materi kalkulus yang gampang dipahami?",
            'is_pinned' => false,
            'is_locked' => false,
            'views_count' => 68,
            'replies_count' => 2,
            'last_reply_at' => now()->subHours(1),
        ]);

        $reply2_1 = ForumReply::create([
            'forum_thread_id' => $thread2->id,
            'user_id' => $student3->id,
            'body' => 'Bisa tonton video rangkuman di YouTube channel Pak Guru atau baca modul bab 3 di perpustakaan sekolah, penjelasannya ringkas banget!',
            'created_at' => now()->subHours(1),
        ]);

        ForumLike::create(['user_id' => $student1->id, 'likeable_type' => ForumThread::class, 'likeable_id' => $thread2->id]);
        ForumLike::create(['user_id' => $student4->id, 'likeable_type' => ForumThread::class, 'likeable_id' => $thread2->id]);
        ForumLike::create(['user_id' => $student2->id, 'likeable_type' => ForumReply::class, 'likeable_id' => $reply2_1->id]);

        // 3. Showcase Thread
        $thread3 = ForumThread::create([
            'user_id' => $student3->id,
            'category' => 'showcase',
            'title' => '🏆 Akhirnya Berhasil Capai Level 5 (Champion) & Buka Avatar Mythic!',
            'body' => "Setelah streak harian 14 hari berturut-turut dan menyelesaikan 25 main quest, akhirnya karakterku berhasil naik ke Level 5! 🔥\n\nEXP bar sekarang butuh 3600 EXP buat ke Level 6. Siapa lagi di sini yang lagi push rank leaderboard kelas?",
            'is_pinned' => false,
            'is_locked' => false,
            'views_count' => 95,
            'replies_count' => 1,
            'last_reply_at' => now()->subMinutes(30),
        ]);

        ForumReply::create([
            'forum_thread_id' => $thread3->id,
            'user_id' => $student4->id,
            'body' => 'GG bro! Aku masih di Level 3 nih, lagi ngejar quest tambahan kejuruan.',
            'created_at' => now()->subMinutes(30),
        ]);

        ForumLike::create(['user_id' => $student1->id, 'likeable_type' => ForumThread::class, 'likeable_id' => $thread3->id]);
        ForumLike::create(['user_id' => $student2->id, 'likeable_type' => ForumThread::class, 'likeable_id' => $thread3->id]);

        // 4. Feature Suggestion Thread
        ForumThread::create([
            'user_id' => $student4->id,
            'category' => 'saran',
            'title' => '💡 Usulan: Tambahkan Mode Dark/Light Custom Palette & Sound Effects Game',
            'body' => "Bagaimana kalau di update berikutnya ditambahkan efek suara 8-bit retro saat user menyelesaikan quest atau saat menaikkan level? Bakal berasa main RPG klasik banget!",
            'is_pinned' => false,
            'is_locked' => false,
            'views_count' => 45,
            'replies_count' => 0,
            'last_reply_at' => null,
        ]);
    }
}
