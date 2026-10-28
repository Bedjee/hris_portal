import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';

// ─────────────────────────────────────────────────────────────
// Action badge colors — kept in one place, no indigo/violet
// ─────────────────────────────────────────────────────────────
const ACTION_STYLES = {
    'auth.login': 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    'auth.logout': 'bg-slate-100 text-slate-700 ring-slate-200',
    'user.created': 'bg-blue-50 text-blue-700 ring-blue-100',
    'user.updated': 'bg-blue-50 text-blue-700 ring-blue-100',
    'user.activated': 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    'user.deactivated': 'bg-red-50 text-red-700 ring-red-100',
    'user.applications_synced': 'bg-sky-50 text-sky-700 ring-sky-100',
    'application.created': 'bg-blue-50 text-blue-700 ring-blue-100',
    'application.updated': 'bg-blue-50 text-blue-700 ring-blue-100',
    'application.activated': 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    'application.deactivated': 'bg-red-50 text-red-700 ring-red-100',
};

const DEFAULT_ACTION_STYLE = 'bg-slate-100 text-slate-700 ring-slate-200';

function ActionBadge({ action }) {
    const style = ACTION_STYLES[action] ?? DEFAULT_ACTION_STYLE;
    return (
        <span
            className={`inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${style}`}
        >
            {action}
        </span>
    );
}

// ─────────────────────────────────────────────────────────────
// Human-readable context formatter
// ─────────────────────────────────────────────────────────────
function formatContext(context) {
    if (!context) return null;

    const parts = [];
    if (context.changes) {
        for (const [field, { from, to }] of Object.entries(context.changes)) {
            parts.push(`${field}: ${String(from)} → ${String(to)}`);
        }
    }
    if (context.added?.length) parts.push(`+${context.added.length} app(s)`);
    if (context.removed?.length) parts.push(`−${context.removed.length} app(s)`);
    if (context.password_changed) parts.push('password changed');
    if (context.username && parts.length === 0) parts.push(context.username);

    return parts.length ? parts : null;
}

// ─────────────────────────────────────────────────────────────
// Relative time helper
// ─────────────────────────────────────────────────────────────
function formatTimestamp(iso) {
    const date = new Date(iso);
    const now = new Date();
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);

    let relative;
    if (diffMin < 1) relative = 'just now';
    else if (diffMin < 60) relative = `${diffMin}m ago`;
    else if (diffHr < 24) relative = `${diffHr}h ago`;
    else if (diffDay < 7) relative = `${diffDay}d ago`;
    else relative = null;

    return {
        relative,
        absolute: date.toLocaleString(),
        short: date.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
        }),
    };
}

