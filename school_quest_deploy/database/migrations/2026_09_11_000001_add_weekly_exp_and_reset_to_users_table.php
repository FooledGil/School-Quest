<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'weekly_exp')) {
                $table->integer('weekly_exp')->default(0)->after('exp');
            }
            if (!Schema::hasColumn('users', 'weekly_reset_at')) {
                $table->timestamp('weekly_reset_at')->nullable()->after('weekly_exp');
            }
        });

        // Add indexes for high performance leaderboard queries
        Schema::table('users', function (Blueprint $table) {
            try {
                $table->index(['role', 'exp'], 'users_role_exp_idx');
            } catch (\Throwable $e) {
                // index might already exist
            }

            try {
                $table->index(['role', 'weekly_exp'], 'users_role_weekly_exp_idx');
            } catch (\Throwable $e) {
                // index might already exist
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            try {
                $table->dropIndex('users_role_exp_idx');
            } catch (\Throwable $e) {}

            try {
                $table->dropIndex('users_role_weekly_exp_idx');
            } catch (\Throwable $e) {}

            if (Schema::hasColumn('users', 'weekly_reset_at')) {
                $table->dropColumn('weekly_reset_at');
            }
            if (Schema::hasColumn('users', 'weekly_exp')) {
                $table->dropColumn('weekly_exp');
            }
        });
    }
};
