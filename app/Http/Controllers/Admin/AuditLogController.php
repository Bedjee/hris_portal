<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditLogController extends Controller
{
    public function index(Request $request): Response
    {
        $action = trim((string) $request->query('action', ''));
        $userId = $request->query('user_id');

        $logs = AuditLog::query()
            ->with(['actor:id,name,username', 'subject'])
            ->when($action !== '', fn ($q) => $q->where('action', 'like', "{$action}%"))
            ->when($userId, fn ($q) => $q->where('user_id', $userId))
            ->orderByDesc('id')
            ->paginate(50)
            ->withQueryString()
            ->through(fn (AuditLog $log) => [
                'id'         => $log->id,
                'action'     => $log->action,
                'actor'      => $log->actor ? [
                    'name'     => $log->actor->name,
                    'username' => $log->actor->username,
                ] : null,
                'subject'    => $log->subject ? [
                    'type' => class_basename($log->subject_type),
                    'id'   => $log->subject_id,
                    'label' => $this->label($log->subject),
                ] : null,
                'ip_address' => $log->ip_address,
                'context'    => $log->context,
                'created_at' => $log->created_at->toIso8601String(),
            ]);

        return Inertia::render('Admin/AuditLogs/Index', [
            'logs'    => $logs,
            'filters' => [
                'action'  => $action,
                'user_id' => $userId,
            ],
            'actions' => AuditLog::query()
                ->select('action')
                ->distinct()
                ->orderBy('action')
                ->pluck('action'),
            'actors'  => User::query()
                ->whereIn('id', AuditLog::query()->whereNotNull('user_id')->select('user_id'))
                ->orderBy('name')
                ->get(['id', 'name', 'username']),
        ]);
    }

    private function label(mixed $subject): ?string
    {
        return match (true) {
            $subject instanceof User        => $subject->username,
            $subject instanceof \App\Models\Application => $subject->name,
            default                          => null,
        };
    }
}