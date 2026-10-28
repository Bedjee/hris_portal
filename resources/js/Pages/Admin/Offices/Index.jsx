import { Head, router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';

// ─────────────────────────────────────────────────────────────
// Inline rename field (used in both table & card views)
// ─────────────────────────────────────────────────────────────
function RenameField({ office, onDone }) {
    const [name, setName] = useState(office.name);

    const saveName = () => {
        const trimmed = name.trim();
        if (!trimmed || trimmed === office.name) {
            onDone();
            return;
        }

        router.put(
            `/admin/offices/${office.id}`,
            { name: trimmed },
            {
                preserveScroll: true,
                onSuccess: () => onDone(),
                onError: () => setName(office.name),
            },
        );
    };

    return (
        <div className="flex items-center gap-2">
            <input
                type="text"
                value={name}
                autoFocus
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') saveName();
                    if (e.key === 'Escape') {
                        setName(office.name);
                        onDone();
                    }
                }}
                className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm shadow-sm transition focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            />
            <button
                type="button"
                onClick={saveName}
                className="shrink-0 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
            >
                Save
            </button>
            <button
                type="button"
                onClick={() => {
                    setName(office.name);
                    onDone();
                }}
                className="shrink-0 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
            >
                Cancel
            </button>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// Status pill
// ─────────────────────────────────────────────────────────────
function StatusPill({ active }) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
                active
                    ? 'bg-emerald-50 text-emerald-700 ring-emerald-100'
                    : 'bg-red-50 text-red-700 ring-red-100'
            }`}
        >
            <span
                aria-hidden="true"
                className={`h-1.5 w-1.5 rounded-full ${
                    active ? 'bg-emerald-600' : 'bg-red-600'
                }`}
            />
            {active ? 'Active' : 'Inactive'}
        </span>
    );
}

// ─────────────────────────────────────────────────────────────
// Action buttons (shared between table and card)
// ─────────────────────────────────────────────────────────────
function RowActions({ office, onRename }) {
    return (
        <div className="flex flex-wrap justify-end gap-2">
            <button
                type="button"
                onClick={() => onRename(office.id)}
                className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
            >
                Rename
            </button>
            <button
                type="button"
                onClick={() =>
                    router.patch(
                        `/admin/offices/${office.id}/toggle-active`,
                        {},
                        { preserveScroll: true },
                    )
                }
                className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
            >
                {office.is_active ? 'Deactivate' : 'Activate'}
            </button>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// Create office modal
// ─────────────────────────────────────────────────────────────
function OfficeFormModal({ open, form, onSubmit, onClose }) {
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

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby="office-modal-title"
        >
            {/* Backdrop */}
            <div
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                aria-hidden="true"
            />

            {/* Panel */}
            <div className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-h-[88vh] sm:rounded-2xl">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6">
                    <div>
                        <h2
                            id="office-modal-title"
                            className="text-base font-semibold tracking-tight text-slate-900"
                        >
                            Add office
                        </h2>
                        <p className="mt-0.5 text-xs text-slate-500">
                            Create a new office that users can be assigned to.
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

                {/* Body */}
                <form
                    onSubmit={onSubmit}
                    className="flex min-h-0 flex-1 flex-col"
                >
                    <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5 sm:px-6">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                Name
                            </label>
                            <input
                                type="text"
                                value={form.data.name}
                                onChange={(e) =>
                                    form.setData('name', e.target.value)
                                }
                                placeholder="Human Resource Management Office"
                                className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                            />
                            {form.errors.name && (
                                <p className="mt-1 text-xs text-red-600">
                                    {form.errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                Code
                            </label>
                            <input
                                type="text"
                                value={form.data.code}
                                onChange={(e) =>
                                    form.setData(
                                        'code',
                                        e.target.value.toUpperCase(),
                                    )
                                }
                                placeholder="HRMO"
                                className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm uppercase shadow-sm transition focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                            />
                            <p className="mt-1 text-xs text-slate-400">
                                Short identifier. Cannot be changed after
                                creation.
                            </p>
                            {form.errors.code && (
                                <p className="mt-1 text-xs text-red-600">
                                    {form.errors.code}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50/60 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="rounded-lg bg-gradient-to-br from-blue-700 to-blue-900 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-900/30 transition hover:brightness-110 disabled:opacity-60"
                        >
                            {form.processing ? 'Adding…' : 'Add office'}
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
export default function Index({ offices, filters }) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [modalOpen, setModalOpen] = useState(false);
    const [renamingId, setRenamingId] = useState(null);

    const form = useForm({
        name: '',
        code: '',
    });

    const submitSearch = (e) => {
        e.preventDefault();
        router.get(
            '/admin/offices',
            { search },
            { preserveState: true, replace: true },
        );
    };

    const openCreate = () => {
        form.reset();
        form.clearErrors();
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        form.reset();
        form.clearErrors();
    };

    const submitForm = (e) => {
        e.preventDefault();
        form.post('/admin/offices', {
            preserveScroll: true,
            onSuccess: () => closeModal(),
        });
    };

    return (
        <AdminLayout title="Offices">
            <Head title="Offices" />

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
                        placeholder="Search name or code…"
                        className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                    />
                    <button
                        type="submit"
                        className="shrink-0 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                        Search
                    </button>
                </form>

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
                    Add office
                </button>
            </div>

            {offices.data.length === 0 ? (
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
                            <rect x="4" y="2.5" width="16" height="19" rx="2" />
                            <path d="M9 21.5v-4h6v4" />
                            <path d="M9 7h.01M15 7h.01M9 11h.01M15 11h.01M9 15h.01M15 15h.01" />
                        </svg>
                    </div>
                    <h3 className="mt-4 text-sm font-semibold text-slate-900">
                        No offices found
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                        {search
                            ? 'Try a different search term.'
                            : 'Add your first office to get started.'}
                    </p>
                </div>
            ) : (
                <>
                    {/* ── Desktop table ────────────────────── */}
                    <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
                        <table className="min-w-full">
                            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Code</th>
                                    <th className="px-4 py-3">Users</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {offices.data.map((office) => (
                                    <tr
                                        key={office.id}
                                        className="border-b border-slate-100 last:border-0"
                                    >
                                        <td className="px-4 py-3">
                                            {renamingId === office.id ? (
                                                <RenameField
                                                    office={office}
                                                    onDone={() =>
                                                        setRenamingId(null)
                                                    }
                                                />
                                            ) : (
                                                <p className="text-sm font-medium text-slate-900">
                                                    {office.name}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 font-mono text-sm text-slate-600">
                                            {office.code}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-600">
                                            {office.users_count}
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusPill
                                                active={office.is_active}
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <RowActions
                                                office={office}
                                                onRename={setRenamingId}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* ── Mobile cards ─────────────────────── */}
                    <div className="space-y-3 md:hidden">
                        {offices.data.map((office) => (
                            <div
                                key={office.id}
                                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0 flex-1">
                                        {renamingId === office.id ? (
                                            <RenameField
                                                office={office}
                                                onDone={() =>
                                                    setRenamingId(null)
                                                }
                                            />
                                        ) : (
                                            <p className="truncate text-sm font-semibold text-slate-900">
                                                {office.name}
                                            </p>
                                        )}
                                        <p className="mt-0.5 font-mono text-xs text-slate-500">
                                            {office.code}
                                        </p>
                                    </div>

                                    <StatusPill active={office.is_active} />
                                </div>

                                <div className="mt-3 flex items-center gap-4 border-t border-slate-100 pt-3 text-xs text-slate-500">
                                    <span>
                                        <span className="font-semibold text-slate-700">
                                            {office.users_count}
                                        </span>{' '}
                                        user
                                        {office.users_count === 1 ? '' : 's'}
                                    </span>
                                </div>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setRenamingId(office.id)
                                        }
                                        className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                                    >
                                        Rename
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            router.patch(
                                                `/admin/offices/${office.id}/toggle-active`,
                                                {},
                                                { preserveScroll: true },
                                            )
                                        }
                                        className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                                    >
                                        {office.is_active
                                            ? 'Deactivate'
                                            : 'Activate'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* ── Pagination ──────────────────────────────── */}
            {offices.links && offices.links.length > 3 && (
                <div className="mt-4 flex flex-wrap gap-1">
                    {offices.links.map((link, i) => (
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

            {/* ── Create modal ────────────────────────────── */}
            <OfficeFormModal
                open={modalOpen}
                form={form}
                onSubmit={submitForm}
                onClose={closeModal}
            />
        </AdminLayout>
    );
}