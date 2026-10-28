<?php

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Determine if the application is in maintenance mode...
if (file_exists($maintenance = __DIR__.'/../storage/framework/maintenance.php')) {
    require $maintenance;
}

// Register the Composer autoloader...
require __DIR__.'/../vendor/autoload.php';

/*
|--------------------------------------------------------------------------
| Apache mod_php worker env-leak guard
|--------------------------------------------------------------------------
| Apache reuses PHP worker processes across vhosts. When this worker last
| served another Laravel app (e.g., HR Profiling), that app's Dotenv
| values remain in putenv(). Laravel's default Dotenv loader is immutable
| and will not overwrite them, so we would boot with the wrong DB_DATABASE.
|
| Force a mutable reload of OUR .env now — before Laravel's bootstrappers
| read config/database.php. This writes correct values into $_ENV, $_SERVER
| and putenv(), so nothing stale survives.
*/
if (is_file(__DIR__.'/../.env')) {
    try {
        \Dotenv\Dotenv::createMutable(__DIR__.'/..', '.env')->safeLoad();
    } catch (\Throwable $e) {
        // Silently fall through — Laravel will load it normally if this fails.
    }
}

// Bootstrap Laravel and handle the request...
/** @var Application $app */
$app = require_once __DIR__.'/../bootstrap/app.php';

$app->handleRequest(Request::capture());