<?php

use App\Http\Controllers\DemoLoginController;
use App\Http\Controllers\DeploymentController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::post('demo-login', DemoLoginController::class)->name('demo-login');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::get('polling', [DeploymentController::class, 'show'])->name('polling');
    Route::post('polling/restart', [DeploymentController::class, 'restart'])->name('polling.restart');
    Route::post('polling/reset', [DeploymentController::class, 'reset'])->name('polling.reset');
});

require __DIR__.'/settings.php';
