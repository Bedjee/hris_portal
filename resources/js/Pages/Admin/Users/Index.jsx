import { Head, Link, router, useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';

// ─────────────────────────────────────────────────────────────
// User row
// ─────────────────────────────────────────────────────────────
function UserRow({ user, onEdit, onAssign }) {
    return (
        <tr className="border-b border-slate-100 last:border-0">
            <td className="px-4 py-3">
                <p className="text-sm font-medium text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">@{user.username}</p>
            </td>
            <td className="px-4 py-3 text-sm text-slate-600">{user.office ?? '—'}</td>
            <td className="px-4 py-3">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium capitalize text-slate-700">
                    {user.role}
                </span>
            </td>
            <td className="px-4 py-3 text-sm text-slate-600">
                {user.employment_label ?? '—'}
            </td>
            <td className="px-4 py-3 text-sm text-slate-600">
                {user.applications_count}
            </td>
            <td className="px-4 py-3">
                <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        user.is_active
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-red-50 text-red-700'
                    }`}
                >
                    {user.is_active ? 'Active' : 'Inactive'}
                </span>
            </td>
            <td className="px-4 py-3">
                <div className="flex flex-wrap justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => onEdit(user)}
                        className="rounded border border-slate-300 px-2.5 py-1 text-xs font-medium transition hover:bg-slate-100"
                    >
                        Edit
                    </button>
                    <button
                        type="button"
                        onClick={() => onAssign(user)}
                        className="rounded border border-slate-300 px-2.5 py-1 text-xs font-medium transition hover:bg-slate-100"
                    >
                        Access
                    </button>
                    <button
                        type="button"
                        onClick={() =>
                            router.patch(
                                `/admin/users/${user.id}/toggle-active`,
                                {},
                                { preserveScroll: true },
                            )
                        }
                        className="rounded border border-slate-300 px-2.5 py-1 text-xs font-medium transition hover:bg-slate-100"
                    >
                        {user.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                </div>
            </td>
        </tr>
    );
}

// ─────────────────────────────────────────────────────────────
// Import banner
// ─────────────────────────────────────────────────────────────
function ImportBanner({ users, defaultPassword }) {
    if (!users || users.length === 0) return null;

    return (
        <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 sm:p-5">
            <h3 className="mb-2 text-sm font-semibold text-emerald-900">
                {users.length} user{users.length === 1 ? '' : 's'} imported
            </h3>
            <p className="mb-3 text-xs text-emerald-800">
                Share these usernames with the users. Default password:{' '}
                <code className="rounded bg-white px-1.5 py-0.5 font-mono">
                    {defaultPassword}
                </code>{' '}
                — they will be required to change it on first login.
            </p>
            <div className="overflow-x-auto rounded-lg bg-white">
                <table className="w-full text-xs">
                    <thead className="bg-slate-50 text-left uppercase tracking-wide text-slate-500">
                        <tr>
                            <th className="px-3 py-2">Name</th>
                            <th className="px-3 py-2">Username</th>
                            <th className="px-3 py-2">Office</th>
                            <th className="px-3 py-2">Role</th>
                            <th className="px-3 py-2">Employment</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u, i) => (
                            <tr
                                key={i}
                                className="border-b border-slate-100 last:border-0"
                            >
                                <td className="px-3 py-1.5">{u.name}</td>
                                <td className="px-3 py-1.5 font-mono font-medium">
                                    {u.username}
                                </td>
                                <td className="px-3 py-1.5">{u.office}</td>
                                <td className="px-3 py-1.5 capitalize">{u.role}</td>
                                <td className="px-3 py-1.5">{u.employment_status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// User form modal (create + edit)
// ─────────────────────────────────────────────────────────────
function UserFormModal({
    open,
    editing,
    form,
    offices,
    roles,
    employmentStatuses,
    onSubmit,
    onClose,
}) {
    // Lock body scroll + close on Escape while open.
    useEffect(() => {
        if (!open) return;

        const onKey = (e) => {
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [open, onClose]);

    if (!open) return null;

    const textFields = [
        ['name', 'Name', 'text'],
        ['username', 'Username', 'text'],
        ['email', 'Email (optional)', 'email'],
        [
            'password',
            editing ? 'New password (optional)' : 'Password',
            'password',
        ],
        ['password_confirmation', 'Confirm password', 'password'],
    ];

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby="user-modal-title"
        >
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                aria-hidden="true"
            />

            {/* Panel */}
            <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-h-[88vh] sm:rounded-2xl">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6">
                    <div>
                        <h2
                            id="user-modal-title"
                            className="text-base font-semibold tracking-tight text-slate-900"
                        >
                            {editing ? `Edit @${editing.username}` : 'Create user'}
                        </h2>
                        <p className="mt-0.5 text-xs text-slate-500">
                            {editing
                                ? 'Update account details. Leave password blank to keep the current one.'
                                : 'Add a new user to the portal and set their credentials.'}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            className="h-5 w-5"
                            aria-hidden="true"
                        >
                            <path d="M6 6l12 12M18 6L6 18" />
                        </svg>
                    </button>
                </div>

                {/* Body — scrollable */}
                <form
                    onSubmit={onSubmit}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {textFields.map(([key, label, type]) => (
                                <div key={key}>
                                    <label className="mb-1 block text-sm font-medium text-slate-700">
                                        {label}
                                    </label>
                                    <input
                                        type={type}
                                        value={form.data[key]}
                                        onChange={(e) =>
                                            form.setData(key, e.target.value)
                                        }
                                        className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                                    />
                                    {form.errors[key] && (
                                        <p className="mt-1 text-xs text-red-600">
                                            {form.errors[key]}
                                        </p>
                                    )}
                                </div>
                            ))}

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                    Role
                                </label>
                                <select
                                    value={form.data.role}
                                    onChange={(e) =>
                                        form.setData('role', e.target.value)
                                    }
                                    className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                                >
                                    {roles.map((role) => (
                                        <option key={role} value={role}>
                                            {role}
                                        </option>
                                    ))}
                                </select>
                                {form.errors.role && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {form.errors.role}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                    Employment status
                                </label>
                                <select
                                    value={form.data.employment_status}
                                    onChange={(e) =>
                                        form.setData(
                                            'employment_status',
                                            e.target.value,
                                        )
                                    }
                                    className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                                >
                                    <option value="">— none —</option>
                                    {Object.entries(employmentStatuses).map(
                                        ([value, label]) => (
                                            <option key={value} value={value}>
                                                {label}
                                            </option>
                                        ),
                                    )}
                                </select>
                                {form.errors.employment_status && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {form.errors.employment_status}
                                    </p>
                                )}
                            </div>

                            <div className="sm:col-span-2">
                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                    Office
                                </label>
                                <select
                                    value={form.data.office_id}
                                    onChange={(e) =>
                                        form.setData(
                                            'office_id',
                                            e.target.value,
                                        )
                                    }
                                    className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                                >
                                    <option value="">— none —</option>
                                    {offices.map((office) => (
                                        <option key={office.id} value={office.id}>
                                            {office.name}
                                        </option>
                                    ))}
                                </select>
                                {form.errors.office_id && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {form.errors.office_id}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50/60 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 sm:w-auto"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="rounded-lg bg-gradient-to-br from-blue-700 to-blue-900 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-900/30 transition hover:brightness-110 disabled:opacity-60 sm:w-auto"
                        >
                            {form.processing
                                ? editing
                                    ? 'Saving…'
                                    : 'Creating…'
                                : editing
                                  ? 'Save changes'
                                  : 'Create user'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────
export default function Index({
    users,
    filters,
    offices,
    roles,
    apps,
    employment_statuses: employmentStatuses,
    default_password: defaultPassword,
    imported_users: importedUsers,
}) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [editing, setEditing] = useState(null);
    const [assigning, setAssigning] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const assignPanelRef = useRef(null);

    const form = useForm({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'user',
        employment_status: 'regular',
        office_id: '',
        is_active: true,
    });

    const assignForm = useForm({ applications: [] });

    // Scroll the access panel into view when it opens.
    useEffect(() => {
        if (assigning && assignPanelRef.current) {
            assignPanelRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    }, [assigning]);

    const submitSearch = (e) => {
        e.preventDefault();
        router.get(
            '/admin/users',
            { search },
            { preserveState: true, replace: true },
        );
    };

    // ── Modal open helpers ────────────────────────────────
    const openCreate = () => {
        setEditing(null);
        form.reset();
        form.clearErrors();
        setModalOpen(true);
    };

    const openEdit = (user) => {
        setEditing(user);
        form.clearErrors();
        form.setData({
            name: user.name,
            username: user.username,
            email: user.email ?? '',
            password: '',
            password_confirmation: '',
            role: user.role,
            employment_status: user.employment_status ?? 'regular',
            office_id:
                offices.find((o) => o.name === user.office)?.id ?? '',
            is_active: user.is_active,
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditing(null);
        form.reset();
        form.clearErrors();
    };

    const submitForm = (e) => {
        e.preventDefault();
        const url = editing ? `/admin/users/${editing.id}` : '/admin/users';
        const method = editing ? 'put' : 'post';

        form[method](url, {
            preserveScroll: true,
            onSuccess: () => {
                closeModal();
            },
        });
    };

    // ── Access panel ──────────────────────────────────────
    const openAssign = (user) => {
        setAssigning(user);
        assignForm.clearErrors();
        assignForm.setData({
            applications: user.application_ids ?? [],
        });
    };

    const submitAssign = (e) => {
        e.preventDefault();
        assignForm.put(`/admin/users/${assigning.id}/applications`, {
            preserveScroll: true,
            onSuccess: () => setAssigning(null),
        });
    };

    return (
        <AdminLayout title="Users">
            <Head title="Users" />

            <ImportBanner
                users={importedUsers}
                defaultPassword={defaultPassword}
            />

            {/* ── Toolbar ─────────────────────────────────── */}
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <form
                    onSubmit={submitSearch}
                    className="flex w-full gap-2 sm:max-w-md"
                >
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search name or username…"
                        className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    />
                    <button
                        type="submit"
                        className="shrink-0 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                        Search
                    </button>
                </form>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <Link
                        href="/admin/users/import"
                        className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                        Import users
                    </Link>
                    <button
                        type="button"
                        onClick={openCreate}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-blue-700 to-blue-900 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-900/30 transition hover:brightness-110"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            className="h-4 w-4"
                            aria-hidden="true"
                        >
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                        Create user
                    </button>
                </div>
            </div>

            {/* ── Table ───────────────────────────────────── */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
                <table className="min-w-full">
                    <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                            <th className="px-4 py-3">User</th>
                            <th className="px-4 py-3">Office</th>
                            <th className="px-4 py-3">Role</th>
                            <th className="px-4 py-3">Employment</th>
                            <th className="px-4 py-3">Apps</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.data.map((user) => (
                            <UserRow
                                key={user.id}
                                user={user}
                                onEdit={openEdit}
                                onAssign={openAssign}
                            />
                        ))}
                        {users.data.length === 0 && (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="px-4 py-10 text-center text-sm text-slate-500"
                                >
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ── Pagination ──────────────────────────────── */}
            {users.links && users.links.length > 3 && (
                <div className="mt-4 flex flex-wrap gap-1">
                    {users.links.map((link, i) => (
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
                            className={`rounded border px-3 py-1 text-sm transition ${
                                link.active
                                    ? 'border-blue-700 bg-blue-700 text-white'
                                    : 'border-slate-300 text-slate-600 hover:bg-slate-100'
                            } ${!link.url ? 'opacity-40' : ''}`}
                        />
                    ))}
                </div>
            )}

            {/* ── Application access panel ────────────────── */}
            {assigning && (
                <div
                    ref={assignPanelRef}
                    className="mt-8 scroll-mt-20 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-base font-semibold">
                            Application access — @{assigning.username}
                        </h2>
                        <button
                            type="button"
                            onClick={() => setAssigning(null)}
                            className="text-sm font-medium text-slate-500 transition hover:text-slate-700"
                        >
                            Close
                        </button>
                    </div>

                    <form onSubmit={submitAssign} className="space-y-3">
                        {apps.length === 0 && (
                            <p className="text-sm text-slate-500">
                                No applications are registered yet.
                            </p>
                        )}

                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {apps.map((app) => {
                                const checked =
                                    assignForm.data.applications.includes(
                                        app.id,
                                    );
                                return (
                                    <label
                                        key={app.id}
                                        className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition ${
                                            checked
                                                ? 'border-blue-300 bg-blue-50/60'
                                                : 'border-slate-200 bg-white hover:border-slate-300'
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={(e) => {
                                                const next = e.target.checked
                                                    ? [
                                                          ...assignForm.data
                                                              .applications,
                                                          app.id,
                                                      ]
                                                    : assignForm.data.applications.filter(
                                                          (id) =>
                                                              id !== app.id,
                                                      );
                                                assignForm.setData(
                                                    'applications',
                                                    next,
                                                );
                                            }}
                                            className="rounded border-slate-300 text-blue-700 focus:ring-blue-600"
                                        />
                                        <span className="font-medium text-slate-800">
                                            {app.name}
                                        </span>
                                        {!app.is_active && (
                                            <span className="ml-auto text-xs text-slate-400">
                                                inactive
                                            </span>
                                        )}
                                    </label>
                                );
                            })}
                        </div>

                        {assignForm.errors.applications && (
                            <p className="text-xs text-red-600">
                                {assignForm.errors.applications}
                            </p>
                        )}

                        <div className="flex gap-2 pt-2">
                            <button
                                type="submit"
                                disabled={
                                    assignForm.processing ||
                                    apps.length === 0
                                }
                                className="rounded-lg bg-gradient-to-br from-blue-700 to-blue-900 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-900/30 transition hover:brightness-110 disabled:opacity-60"
                            >
                                Save access
                            </button>
                            <button
                                type="button"
                                onClick={() => setAssigning(null)}
                                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* ── Create / edit modal ─────────────────────── */}
            <UserFormModal
                open={modalOpen}
                editing={editing}
                form={form}
                offices={offices}
                roles={roles}
                employmentStatuses={employmentStatuses}
                onSubmit={submitForm}
                onClose={closeModal}
            />
        </AdminLayout>
    );
}