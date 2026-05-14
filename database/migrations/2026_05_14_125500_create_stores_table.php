<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stores', function (Blueprint $table) {
            $table->id();
            $table->string('number', 32)->unique();
            $table->string('name')->nullable();
            $table->unsignedSmallInteger('target_points')->default(40);
            $table->string('board_title')->default('Daily Stars Performance');
            $table->string('board_tagline', 160)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stores');
    }
};
