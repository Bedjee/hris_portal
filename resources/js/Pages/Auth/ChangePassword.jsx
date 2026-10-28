import { Head, router, useForm } from '@inertiajs/react';

export default function ChangePassword({ forced, warning }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post('/password/change', {
            onFinish: () => reset('current_password', 'password', 'password_confirmation'),
        });
    };

    const logout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <>
            <Head title="Change password" />

            <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
                <div className="w-full max-w-md">
                    <div className="mb-6 text-center">
                        <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl bg-blue-700 text-base font-bold text-white">
                            OP
                        </div>
                        <h1 className="text-xl font-semibold tracking-tight text-slate-900">
                            {forced ? 'Set your password' : 'Change password'}
                        </h1>
                        {forced && (
                            <p className="mt-1 text-sm text-slate-500">
                                Your account was created with a temporary password.
                                Choose a new one to continue.
                            </p>
                        )}
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                        {warning && (
                            <div className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                                {warning}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-4" noValidate>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                    Current password
                                </label>
                                <input
                                    type="password"
                                    autoComplete="current-password"
                                    value={data.current_password}
                                    onChange={(e) => setData('current_password', e.target.value)}
                                    className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-600 focus:ring-blue-600"
                                />
                                {errors.current_password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.current_password}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                    New password
                                </label>
                                <input
                                    type="password"
                                    autoComplete="new-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-600 focus:ring-blue-600"
                                />
                                <p className="mt-1 text-xs text-slate-500">
                                    At least 8 characters, including letters and numbers.
                                </p>
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-slate-700">
                                    Confirm new password
                                </label>
                                <input
                                    type="password"
                                    autoComplete="new-password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-600 focus:ring-blue-600"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-md bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:opacity-60"
                            >
                                {processing ? 'Saving…' : 'Save password'}
                            </button>
                        </form>

                        {!forced && (
                            <button
                                type="button"
                                onClick={logout}
                                className="mt-4 w-full text-center text-xs text-slate-500 hover:text-slate-700"
                            >
                                Log out instead
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}