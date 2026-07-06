<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();

        DB::table('users')
            ->whereNotNull('store_id')
            ->orderBy('id')
            ->each(function ($user) use ($now): void {
                DB::table('store_user')->updateOrInsert(
                    ['user_id' => $user->id, 'store_id' => $user->store_id],
                    ['created_at' => $now, 'updated_at' => $now],
                );
            });

        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['store_id']);
            $table->dropIndex(['store_id']);
            $table->dropColumn('store_id');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('store_id')
                ->nullable()
                ->after('id')
                ->constrained()
                ->nullOnDelete();
            $table->index(['store_id']);
        });

        // Best-effort restore: copy the earliest pivot row per user back to users.store_id.
        DB::table('store_user')
            ->orderBy('id')
            ->get()
            ->groupBy('user_id')
            ->each(function ($rows, $userId): void {
                DB::table('users')
                    ->where('id', $userId)
                    ->update(['store_id' => $rows->first()->store_id]);
            });
    }
};
