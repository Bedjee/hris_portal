<?php

namespace App\Http\Controllers\OAuth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserInfoController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user()->loadMissing('office');

        return response()->json([
            'sub'                => (string) $user->id,
            'preferred_username' => $user->username,
            'name'               => $user->name,
            'email'              => $user->email,
            'office'             => $user->office?->code,
            'role'               => $user->role,
            'employment_status'  => $user->employment_status,
        ]);
    }
}