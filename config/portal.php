<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Portal roles
    |--------------------------------------------------------------------------
    | Stored as plain strings in the DB (never an enum). Add new roles here.
    */
    'roles' => ['admin', 'user'],


    /*
|--------------------------------------------------------------------------
| Employment statuses
|--------------------------------------------------------------------------
| Stored as plain strings. Add values here to expand the list — no
| schema change needed. Order determines dropdown order.
*/
'employment_statuses' => [
    'regular'   => 'Regular',
    'job_order' => 'Job Order',
],

    /*
    |--------------------------------------------------------------------------
    | Bootstrap administrator
    |--------------------------------------------------------------------------
    | Never commit real credentials. Set these in .env only.
    */
    'admin' => [
        'name'     => env('PORTAL_ADMIN_NAME', 'Portal Administrator'),
        'username' => env('PORTAL_ADMIN_USERNAME'),
        'email'    => env('PORTAL_ADMIN_EMAIL'),
        'password' => env('PORTAL_ADMIN_PASSWORD'),
    ],

    /*
    |--------------------------------------------------------------------------
    | Application registry seed data
    |--------------------------------------------------------------------------
    */
   'applications' => [
    [
        'name'        => 'QR Attendance',
        'slug'        => 'qr-attendance',
        'description' => 'QR Code Attendance System',
        'url'         => env('PORTAL_APP_QR_URL', 'https://qrattendance.opolhrmo.com'),
        'icon'        => 'clock',
        'sort_order'  => 10,
    ],
    [
        'name'        => 'iLeave',
        'slug'        => 'ileave',
        'description' => 'Leave Management System',
        'url'         => env('PORTAL_APP_ILEAVE_URL', 'https://ileave.opolhrmo.com'),
        'icon'        => 'calendar',
        'sort_order'  => 20,
    ],


],



];