<?php

namespace Tests\Feature;

use App\Models\User;
use App\Services\ExpService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WeeklyLeaderboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_leaderboard_provides_weekly_and_overall_data(): void
    {
        $student1 = User::create([
            'name' => 'Leader Student',
            'nisn' => '1000000001',
            'password' => bcrypt('password'),
            'role' => 'student',
            'level' => 3,
            'exp' => 500,
            'weekly_exp' => 200,
            'weekly_reset_at' => now(),
            'streak_days' => 3,
            'has_completed_onboarding' => true,
        ]);

        $student2 = User::create([
            'name' => 'Challenger Student',
            'nisn' => '1000000002',
            'password' => bcrypt('password'),
            'role' => 'student',
            'level' => 1,
            'exp' => 100,
            'weekly_exp' => 20,
            'weekly_reset_at' => now(),
            'streak_days' => 1,
            'has_completed_onboarding' => true,
        ]);

        $this->actingAs($student2);

        $response = $this->get('/leaderboard');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Student/Leaderboard', false)
            ->has('overallStudents')
            ->has('weeklyStudents')
            ->has('myRank')
            ->has('resetInfo')
            ->where('myRank.weekly_rank', 2)
            ->where('myRank.overall_rank', 2)
        );
    }

    public function test_weekly_reset_command(): void
    {
        $student = User::create([
            'name' => 'Active Student',
            'nisn' => '1000000003',
            'password' => bcrypt('password'),
            'role' => 'student',
            'level' => 2,
            'exp' => 300,
            'weekly_exp' => 150,
            'weekly_reset_at' => Carbon::now()->subWeeks(2), // expired cycle
            'streak_days' => 2,
            'has_completed_onboarding' => true,
        ]);

        $this->artisan('schoolquest:reset-weekly')
            ->assertSuccessful();

        $student->refresh();
        $this->assertEquals(0, $student->weekly_exp);
        $this->assertEquals(300, $student->exp); // Overall EXP preserved
    }

    public function test_challenger_surge_catchup_multiplier(): void
    {
        // Top student with high weekly EXP
        User::create([
            'name' => 'Top Hero',
            'nisn' => '1000000004',
            'password' => bcrypt('password'),
            'role' => 'student',
            'level' => 3,
            'exp' => 600,
            'weekly_exp' => 250,
            'weekly_reset_at' => now(),
            'streak_days' => 5,
            'has_completed_onboarding' => true,
        ]);

        // Trailing student
        $underdog = User::create([
            'name' => 'Underdog Student',
            'nisn' => '1000000005',
            'password' => bcrypt('password'),
            'role' => 'student',
            'level' => 1,
            'exp' => 50,
            'weekly_exp' => 10,
            'weekly_reset_at' => now(),
            'streak_days' => 1,
            'has_completed_onboarding' => true,
        ]);

        $expService = new ExpService();
        $multiplierInfo = ExpService::getCatchUpMultiplier($underdog);

        $this->assertTrue($multiplierInfo['has_boost']);
        $this->assertEquals(1.25, $multiplierInfo['multiplier']); // +25% bonus

        // Add 40 base EXP
        $result = $expService->addExp($underdog, 40);

        // Expected: 40 base + 10 bonus (25%) = 50 EXP gained
        $this->assertEquals(50, $result['exp_gained']);
        $this->assertEquals(10, $result['bonus_exp']);
        $underdog->refresh();
        $this->assertEquals(60, $underdog->weekly_exp); // 10 + 50
        $this->assertEquals(100, $underdog->exp); // 50 + 50
    }
}
