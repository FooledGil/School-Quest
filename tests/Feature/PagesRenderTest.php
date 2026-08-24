<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
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
        $student = User::create([
            'name' => 'Student Test',
            'nisn' => '1234567890',
            'password' => bcrypt('password'),
            'role' => 'student',
            'level' => 1,
            'exp' => 0,
            'streak_days' => 1,
            'has_completed_onboarding' => false,
            'avatar_seed' => null,
        ]);

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

    public function test_first_time_student_onboarding_completion(): void
    {
        $student = User::create([
            'name' => 'New Student',
            'nisn' => '0099999999',
            'password' => Hash::make('password'),
            'role' => 'student',
            'has_completed_onboarding' => false,
            'avatar_seed' => null,
        ]);

        $this->actingAs($student);

        $this->assertFalse($student->has_completed_onboarding);

        $response = $this->post('/onboarding/complete');
        $response->assertStatus(302);

        $student->refresh();
        $this->assertTrue($student->has_completed_onboarding);
    }

    public function test_student_avatar_pixelbot_and_reset(): void
    {
        $student = User::create([
            'name' => 'Avatar Tester',
            'nisn' => '0088888888',
            'password' => Hash::make('password'),
            'role' => 'student',
            'avatar_seed' => null,
            'avatar' => null,
        ]);

        $this->actingAs($student);

        // Update to Pixel Bot seed
        $response = $this->post('/profile/avatar', [
            'avatar_seed' => 'CyberBot',
        ]);
        $response->assertStatus(302);

        $student->refresh();
        $this->assertEquals('CyberBot', $student->avatar_seed);
        $this->assertNull($student->avatar);

        // Reset to default silhouette
        $resetResponse = $this->post('/profile/avatar/reset');
        $resetResponse->assertStatus(302);

        $student->refresh();
        $this->assertNull($student->avatar_seed);
        $this->assertNull($student->avatar);
    }

    public function test_student_avatar_image_upload_to_storage(): void
    {
        Storage::fake('public');

        $student = User::create([
            'name' => 'Uploader',
            'nisn' => '0077777777',
            'password' => Hash::make('password'),
            'role' => 'student',
        ]);

        $this->actingAs($student);

        $file = UploadedFile::fake()->create('my-avatar.jpg', 100, 'image/jpeg');

        $response = $this->post('/profile/avatar/upload', [
            'avatar_file' => $file,
        ]);
        $response->assertStatus(302);

        $student->refresh();
        $this->assertNotNull($student->avatar);
        $this->assertStringStartsWith('/storage/avatars/', $student->avatar);
        $this->assertNull($student->avatar_seed);

        $savedPath = str_replace('/storage/', '', $student->avatar);
        Storage::disk('public')->assertExists($savedPath);
    }

    public function test_student_password_change(): void
    {
        $student = User::create([
            'name' => 'Password Tester',
            'nisn' => '0066666666',
            'password' => Hash::make('oldpassword123'),
            'role' => 'student',
        ]);

        $this->actingAs($student);

        $response = $this->post('/profile/password', [
            'current_password' => 'oldpassword123',
            'password' => 'newpassword456',
            'password_confirmation' => 'newpassword456',
        ]);
        $response->assertStatus(302);

        $student->refresh();
        $this->assertTrue(Hash::check('newpassword456', $student->password));
    }
}
