<?php

namespace App\Console\Commands;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ResetWeeklyLeaderboard extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'schoolquest:reset-weekly {--force : Force reset even if already reset this week}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Reset weekly EXP for all students every 7 days (Monday 00:00 WIB)';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $startOfWeek = Carbon::now()->startOfWeek();

        // 1. Snapshot / Log top 3 weekly champions before reset
        $topThree = User::where('role', 'student')
            ->where('weekly_exp', '>', 0)
            ->orderByDesc('weekly_exp')
            ->take(3)
            ->get();

        if ($topThree->isNotEmpty()) {
            $this->info("🏆 Juara Mingguan Pekan Lalu:");
            foreach ($topThree as $index => $hero) {
                $rank = $index + 1;
                $this->line("   #{$rank} {$hero->name} ({$hero->class}) - {$hero->weekly_exp} EXP");
            }

            Log::info("SchoolQuest: Weekly Leaderboard Reset completed. Top heroes:", [
                'week' => Carbon::now()->subWeek()->weekOfYear,
                'year' => Carbon::now()->year,
                'champions' => $topThree->map(fn($u) => ['id' => $u->id, 'name' => $u->name, 'weekly_exp' => $u->weekly_exp])->toArray(),
            ]);
        }

        // 2. Perform reset
        $query = User::where('role', 'student');
        if (!$this->option('force')) {
            $query->where(function ($q) use ($startOfWeek) {
                $q->whereNull('weekly_reset_at')
                  ->orWhere('weekly_reset_at', '<', $startOfWeek);
            });
        }

        $affectedCount = $query->update([
            'weekly_exp' => 0,
            'weekly_reset_at' => $startOfWeek,
        ]);

        $this->info("✨ Berhasil mereset leaderboard mingguan untuk {$affectedCount} siswa. Siklus baru dimulai!");

        return Command::SUCCESS;
    }
}
