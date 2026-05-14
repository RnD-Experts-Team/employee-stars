<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\EmployeeController;
use App\Http\Controllers\Admin\MilestoneController;
use App\Http\Controllers\Admin\OverviewController;
use App\Http\Controllers\Admin\ScoreboardController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\StoreController;
use App\Http\Controllers\Admin\StoreSwitchController;
use App\Http\Controllers\EmployeeDetailController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\LeaderboardController;
use Illuminate\Support\Facades\Route;

Route::get('/', LandingController::class)->name('landing');

// Public per-store routes
Route::prefix('s')->group(function () {
    Route::get('{store}', LeaderboardController::class)->name('leaderboard');
    Route::get('{store}/employee/{employee}', EmployeeDetailController::class)
        ->name('employee.show');
});

// Authenticated admin area (scoped to the user's current store)
Route::middleware(['auth', 'verified', 'store.context'])
    ->prefix('dashboard')
    ->group(function () {
        Route::get('/', AdminDashboardController::class)->name('dashboard');

        Route::resource('employees', EmployeeController::class)
            ->except(['create', 'show', 'edit'])
            ->names('admin.employees');

        Route::resource('milestones', MilestoneController::class)
            ->except(['create', 'show', 'edit'])
            ->names('admin.milestones');

        Route::get('scoreboard', [ScoreboardController::class, 'index'])->name('admin.scoreboard.index');
        Route::put('scoreboard', [ScoreboardController::class, 'update'])->name('admin.scoreboard.update');

        Route::get('settings/board', [SettingsController::class, 'edit'])->name('admin.settings.edit');
        Route::put('settings/board', [SettingsController::class, 'update'])->name('admin.settings.update');
    });

// Super admin only
Route::middleware(['auth', 'verified', 'super.admin'])
    ->prefix('dashboard')
    ->group(function () {
        Route::get('overview', OverviewController::class)->name('admin.overview');

        Route::resource('stores', StoreController::class)
            ->except(['create', 'show', 'edit'])
            ->names('admin.stores');

        Route::post('stores/{store}/switch', StoreSwitchController::class)
            ->name('admin.stores.switch');
    });

require __DIR__.'/settings.php';
