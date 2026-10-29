<?php

use App\Http\Controllers\Admin\ApplicationController as AdminApplicationController;
use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\OfficeController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\UserImportController;
use App\Http\Controllers\ApplicationLaunchController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\PasswordChangeController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OAuth\UserInfoController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin'       => Route::has('login'),
        'canRegister'    => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion'     => PHP_VERSION,
    ]);
})->name('welcome');

/*
|--------------------------------------------------------------------------
| OAuth
|--------------------------------------------------------------------------
*/
Route::middleware('auth:api')
    ->get('oauth/userinfo', UserInfoController::class)
    ->name('oauth.userinfo');

/*
|--------------------------------------------------------------------------
| Guest
|--------------------------------------------------------------------------
*/
Route::middleware('guest')->group(function () {
    Route::get('login', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('login', [AuthenticatedSessionController::class, 'store'])
    ->middleware('throttle:login-ip')      // ← was throttle:login
    ->name('login.store');
});

/*
|--------------------------------------------------------------------------
| Authenticated — password.changed redirects to change form until rotated
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'password.changed'])->group(function () {
    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::get('applications/{application}/launch', ApplicationLaunchController::class)
        ->name('applications.launch');

    Route::get('password/change',  [PasswordChangeController::class, 'edit'])->name('password.change.edit');
    Route::post('password/change', [PasswordChangeController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('password.change.update');
});

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'admin', 'password.changed'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        // Users
        Route::get('users', [AdminUserController::class, 'index'])->name('users.index');
        Route::post('users', [AdminUserController::class, 'store'])->name('users.store');
        Route::put('users/{user}', [AdminUserController::class, 'update'])->name('users.update');
        Route::patch('users/{user}/toggle-active', [AdminUserController::class, 'toggleActive'])
            ->name('users.toggle-active');
        Route::put('users/{user}/applications', [AdminUserController::class, 'syncApplications'])
            ->name('users.applications');

        Route::get('users/import',  [UserImportController::class, 'create'])->name('users.import.create');
        Route::post('users/import', [UserImportController::class, 'store'])->name('users.import.store');

        // Applications
        Route::get('applications', [AdminApplicationController::class, 'index'])->name('applications.index');
        Route::post('applications', [AdminApplicationController::class, 'store'])->name('applications.store');
        Route::put('applications/{application}', [AdminApplicationController::class, 'update'])->name('applications.update');
        Route::patch('applications/{application}/toggle-active', [AdminApplicationController::class, 'toggleActive'])
            ->name('applications.toggle-active');

        Route::post('applications/{application}/sso', [AdminApplicationController::class, 'enableSso'])
            ->name('applications.sso.enable');
        Route::delete('applications/{application}/sso', [AdminApplicationController::class, 'disableSso'])
            ->name('applications.sso.disable');

        // Audit
        Route::get('audit-logs', [AuditLogController::class, 'index'])->name('audit-logs.index');

        // Offices
        Route::get('offices', [OfficeController::class, 'index'])->name('offices.index');
        Route::post('offices', [OfficeController::class, 'store'])->name('offices.store');
        Route::put('offices/{office}', [OfficeController::class, 'update'])->name('offices.update');
        Route::patch('offices/{office}/toggle-active', [OfficeController::class, 'toggleActive'])
            ->name('offices.toggle-active');
    });