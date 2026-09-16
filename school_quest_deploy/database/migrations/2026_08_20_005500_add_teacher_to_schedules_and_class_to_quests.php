<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('schedules', function (Blueprint $table) {
            $table->string('teacher')->nullable()->after('class');
            $table->string('room')->nullable()->after('teacher');
        });

        Schema::table('quests', function (Blueprint $table) {
            $table->string('class')->nullable()->after('type');
        });
    }

    public function down(): void
    {
        Schema::table('schedules', function (Blueprint $table) {
            $table->dropColumn(['teacher', 'room']);
        });

        Schema::table('quests', function (Blueprint $table) {
            $table->dropColumn('class');
        });
    }
};
