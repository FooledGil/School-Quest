<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('piket_schedules', function (Blueprint $table) {
            $table->id();
            $table->integer('day_of_week'); // 1-5
            $table->string('class');
            $table->string('group_name');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('piket_schedules');
    }
};
