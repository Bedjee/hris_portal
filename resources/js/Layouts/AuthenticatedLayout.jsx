import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const ADMIN_LINKS = [
    { href: '/admin/users',        label: 'Users' },
    { href: '/admin/applications', label: 'Applications' },
    { href: '/admin/audit-logs',   label: 'Audit' },
];

export default function AuthenticatedLayout({ children, title }) {
    const { auth, flash } = usePage().props;
    const user = auth?.user;
    const [menuOpen, setMenuOpen] = useState(false);

    const logout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-700 text-sm font-bold text-white">
                            OP
                        </span>
                        <span className="hidden text-sm font-semibold tracking-tight text-slate-800 sm:block">
                            Opol Portal
                        </span>
                    </Link>

                    <nav className="hidden items-center gap-6 sm:flex">
                        <Link
                            href="/dashboard"
                            className="text-sm font-medium text-slate-600 hover:text-blue-700"
                        >
                            Dashboard
                        </Link>

                        {user?.is_admin &&
                            ADMIN_LINKS.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-sm font-medium text-slate-600 hover:text-blue-700"
                                >
                                    {link.label}
                                </Link>
                            ))}
                    </nav>

                    <div className="flex items-center gap-3">
                        <div className="hidden text-right sm:block">
                            <p className="text-sm font-medium leading-tight">{user?.name}</p>
                            <p className="text-xs capitalize leading-tight text-slate-500">
                                {user?.role}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={logout}
                            className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                            Log out
                        </button>

                        <button
                            type="button"
                            aria-label="Toggle menu"
                            onClick={() => setMenuOpen((v) => !v)}
                            className="grid h-9 w-9 place-items-center rounded-md border border-slate-300 sm:hidden"
                        >
                            <span className="text-lg leading-none">≡</span>
                        </button>
                    </div>
                </div>

                {menuOpen && (
                    <div className="border-t border-slate-200 bg-white px-4 py-3 sm:hidden">
                        <Link href="/dashboard" className="block py-2 text-sm font-medium">
                            Dashboard
                        </Link>

                        {user?.is_admin &&
                            ADMIN_LINKS.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="block py-2 text-sm font-medium"
                                >
                                    {link.label}
                                </Link>
                            ))}
                    </div>
                )}
            </header>

            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
                {title && (
                    <h1 className="mb-6 text-xl font-semibold tracking-tight text-slate-900">
                        {title}
                    </h1>
                )}

                {flash?.success && (
                    <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                        {flash.error}
                    </div>
                )}

                {children}
            </main>
        </div>
    );
}