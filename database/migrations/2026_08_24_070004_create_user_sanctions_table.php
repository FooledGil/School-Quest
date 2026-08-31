<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_sanctions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('admin_id')->constrained('users')->onDelete('cascade');
            $table->enum('type', ['exp_deduction', 'mute', 'streak_reset', 'warning', 'ban']);
            $table->integer('amount')->nullable(); // e.g. -100 (for EXP) or duration in minutes (for Mute)
            $table->text('reason');
            $table->timestamp('expires_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->boolean('is_acknowledged')->default(false); // student marked as read
            $table->timestamps();

            $table->index(['user_id', 'is_active']);
            $table->index(['user_id', 'is_acknowledged']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_sanctions');
    }
};
