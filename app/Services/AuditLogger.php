<?php

namespace App\Services;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

/**
 * Central writer for audit entries.
 *
 * Never pass raw request payloads into $context. Build an explicit
 * array of safe fields (e.g. ['old_role' => 'user', 'new_role' => 'admin']).
 * The service truncates overlong strings defensively, but it cannot
 * know which fields are sensitive — that decision belongs to the caller.
 */
class AuditLogger
{
    private const MAX_CONTEXT_STRING = 500;

    public function log(
        ?User $actor,
        string $action,
        ?Model $subject = null,
        array $context = [],
        ?Request $request = null,
    ): AuditLog {
        $request ??= request();

        return AuditLog::create([
            'user_id'      => $actor?->getKey(),
            'action'       => $action,
            'subject_type' => $subject ? $subject->getMorphClass() : null,
            'subject_id'   => $subject?->getKey(),
            'ip_address'   => $request?->ip(),
            'user_agent'   => $request?->userAgent()
                ? Str::limit($request->userAgent(), 500, '')
                : null,
            'context'      => $context !== [] ? $this->sanitize($context) : null,
        ]);
    }

    /**
     * Recursively truncate long strings. Does NOT strip fields — that is
     * the caller's responsibility. Never include passwords in $context.
     */
    private function sanitize(array $data): array
    {
        foreach ($data as $key => $value) {
            if (is_string($value) && Str::length($value) > self::MAX_CONTEXT_STRING) {
                $data[$key] = Str::limit($value, self::MAX_CONTEXT_STRING, '…');
            } elseif (is_array($value)) {
                $data[$key] = $this->sanitize($value);
            }
        }

        return $data;
    }
}