// ─────────────────────────────────────────────────────────────
// Actor cell (used in both table and card)
// ─────────────────────────────────────────────────────────────
function ActorCell({ actor, compact = false }) {
    if (!actor) {
        return (
            <span className="text-xs italic text-slate-400">system</span>
        );
    }

    if (compact) {
        return (
            <span className="inline-flex items-center gap-2">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-700 to-blue-900 text-[10px] font-semibold text-white">
                    {actor.name
                        ?.trim()
                        .split(/\s+/)
                        .slice(0, 2)
                        .map((p) => p[0])
                        .join('')
                        .toUpperCase()}
                </span>
                <span className="truncate text-xs font-medium text-slate-700">
                    {actor.name}
                </span>
            </span>
        );
    }

    return (
        <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-700 to-blue-900 text-xs font-semibold text-white">
                {actor.name
                    ?.trim()
                    .split(/\s+/)
                    .slice(0, 2)
                    .map((p) => p[0])
                    .join('')
                    .toUpperCase()}
            </span>
            <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-900">
                    {actor.name}
                </p>
                <p className="truncate text-xs text-slate-500">
                    @{actor.username}
                </p>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// Subject cell
// ─────────────────────────────────────────────────────────────
function SubjectCell({ subject }) {
    if (!subject) {
        return <span className="text-xs text-slate-400">—</span>;
    }
    return (
        <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-800">
                {subject.label}
            </p>
            <p className="truncate text-xs text-slate-400">
                {subject.type} #{subject.id}
            </p>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────
export default function Index({ logs, filters, actions, actors }) {
    const [action, setAction] = useState(filters.action ?? '');
    const [userId, setUserId] = useState(filters.user_id ?? '');

    const hasFilters = action || userId;

    const applyFilters = (e) => {
        e.preventDefault();
        router.get(
            '/admin/audit-logs',
            { action, user_id: userId },
            { preserveState: true, replace: true },
        );
    };

    const clearFilters = () => {
        setAction('');
        setUserId('');
        router.get(
            '/admin/audit-logs',
            {},
            { preserveState: true, replace: true },
        );
    };

    const rows = logs.data ?? [];

    return (
        <AdminLayout title="Audit Log">
            <Head title="Audit Log" />

            {/* ── Filter toolbar ──────────────────────────── */}
            <form
                onSubmit={applyFilters}
                className="mb-5 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4"
            >
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto] sm:gap-3">
                    <select
                        value={action}
                        onChange={(e) => setAction(e.target.value)}
                        className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    >
                        <option value="">All actions</option>
                        {actions.map((a) => (
                            <option key={a} value={a}>
                                {a}
                            </option>
                        ))}
                    </select>

                    <select
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    >
                        <option value="">All actors</option>
                        {actors.map((u) => (
                            <option key={u.id} value={u.id}>
                                {u.name} (@{u.username})
                            </option>
                        ))}
                    </select>

                    <div className="flex gap-2 sm:contents">
                        <button
                            type="submit"
                            className="flex-1 rounded-lg bg-gradient-to-br from-blue-700 to-blue-900 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-900/30 transition hover:brightness-110 sm:flex-initial"
                        >
                            Filter
                        </button>
                        {hasFilters && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 sm:flex-initial"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                {hasFilters && (
                    <p className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
                        <span>Active filters:</span>
                        {action && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
                                action: {action}
                            </span>
                        )}
                        {userId && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
                                actor: {actors.find((u) => String(u.id) === String(userId))?.name ?? userId}
                            </span>
                        )}
                    </p>
                )}
            </form>

            {rows.length === 0 ? (
                /* ── Empty state ─────────────────────────── */
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                    <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-blue-700 to-blue-900 text-white shadow-sm shadow-blue-900/25">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-6 w-6"
                            aria-hidden="true"
                        >
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
                        </svg>
                    </div>
                    <h3 className="mt-4 text-sm font-semibold text-slate-900">
                        No audit entries
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                        {hasFilters
                            ? 'No entries match the current filters.'
                            : 'Activity will appear here once users start using the portal.'}
                    </p>
                    {hasFilters && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="mt-4 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            ) : (
                <>
                    {/* ── Desktop table ────────────────────── */}
                    <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:block">
                        <table className="min-w-full">
                            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">When</th>
                                    <th className="px-4 py-3">Actor</th>
                                    <th className="px-4 py-3">Action</th>
                                    <th className="px-4 py-3">Subject</th>
                                    <th className="px-4 py-3">Detail</th>
                                    <th className="px-4 py-3">IP</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((log) => {
                                    const ts = formatTimestamp(log.created_at);
                                    const details = formatContext(log.context);
                                    return (
                                        <tr
                                            key={log.id}
                                            className="border-b border-slate-100 last:border-0"
                                        >
                                            <td className="whitespace-nowrap px-4 py-3 text-xs">
                                                <p className="font-medium text-slate-700">
                                                    {ts.relative ?? ts.short}
                                                </p>
                                                <p
                                                    className="mt-0.5 text-slate-400"
                                                    title={ts.absolute}
                                                >
                                                    {ts.absolute}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <ActorCell actor={log.actor} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <ActionBadge action={log.action} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <SubjectCell
                                                    subject={log.subject}
                                                />
                                            </td>
                                            <td className="max-w-md px-4 py-3 text-xs text-slate-500">
                                                {details ? (
                                                    <ul className="space-y-0.5">
                                                        {details.map(
                                                            (d, i) => (
                                                                <li
                                                                    key={i}
                                                                    className="truncate"
                                                                >
                                                                    {d}
                                                                </li>
                                                            ),
                                                        )}
                                                    </ul>
                                                ) : (
                                                    <span className="text-slate-400">
                                                        —
                                                    </span>
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-500">
                                                {log.ip_address ?? '—'}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* ── Mobile / tablet cards ────────────── */}
                    <div className="space-y-3 lg:hidden">
                        {rows.map((log) => {
                            const ts = formatTimestamp(log.created_at);
                            const details = formatContext(log.context);
                            return (
                                <div
                                    key={log.id}
                                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                                >
                                    {/* Header row */}
                                    <div className="flex items-start justify-between gap-3">
                                        <ActionBadge action={log.action} />
                                        <span
                                            className="shrink-0 text-xs text-slate-500"
                                            title={ts.absolute}
                                        >
                                            {ts.relative ?? ts.short}
                                        </span>
                                    </div>

                                    {/* Actor */}
                                    <div className="mt-3 flex items-center gap-2">
                                        <ActorCell
                                            actor={log.actor}
                                            compact
                                        />
                                    </div>

                                    {/* Subject */}
                                    {log.subject && (
                                        <div className="mt-2 rounded-lg bg-slate-50 px-3 py-2">
                                            <p className="truncate text-xs font-medium text-slate-700">
                                                {log.subject.label}
                                            </p>
                                            <p className="truncate text-[11px] text-slate-400">
                                                {log.subject.type} #
                                                {log.subject.id}
                                            </p>
                                        </div>
                                    )}

                                    {/* Detail */}
                                    {details && (
                                        <ul className="mt-2 space-y-1 text-xs text-slate-500">
                                            {details.map((d, i) => (
                                                <li
                                                    key={i}
                                                    className="break-words"
                                                >
                                                    {d}
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {/* Footer */}
                                    {log.ip_address && (
                                        <div className="mt-3 flex items-center gap-2 border-t border-slate-100 pt-2 font-mono text-[11px] text-slate-400">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="h-3.5 w-3.5"
                                                aria-hidden="true"
                                            >
                                                <circle
                                                    cx="12"
                                                    cy="12"
                                                    r="9"
                                                />
                                                <path d="M3 12h18" />
                                                <path d="M12 3c2.4 2.5 3.6 5.6 3.6 9s-1.2 6.5-3.6 9c-2.4-2.5-3.6-5.6-3.6-9S9.6 5.5 12 3Z" />
                                            </svg>
                                            {log.ip_address}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {/* ── Pagination ──────────────────────────────── */}
            {logs.links && logs.links.length > 3 && (
                <div className="mt-4 flex flex-wrap gap-1">
                    {logs.links.map((link, i) => (
                        <button
                            key={i}
                            type="button"
                            disabled={!link.url}
                            onClick={() =>
                                link.url &&
                                router.get(
                                    link.url,
                                    {},
                                    { preserveScroll: true },
                                )
                            }
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`rounded-lg border px-3 py-1.5 text-sm transition ${
                                link.active
                                    ? 'border-blue-700 bg-blue-700 text-white'
                                    : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-100'
                            } ${!link.url ? 'opacity-40' : ''}`}
                        />
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}