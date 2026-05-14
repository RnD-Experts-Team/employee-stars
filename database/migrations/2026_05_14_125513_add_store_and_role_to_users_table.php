<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('store_id')
                ->nullable()
                ->after('id')
                ->constrained()
                ->nullOnDelete();
            $table->boolean('is_super_admin')->default(false)->after('store_id');

            $table->index(['store_id']);
            $table->index(['is_super_admin']);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['store_id']);
            $table->dropIndex(['store_id']);
            $table->dropIndex(['is_super_admin']);
            $table->dropColumn(['store_id', 'is_super_admin']);
        });
    }
};
