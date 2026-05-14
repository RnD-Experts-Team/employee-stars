<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->foreignId('store_id')
                ->after('id')
                ->constrained()
                ->cascadeOnDelete();
            $table->index(['store_id', 'is_active', 'sort_order']);
        });

        Schema::table('milestones', function (Blueprint $table) {
            $table->foreignId('store_id')
                ->after('id')
                ->constrained()
                ->cascadeOnDelete();
            $table->dropUnique(['slug']);
            $table->unique(['store_id', 'slug']);
            $table->index(['store_id', 'is_active', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            $table->dropForeign(['store_id']);
            $table->dropIndex(['store_id', 'is_active', 'sort_order']);
            $table->dropColumn('store_id');
        });

        Schema::table('milestones', function (Blueprint $table) {
            $table->dropForeign(['store_id']);
            $table->dropIndex(['store_id', 'is_active', 'sort_order']);
            $table->dropUnique(['store_id', 'slug']);
            $table->unique('slug');
            $table->dropColumn('store_id');
        });
    }
};
