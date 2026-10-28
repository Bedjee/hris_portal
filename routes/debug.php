<?php

use Illuminate\Support\Facades\Route;

/*
 * TEMPORARY DIAGNOSTIC ROUTES — DELETE AFTER DEBUGGING
 * These routes expose environment info. Do NOT deploy to production.
 */
Route::get('/debug/env', function () {
    return response()->json([
        'app_env'          => app()->environment(),
        'app_url'          => config('app.url'),
        'app_debug'        => config('app.debug'),
        'db_connection'    => config('database.default'),
        'db_database'      => config('database.connections.mysql.database'),
        'db_host'          => config('database.connections.mysql.host'),
        'env_db_database'  => $_ENV['DB_DATABASE'] ?? env('DB_DATABASE') ?? '(not set)',
        'env_file_exists'  => file_exists(base_path('.env')),
        'config_cached'    => app()->configurationIsCached(),
        'bootstrap_cache'  => glob(base_path('bootstrap/cache/*.php')) ?: [],
        'passport_clients' => \Laravel\Passport\Client::count(),
        'working_dir'      => base_path(),
        'php_uname'        => php_uname('n'),
        'sapi'             => php_sapi_name(),
    ]);
})->withoutMiddleware(['web']);