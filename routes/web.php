<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Student\DashboardController;
use App\Http\Controllers\Student\QuestController;
use App\Http\Controllers\Student\LeaderboardController;
use App\Http\Controllers\Student\ProfileController;
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
    
    Route::get('/students', [AdminStudentController::class, 'index'])->name('students.index');
    Route::get('/students/{student}', [AdminStudentController::class, 'show'])->name('students.show');
});
