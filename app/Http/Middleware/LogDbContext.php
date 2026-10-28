<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class LogDbContext
{
    public function handle(Request $request, Closure $next): Response
    {
        $before = [
            'default'   => config('database.default'),
            'mysql_db'  => config('database.connections.mysql.database'),
            'passport'  => config('passport.storage.database.connection'),
            'env'       => $_ENV['DB_DATABASE'] ?? '(none)',
            'getenv'    => getenv('DB_DATABASE') ?: '(none)',
        ];

        Log::info('[DB BEFORE] ' . $request->method() . ' ' . $request->path(), $before);

        $response = $next($request);

        $after = [
            'mysql_db' => config('database.connections.mysql.database'),
        ];

        Log::info('[DB AFTER] ' . $request->method() . ' ' . $request->path(), $after);

        return $response;
    }
}