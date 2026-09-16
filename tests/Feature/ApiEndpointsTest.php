<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Quest;
use App\Models\QuestCompletion;
use App\Models\ForumThread;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiEndpointsTest extends TestCase
{
    use RefreshDatabase;

    public function test_api_login_successful_with_email_and_nisn(): void
    {
        $student = User::where('role', 'student')->first();
        if (!$student) {
            $student = User::factory()->create([
                'role' => 'student',
                'password' => bcrypt('password123'),
                'nisn' => '9988776655',
                'class' => 'XII RPL 1',
            ]);
        } else {
            $student->update(['password' => bcrypt('password123')]);
        }

        // Test login with email
        $response = $this->postJson('/api/auth/login', [
            'login' => $student->email,
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'token',
                'user' => ['id', 'name', 'role', 'level', 'rank_name'],
            ]);

        // Test login with NISN
        if ($student->nisn) {
            $nisnResponse = $this->postJson('/api/auth/login', [
                'login' => $student->nisn,
                'password' => 'password123',
            ]);
            $nisnResponse->assertStatus(200);
        }
    }

    public function test_api_student_dashboard(): void
    {
        $student = User::where('role', 'student')->first();
        if (!$student) {
            $student = User::factory()->create(['role' => 'student', 'class' => 'XII RPL 1']);
        }

        $token = $student->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/student/dashboard');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'data' => [
                    'user',
                    'stats' => ['exp', 'level', 'rank', 'streak'],
                    'schedules',
                    'recent_quests',
                    'achievements',
                ]
            ]);
    }

    public function test_api_student_quests_and_leaderboard(): void
    {
        $student = User::where('role', 'student')->first() ?? User::factory()->create([
            'role' => 'student',
            'class' => 'XII RPL 1',
        ]);
        $token = $student->createToken('test-token')->plainTextToken;

        $questsRes = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/student/quests');
        $questsRes->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'data' => ['main_quests', 'additional_quests'],
            ]);

        $leaderboardRes = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/student/leaderboard');
        $leaderboardRes->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'data' => ['overall_students', 'weekly_students', 'my_rank', 'reset_info'],
            ]);
    }

    public function test_api_admin_dashboard_and_validations(): void
    {
        $admin = User::where('role', 'admin')->first();
        if (!$admin) {
            $admin = User::factory()->create(['role' => 'admin']);
        }

        $token = $admin->createToken('test-token')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/admin/dashboard');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'data' => ['stats', 'top_performers', 'recent_completions'],
            ]);

        $validationsRes = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/admin/validations');
        $validationsRes->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'data' => ['submissions', 'history'],
            ]);
    }
}
