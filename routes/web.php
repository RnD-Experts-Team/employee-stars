<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\EmployeeController;
use App\Http\Controllers\Admin\MilestoneController;
use App\Http\Controllers\Admin\OverviewController;
use App\Http\Controllers\Admin\ScoreboardController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\StoreController;
use App\Http\Controllers\Admin\StoreSwitchController;
use App\Http\Controllers\Admin\UserController;
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

        // Network overview is visible to every authenticated user; the payload
        // exposes a `can_manage` flag so read-only managers see a locked row.
        Route::get('overview', OverviewController::class)->name('admin.overview');

        // Store switch is available to any user with at least one authorized
        // store; the controller enforces per-store authorization internally.
        Route::post('stores/{store}/switch', StoreSwitchController::class)
            ->name('admin.stores.switch');
    });

// Super admin only
Route::middleware(['auth', 'verified', 'super.admin'])
    ->prefix('dashboard')
    ->group(function () {
        Route::resource('stores', StoreController::class)
            ->except(['create', 'show', 'edit'])
            ->names('admin.stores');

        Route::resource('users', UserController::class)
            ->except(['create', 'show', 'edit'])
            ->names('admin.users');
    });

require __DIR__.'/settings.php';
