<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('scores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->foreignId('milestone_id')->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('points')->default(0);
            $table->timestamps();

            $table->unique(['employee_id', 'milestone_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('scores');
    }
};
