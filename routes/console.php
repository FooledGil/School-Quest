<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Reset weekly leaderboard every 7 days (Monday 00:00 WIB)
Schedule::command('schoolquest:reset-weekly')->weeklyOn(1, '00:00');

