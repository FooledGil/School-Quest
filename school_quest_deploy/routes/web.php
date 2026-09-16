<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Student\DashboardController;
use App\Http\Controllers\Student\QuestController;
use App\Http\Controllers\Student\LeaderboardController;
use App\Http\Controllers\Student\ProfileController;
use App\Http\Controllers\Student\CommunityController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminQuestController;
use App\Http\Controllers\Admin\AdminStudentController;
use App\Http\Controllers\Admin\QuestValidationController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    if (Auth::check()) {
        if (Auth::user()->role === 'admin') {
            return redirect('/admin/dashboard');
        }
        return redirect('/dashboard');
    }
    return redirect('/login');
});

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
});

Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Student Routes
Route::middleware(['auth', 'student'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    Route::get('/quests', [QuestController::class, 'index'])->name('quests.index');
    Route::post('/quests/{quest}/complete', [QuestController::class, 'complete'])->name('quests.complete');
    
    Route::get('/leaderboard', [LeaderboardController::class, 'index'])->name('leaderboard');
    
    // Community Hub / The Realm
    Route::get('/community', [CommunityController::class, 'index'])->name('community.index');
    Route::get('/community/{thread}', [CommunityController::class, 'show'])->name('community.show');
    Route::post('/community', [CommunityController::class, 'store'])->name('community.store');
    Route::post('/community/{thread}/reply', [CommunityController::class, 'storeReply'])->name('community.reply');
    Route::post('/community/like', [CommunityController::class, 'toggleLike'])->name('community.like');
    Route::post('/community/report', [CommunityController::class, 'report'])->name('community.report');
    Route::delete('/community/{thread}', [CommunityController::class, 'destroy'])->name('community.destroy');
    Route::delete('/community/reply/{reply}', [CommunityController::class, 'destroyReply'])->name('community.destroyReply');

    // Acknowledge Sanction notification
    Route::post('/sanctions/{sanction}/acknowledge', function (\App\Models\UserSanction $sanction) {
        if ($sanction->user_id === Auth::id()) {
            $sanction->update(['is_acknowledged' => true]);
        }
        return back();
    })->name('sanctions.acknowledge');

    Route::get('/profile', [ProfileController::class, 'index'])->name('profile');
    Route::post('/profile/avatar', [ProfileController::class, 'updateAvatar'])->name('profile.avatar');
    Route::post('/profile/avatar/upload', [ProfileController::class, 'uploadAvatar'])->name('profile.avatar.upload');
    Route::post('/profile/avatar/reset', [ProfileController::class, 'resetAvatar'])->name('profile.avatar.reset');
    Route::post('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password');
    Route::post('/onboarding/complete', [ProfileController::class, 'completeOnboarding'])->name('onboarding.complete');
});

// Admin Routes
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    
    Route::resource('quests', AdminQuestController::class)->except(['show']);
    
    Route::get('/validations', [QuestValidationController::class, 'index'])->name('validations.index');
    Route::post('/validations/{completion}/approve', [QuestValidationController::class, 'approve'])->name('validations.approve');
    Route::post('/validations/{completion}/reject', [QuestValidationController::class, 'reject'])->name('validations.reject');
    
    // The Realm Moderation & Sanctions
    Route::get('/community', [\App\Http\Controllers\Admin\AdminCommunityController::class, 'index'])->name('community.index');
    Route::post('/community/report/{report}/resolve', [\App\Http\Controllers\Admin\AdminCommunityController::class, 'resolveReport'])->name('community.resolveReport');
    Route::post('/community/thread/{thread}/pin', [\App\Http\Controllers\Admin\AdminCommunityController::class, 'togglePin'])->name('community.togglePin');
    Route::post('/community/thread/{thread}/lock', [\App\Http\Controllers\Admin\AdminCommunityController::class, 'toggleLock'])->name('community.toggleLock');
    Route::delete('/community/thread/{thread}', [\App\Http\Controllers\Admin\AdminCommunityController::class, 'destroyThread'])->name('community.destroyThread');
    Route::delete('/community/reply/{reply}', [\App\Http\Controllers\Admin\AdminCommunityController::class, 'destroyReply'])->name('community.destroyReply');
    Route::post('/students/{user}/punish', [\App\Http\Controllers\Admin\AdminCommunityController::class, 'punishStudent'])->name('students.punish');
    Route::post('/students/{user}/unmute', [\App\Http\Controllers\Admin\AdminCommunityController::class, 'unmuteStudent'])->name('students.unmute');

    Route::get('/students', [AdminStudentController::class, 'index'])->name('students.index');
    Route::get('/students/{student}', [AdminStudentController::class, 'show'])->name('students.show');
});
