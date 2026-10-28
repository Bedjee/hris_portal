import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';

export default function Import({
    offices,
    roles,
    employment_statuses: employmentStatuses,
    defaultPassword,
}) {
    const form = useForm({ file: null });

    const submit = (e) => {
        e.preventDefault();
        form.post('/admin/users/import', {
            forceFormData: true,
        });
    };

    const fileErrors = Array.isArray(form.errors.file)
        ? form.errors.file
        : form.errors.file
        ? [form.errors.file]
        : [];

    const statusKeys = Object.keys(employmentStatuses);

    return (
        <AdminLayout title="Import Users">
            <Head title="Import Users" />

            <div className="mb-6">
                <Link
                    href="/admin/users"
                    className="text-sm font-medium text-blue-700 hover:underline"
                >
                    ← Back to users
                </Link>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-1 text-base font-semibold">Upload CSV</h2>
                <p className="mb-4 text-sm text-slate-500">
                    Import multiple users at once. Usernames are generated from the full
                    name. Each imported user is given the default password{' '}
                    <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs">
                        {defaultPassword}
                    </code>{' '}
                    and is required to change it on first login.
                </p>

                <form onSubmit={submit} className="space-y-4">
                    <input
                        type="file"
                        accept=".csv,.txt"
                        onChange={(e) => form.setData('file', e.target.files[0] ?? null)}
                        className="block w-full rounded-md border border-slate-300 p-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-blue-700 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-blue-800"
                    />
                    {form.errors.file && !Array.isArray(form.errors.file) && (
                        <p className="text-sm text-red-600">{form.errors.file}</p>
                    )}

                    {fileErrors.length > 0 && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                            <p className="mb-2 text-sm font-medium text-red-800">
                                Fix these issues and re-upload:
                            </p>
                            <ul className="space-y-1 text-xs text-red-700">
                                {fileErrors.map((err, i) => (
                                    <li key={i} className="font-mono">
                                        {err}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={form.processing || !form.data.file}
                        className="rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
                    >
                        {form.processing ? 'Importing…' : 'Import users'}
                    </button>
                </form>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                        Required format
                    </h3>
                    <p className="mb-3 text-sm text-slate-600">
                        CSV with a header row. Columns in any order, but all four must be
                        present:
                    </p>
                    <pre className="overflow-x-auto rounded-md bg-slate-900 p-3 text-xs text-slate-100">
{`name,department,role,employment_status
Juan Dela Cruz Santos,HRMO,user,regular
Maria Reyes,MO,admin,job_order`}
                    </pre>
                    <ul className="mt-3 space-y-1 text-xs text-slate-500">
                        <li>
                            • <strong>name</strong> — full name, as displayed
                        </li>
                        <li>
                            • <strong>department</strong> — office code
                        </li>
                        <li>
                            • <strong>role</strong> — one of: {roles.join(', ')}
                        </li>
                        <li>
                            • <strong>employment_status</strong> — one of:{' '}
                            {statusKeys.join(', ')}
                        </li>
                    </ul>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                        Active office codes
                    </h3>
                    {offices.length === 0 ? (
                        <p className="text-sm text-slate-500">
                            No active offices. Add some before importing.
                        </p>
                    ) : (
                        <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                            {offices.map((o) => (
                                <li key={o.id} className="text-slate-700">
                                    <code className="font-mono text-xs font-semibold">
                                        {o.code}
                                    </code>{' '}
                                    — {o.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}