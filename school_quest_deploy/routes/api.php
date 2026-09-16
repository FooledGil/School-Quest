<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Student\DashboardApiController;
use App\Http\Controllers\Api\Student\QuestApiController;
use App\Http\Controllers\Api\Student\LeaderboardApiController;
use App\Http\Controllers\Api\Student\CommunityApiController;
use App\Http\Controllers\Api\Student\ProfileApiController;
use App\Http\Controllers\Api\Admin\AdminDashboardApiController;
use App\Http\Controllers\Api\Admin\QuestValidationApiController;
use App\Http\Controllers\Api\Admin\AdminQuestApiController;
use App\Http\Controllers\Api\Admin\AdminCommunityApiController;
use App\Http\Controllers\Api\Admin\AdminStudentApiController;

/*
|--------------------------------------------------------------------------
| API Routes for SchoolQuest Flutter Mobile & Cross-Platform Client
|--------------------------------------------------------------------------
*/

// Public Authentication
Route::post('/auth/login', [AuthController::class, 'login']);

// Authenticated Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Student Routes
    Route::middleware('student')->prefix('student')->name('api.student.')->group(function () {
        Route::get('/dashboard', [DashboardApiController::class, 'index']);
        
        Route::get('/quests', [QuestApiController::class, 'index']);
        Route::post('/quests/{quest}/complete', [QuestApiController::class, 'complete']);
        
        Route::get('/leaderboard', [LeaderboardApiController::class, 'index']);
        
        // The Realm Community Forum
        Route::get('/community', [CommunityApiController::class, 'index']);
        Route::get('/community/{thread}', [CommunityApiController::class, 'show']);
        Route::post('/community', [CommunityApiController::class, 'store']);
        Route::post('/community/{thread}/reply', [CommunityApiController::class, 'storeReply']);
        Route::post('/community/like', [CommunityApiController::class, 'toggleLike']);
        Route::post('/community/report', [CommunityApiController::class, 'report']);
        Route::delete('/community/{thread}', [CommunityApiController::class, 'destroy']);
        Route::delete('/community/reply/{reply}', [CommunityApiController::class, 'destroyReply']);
        
        // Profile & Customization
        Route::get('/profile', [ProfileApiController::class, 'index']);
        Route::post('/profile/avatar', [ProfileApiController::class, 'updateAvatar']);
        Route::post('/profile/avatar/upload', [ProfileApiController::class, 'uploadAvatar']);
        Route::post('/profile/avatar/reset', [ProfileApiController::class, 'resetAvatar']);
        Route::post('/profile/password', [ProfileApiController::class, 'updatePassword']);
        Route::post('/onboarding/complete', [ProfileApiController::class, 'completeOnboarding']);
        Route::post('/sanctions/{sanction}/acknowledge', [ProfileApiController::class, 'acknowledgeSanction']);
    });

    // Admin & Teacher Routes
    Route::middleware('admin')->prefix('admin')->name('api.admin.')->group(function () {
        Route::get('/dashboard', [AdminDashboardApiController::class, 'index']);
        
        Route::get('/validations', [QuestValidationApiController::class, 'index']);
        Route::post('/validations/{completion}/approve', [QuestValidationApiController::class, 'approve']);
        Route::post('/validations/{completion}/reject', [QuestValidationApiController::class, 'reject']);
        
        Route::get('/quests', [AdminQuestApiController::class, 'index']);
        Route::post('/quests', [AdminQuestApiController::class, 'store']);
        Route::put('/quests/{quest}', [AdminQuestApiController::class, 'update']);
        Route::delete('/quests/{quest}', [AdminQuestApiController::class, 'destroy']);
        
        Route::get('/community', [AdminCommunityApiController::class, 'index']);
        Route::post('/community/report/{report}/resolve', [AdminCommunityApiController::class, 'resolveReport']);
        Route::post('/community/thread/{thread}/pin', [AdminCommunityApiController::class, 'togglePin']);
        Route::post('/community/thread/{thread}/lock', [AdminCommunityApiController::class, 'toggleLock']);
        Route::delete('/community/thread/{thread}', [AdminCommunityApiController::class, 'destroyThread']);
        Route::delete('/community/reply/{reply}', [AdminCommunityApiController::class, 'destroyReply']);
        Route::post('/students/{user}/punish', [AdminCommunityApiController::class, 'punishStudent']);
        Route::post('/students/{user}/unmute', [AdminCommunityApiController::class, 'unmuteStudent']);
        
        Route::get('/students', [AdminStudentApiController::class, 'index']);
        Route::get('/students/{student}', [AdminStudentApiController::class, 'show']);
    });
});
