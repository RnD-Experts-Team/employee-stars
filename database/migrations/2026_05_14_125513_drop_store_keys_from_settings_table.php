<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * After moving target_points, board_title, and board_tagline onto stores,
     * remove the legacy global keys so Setting::get() can't return stale values.
     */
    public function up(): void
    {
        DB::table('settings')
            ->whereIn('key', ['target_points', 'board_title', 'board_tagline'])
            ->delete();
    }

    public function down(): void
    {
        // Irreversible data cleanup.
    }
};
