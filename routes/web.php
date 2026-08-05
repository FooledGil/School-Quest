<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Student\DashboardController;
use App\Http\Controllers\Student\QuestController;
use App\Http\Controllers\Student\LeaderboardController;
use App\Http\Controllers\Student\ProfileController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminQuestController;
use App\Http\Controllers\Admin\AdminStudentController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
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
});

// Admin Routes
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    
    Route::resource('quests', AdminQuestController::class)->except(['show']);
    
    Route::get('/students', [AdminStudentController::class, 'index'])->name('students.index');
    Route::get('/students/{student}', [AdminStudentController::class, 'show'])->name('students.show');
});
