import { Head, router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AdminLayout from '../../../Layouts/AdminLayout';
import AppIcon, { ICON_KEYS } from '../../../Components/AppIcon';

// ─────────────────────────────────────────────────────────────
// Icon picker
// ─────────────────────────────────────────────────────────────
function IconPicker({ value, onChange }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
            <div className="grid grid-cols-6 gap-1.5 sm:grid-cols-8 md:grid-cols-10">
                {ICON_KEYS.map((key) => {
                    const selected = value === key;
                    return (
                        <button
                            key={key}
                            type="button"
                            onClick={() => onChange(key)}
                            title={key}
                            aria-label={key}
                            aria-pressed={selected}
                            className={`flex aspect-square items-center justify-center rounded-lg border transition ${
                                selected
                                    ? 'border-blue-700 bg-white text-blue-800 ring-2 ring-blue-700 ring-offset-1 ring-offset-slate-50'
                                    : 'border-transparent bg-white text-slate-500 hover:border-slate-300 hover:text-slate-900'
                            }`}
                        >
                            <AppIcon name={key} className="h-5 w-5" />
                        </button>
                    );
                })}
            </div>

            <p className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                <span>Selected:</span>
                <span className="inline-flex items-center gap-1.5 rounded-md bg-white px-2 py-0.5 font-medium text-slate-700 ring-1 ring-inset ring-slate-200">
                    <AppIcon name={value} className="h-3.5 w-3.5 text-blue-800" />
                    {value}
                </span>
            </p>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// Credentials banner — shown once after SSO is enabled
// ─────────────────────────────────────────────────────────────
function CredentialsBanner({ credentials }) {
    if (!credentials) return null;

    const copy = (value) => navigator.clipboard.writeText(value);

    return (
        <div className="mb-5 rounded-xl border border-amber-300 bg-amber-50 p-4 sm:p-5">
            <h3 className="mb-2 text-sm font-semibold text-amber-900">
                SSO enabled for {credentials.application}
            </h3>
            <p className="mb-3 text-xs text-amber-800">
                <strong>Copy these credentials now.</strong> The client secret is
                shown only once and cannot be retrieved later.
            </p>

            <dl className="space-y-2 text-xs">
                {[
                    ['Client ID', credentials.client_id],
                    ['Client Secret', credentials.client_secret],
                    ['Redirect URI', credentials.redirect_uri],
                    ['SSO Initiator URL', credentials.sso_initiate_url],
                ].map(([label, value]) => (
                    <div
                        key={label}
                        className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-3"
                    >
                        <dt className="shrink-0 font-medium text-amber-900 sm:w-32">
                            {label}
                        </dt>
                        <dd className="flex-1">
                            <code className="block break-all rounded bg-white px-2 py-1 font-mono text-amber-900">
                                {value}
                            </code>
                        </dd>
                        <button
                            type="button"
                            onClick={() => copy(String(value))}
                            className="self-start rounded-lg border border-amber-300 px-2 py-1 text-xs font-medium text-amber-900 transition hover:bg-amber-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-2 focus-visible:ring-offset-amber-50"
                        >
                            Copy
                        </button>
                    </div>
                ))}
            </dl>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// Shared modal shell
// ─────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, description, children, size = 'md' }) {
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

    const maxWidth =
        size === 'lg' ? 'sm:max-w-3xl' : size === 'sm' ? 'sm:max-w-md' : 'sm:max-w-2xl';

    return (
        <div
            className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div
                onClick={onClose}
                className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                aria-hidden="true"
            />

            <div
                className={`relative flex max-h-[92vh] w-full ${maxWidth} flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-h-[88vh] sm:rounded-2xl`}
            >
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6">
                    <div className="min-w-0">
                        <h2
                            id="modal-title"
                            className="text-base font-semibold tracking-tight text-slate-900"
                        >
                            {title}
                        </h2>
                        {description && (
                            <p className="mt-0.5 text-xs text-slate-500">
                                {description}
                            </p>
                        )}
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

                {children}
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// Application create/edit modal
// ─────────────────────────────────────────────────────────────
function ApplicationFormModal({
    open,
    editing,
    form,
    onSubmit,
    onClose,
}) {
    if (!open) return null;

    const textFields = [
        ['name', 'Name', 'text'],
        ['slug', 'Slug', 'text'],
        ['url', 'URL', 'url'],
        ['sort_order', 'Sort order', 'number'],
    ];

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={editing ? `Edit ${editing.name}` : 'Register application'}
            description={
                editing
                    ? 'Update application details and appearance.'
                    : 'Add a new application to the portal.'
            }
            size="lg"
        >
            <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
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

                        <div className="sm:col-span-2">
                            <label className="mb-1 block text-sm font-medium text-slate-700">
                                Description
                            </label>
                            <textarea
                                rows={2}
                                value={form.data.description}
                                onChange={(e) =>
                                    form.setData(
                                        'description',
                                        e.target.value,
                                    )
                                }
                                className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                            />
                            {form.errors.description && (
                                <p className="mt-1 text-xs text-red-600">
                                    {form.errors.description}
                                </p>
                            )}
                        </div>

                        <div className="sm:col-span-2">
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Icon
                            </label>
                            <IconPicker
                                value={form.data.icon}
                                onChange={(key) => form.setData('icon', key)}
                            />
                            {form.errors.icon && (
                                <p className="mt-1 text-xs text-red-600">
                                    {form.errors.icon}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

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
                        {form.processing
                            ? editing
                                ? 'Saving…'
                                : 'Creating…'
                            : editing
                              ? 'Save changes'
                              : 'Create application'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

// ─────────────────────────────────────────────────────────────
// SSO enable modal
// ─────────────────────────────────────────────────────────────
function SsoModal({ open, target, form, onSubmit, onClose }) {
    if (!open || !target) return null;

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={`Enable SSO — ${target.name}`}
            description="Provide the endpoints the client app will use during the SSO handshake."
        >
            <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-5 sm:px-6">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            Redirect URI
                        </label>
                        <input
                            type="url"
                            value={form.data.redirect_uri}
                            onChange={(e) =>
                                form.setData('redirect_uri', e.target.value)
                            }
                            placeholder="https://ileave.opolhrmo.com/auth/callback"
                            className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                        />
                        <p className="mt-1 text-xs text-slate-500">
                            Where {target.name} receives the authorization code.
                            Must match the value in the client app&rsquo;s .env
                            exactly.
                        </p>
                        {form.errors.redirect_uri && (
                            <p className="mt-1 text-xs text-red-600">
                                {form.errors.redirect_uri}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-slate-700">
                            SSO Initiator URL
                        </label>
                        <input
                            type="url"
                            value={form.data.sso_initiate_url}
                            onChange={(e) =>
                                form.setData(
                                    'sso_initiate_url',
                                    e.target.value,
                                )
                            }
                            placeholder="https://ileave.opolhrmo.com/auth/redirect"
                            className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                        />
                        <p className="mt-1 text-xs text-slate-500">
                            Where the portal sends the user when they click Open
                            on the dashboard. This URL kicks off the SSO
                            handshake.
                        </p>
                        {form.errors.sso_initiate_url && (
                            <p className="mt-1 text-xs text-red-600">
                                {form.errors.sso_initiate_url}
                            </p>
                        )}
                    </div>
                </div>

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
                        {form.processing ? 'Enabling…' : 'Enable SSO'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}

// ─────────────────────────────────────────────────────────────
// Status + SSO pills
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

function SsoPill({ enabled }) {
    if (!enabled) {
        return <span className="text-xs text-slate-400">—</span>;
    }
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-800 ring-1 ring-inset ring-blue-100">
            <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-blue-700"
            />
            Enabled
        </span>
    );
}

// ─────────────────────────────────────────────────────────────
// Action buttons
// ─────────────────────────────────────────────────────────────
function RowActions({ app, onEdit, onEnableSso, onDisableSso }) {
    const cls =
        'rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100';

    return (
        <div className="flex flex-wrap justify-end gap-2">
            <button type="button" onClick={() => onEdit(app)} className={cls}>
                Edit
            </button>
            {app.sso_enabled ? (
                <button
                    type="button"
                    onClick={() => onDisableSso(app)}
                    className="rounded-lg border border-red-300 bg-white px-2.5 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-50"
                >
                    Disable SSO
                </button>
            ) : (
                <button
                    type="button"
                    onClick={() => onEnableSso(app)}
                    className="rounded-lg border border-blue-300 bg-white px-2.5 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-50"
                >
                    Enable SSO
                </button>
            )}
            <button
                type="button"
                onClick={() =>
                    router.patch(
                        `/admin/applications/${app.slug}/toggle-active`,
                        {},
                        { preserveScroll: true },
                    )
                }
                className={cls}
            >
                {app.is_active ? 'Disable' : 'Enable'}
            </button>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────
export default function Index({ applications, sso_credentials: ssoCredentials }) {
    const [editing, setEditing] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [ssoTarget, setSsoTarget] = useState(null);

    const form = useForm({
        name: '',
        slug: '',
        description: '',
        url: '',
        icon: 'document',
        sort_order: 0,
        is_active: true,
    });

    const ssoForm = useForm({
        redirect_uri: '',
        sso_initiate_url: '',
    });

    // ── Application modal ──────────────────────────────
    const openCreate = () => {
        setEditing(null);
        form.reset();
        form.clearErrors();
        setModalOpen(true);
    };

    const openEdit = (app) => {
        setEditing(app);
        form.setData({
            name: app.name,
            slug: app.slug,
            description: app.description ?? '',
            url: app.url,
            icon: app.icon ?? 'document',
            sort_order: app.sort_order,
            is_active: app.is_active,
        });
        form.clearErrors();
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditing(null);
        form.reset();
        form.clearErrors();
    };

    const submit = (e) => {
        e.preventDefault();
        const url = editing
            ? `/admin/applications/${editing.slug}`
            : '/admin/applications';
        const method = editing ? 'put' : 'post';

        form[method](url, {
            preserveScroll: true,
            onSuccess: () => closeModal(),
        });
    };

    // ── SSO modal ──────────────────────────────────────
    const openSso = (app) => {
        setSsoTarget(app);
        ssoForm.setData({
            redirect_uri: app.redirect_uri ?? '',
            sso_initiate_url: app.sso_initiate_url ?? '',
        });
        ssoForm.clearErrors();
    };

    const closeSso = () => {
        setSsoTarget(null);
        ssoForm.reset();
        ssoForm.clearErrors();
    };

    const submitSso = (e) => {
        e.preventDefault();
        ssoForm.post(`/admin/applications/${ssoTarget.slug}/sso`, {
            preserveScroll: true,
            onSuccess: () => closeSso(),
        });
    };

    const disableSso = (app) => {
        if (!confirm(`Disable SSO for ${app.name}?`)) return;
        router.delete(`/admin/applications/${app.slug}/sso`, {
            preserveScroll: true,
        });
    };

    const rows = applications.data ?? [];

    return (
        <AdminLayout title="Applications">
            <Head title="Applications" />

            <CredentialsBanner credentials={ssoCredentials} />

            {/* ── Toolbar ─────────────────────────────────── */}
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">
                    {rows.length === 0
                        ? 'No applications registered yet.'
                        : `${rows.length} application${rows.length === 1 ? '' : 's'} registered.`}
                </p>

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
                    Register application
                </button>
            </div>

            {rows.length === 0 ? (
                /* ── Empty state ─────────────────────────── */
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
                    <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-blue-700 to-blue-900 text-white shadow-sm shadow-blue-900/25">
                        <AppIcon name="box" className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 text-sm font-semibold text-slate-900">
                        No applications yet
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                        Register your first application to make it available on
                        the dashboard.
                    </p>
                </div>
            ) : (
                <>
                    {/* ── Desktop table ────────────────────── */}
                    <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
                        <table className="min-w-full">
                            <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">Application</th>
                                    <th className="px-4 py-3">Slug</th>
                                    <th className="px-4 py-3">Users</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">SSO</th>
                                    <th className="px-4 py-3 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((app) => (
                                    <tr
                                        key={app.id}
                                        className="border-b border-slate-100 last:border-0"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-blue-700 to-blue-900 text-white">
                                                    <AppIcon
                                                        name={app.icon}
                                                        className="h-4 w-4"
                                                    />
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-slate-900">
                                                        {app.name}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {app.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-mono text-sm text-slate-600">
                                            {app.slug}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-600">
                                            {app.users_count}
                                        </td>
                                        <td className="px-4 py-3">
                                            <StatusPill
                                                active={app.is_active}
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <SsoPill
                                                enabled={app.sso_enabled}
                                            />
                                            {app.sso_enabled &&
                                                app.redirect_uri && (
                                                    <p className="mt-1 max-w-xs truncate font-mono text-xs text-slate-500">
                                                        {app.redirect_uri}
                                                    </p>
                                                )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <RowActions
                                                app={app}
                                                onEdit={openEdit}
                                                onEnableSso={openSso}
                                                onDisableSso={disableSso}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* ── Mobile cards ─────────────────────── */}
                    <div className="space-y-3 md:hidden">
                        {rows.map((app) => (
                            <div
                                key={app.id}
                                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                            >
                                <div className="flex items-start gap-3">
                                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-700 to-blue-900 text-white shadow-sm shadow-blue-900/25">
                                        <AppIcon
                                            name={app.icon}
                                            className="h-5 w-5"
                                        />
                                    </span>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-slate-900">
                                            {app.name}
                                        </p>
                                        <p className="truncate font-mono text-xs text-slate-500">
                                            {app.slug}
                                        </p>
                                    </div>
                                    <StatusPill active={app.is_active} />
                                </div>

                                {app.description && (
                                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-500">
                                        {app.description}
                                    </p>
                                )}

                                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-slate-100 pt-3 text-xs text-slate-500">
                                    <span>
                                        <span className="font-semibold text-slate-700">
                                            {app.users_count}
                                        </span>{' '}
                                        user
                                        {app.users_count === 1 ? '' : 's'}
                                    </span>
                                    <span aria-hidden="true">•</span>
                                    <span className="inline-flex items-center gap-1.5">
                                        SSO{' '}
                                        <SsoPill
                                            enabled={app.sso_enabled}
                                        />
                                    </span>
                                </div>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={() => openEdit(app)}
                                        className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                                    >
                                        Edit
                                    </button>
                                    {app.sso_enabled ? (
                                        <button
                                            type="button"
                                            onClick={() => disableSso(app)}
                                            className="flex-1 rounded-lg border border-red-300 bg-white px-3 py-2 text-xs font-medium text-red-700 transition hover:bg-red-50"
                                        >
                                            Disable SSO
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => openSso(app)}
                                            className="flex-1 rounded-lg border border-blue-300 bg-white px-3 py-2 text-xs font-medium text-blue-700 transition hover:bg-blue-50"
                                        >
                                            Enable SSO
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            router.patch(
                                                `/admin/applications/${app.slug}/toggle-active`,
                                                {},
                                                { preserveScroll: true },
                                            )
                                        }
                                        className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
                                    >
                                        {app.is_active ? 'Disable' : 'Enable'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* ── Modals ──────────────────────────────────── */}
            <ApplicationFormModal
                open={modalOpen}
                editing={editing}
                form={form}
                onSubmit={submit}
                onClose={closeModal}
            />

            <SsoModal
                open={!!ssoTarget}
                target={ssoTarget}
                form={ssoForm}
                onSubmit={submitSso}
                onClose={closeSso}
            />
        </AdminLayout>
    );
}