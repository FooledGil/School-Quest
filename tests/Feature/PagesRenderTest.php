<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PagesRenderTest extends TestCase
{
    use RefreshDatabase;
    public function test_login_page_renders_successfully(): void
    {
        $response = $this->get('/login');
        $response->assertStatus(200);
    }

    public function test_student_pages_render_successfully(): void
    {
        $student = User::where('role', 'student')->first();
        if (!$student) {
            $student = User::create([
                'name' => 'Student Test',
                'nisn' => '1234567890',
                'password' => bcrypt('password'),
                'role' => 'student',
                'level' => 1,
                'exp' => 0,
                'streak_days' => 1,
            ]);
        }

        $this->actingAs($student);

        $this->get('/dashboard')->assertStatus(200);
        $this->get('/quests')->assertStatus(200);
        $this->get('/leaderboard')->assertStatus(200);
        $this->get('/profile')->assertStatus(200);
    }

    public function test_xii_rpl_schedule_and_quest_generation(): void
    {
        $this->seed(\Database\Seeders\DatabaseSeeder::class);

        $rplStudent = User::where('class', 'XII RPL')->first();
        $this->assertNotNull($rplStudent);

        $this->actingAs($rplStudent);

        $response = $this->get('/dashboard');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Student/Dashboard', false)
            ->has('schedules')
            ->has('recentQuests')
        );

        $questResponse = $this->get('/quests');
        $questResponse->assertStatus(200);
        $questResponse->assertInertia(fn ($page) => $page
            ->component('Student/Quests', false)
            ->has('mainQuests')
            ->has('additionalQuests')
        );
    }
}
