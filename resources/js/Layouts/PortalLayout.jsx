import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

function getInitials(name = '') {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();
}

export default function PortalLayout({
    children,
    title,
    nav = [],
    adminNav = null,
}) {
    const { auth, flash, url } = usePage().props;
    const user = auth?.user;
    const [menuOpen, setMenuOpen] = useState(false);

    const currentPath = (url || '').split('?')[0];
    const isActive = (href) =>
        currentPath === href || currentPath.startsWith(`${href}/`);

    // Full list shown to this user on this page.
    const links = [...nav, ...(adminNav && user?.is_admin ? adminNav : [])];

    const initials = getInitials(user?.name);

    const logout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    // Lock body scroll + close on Escape while the drawer is open.
    useEffect(() => {
        if (!menuOpen) return;

        const onKey = (e) => {
            if (e.key === 'Escape') setMenuOpen(false);
        };

        document.addEventListener('keydown', onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
        };
    }, [menuOpen]);

    // Auto-close the drawer whenever the route changes.
    useEffect(() => {
        setMenuOpen(false);
    }, [url]);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            {/* ── Header ───────────────────────────────────── */}
            <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
                    {/* Brand */}
                    <Link href="/dashboard" className="flex items-center gap-2.5">
                        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-blue-700 to-blue-900 text-sm font-bold text-white shadow-sm shadow-blue-900/20">
                            OP
                        </span>
                        <span className="hidden text-sm font-semibold tracking-tight text-slate-800 sm:block">
                            Opol Portal
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden items-center gap-1 sm:flex">
                        {links.map((item) => {
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                                        active
                                            ? 'bg-blue-50 text-blue-800'
                                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right cluster */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Desktop identity */}
                        <div className="hidden items-center gap-2.5 sm:flex">
                            <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-blue-700 to-blue-900 text-xs font-semibold text-white">
                                {initials || '?'}
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium leading-tight text-slate-800">
                                    {user?.name}
                                </p>
                                <p className="text-xs capitalize leading-tight text-slate-500">
                                    {user?.role}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={logout}
                            className="hidden rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 sm:inline-flex"
                        >
                            Log out
                        </button>

                        {/* Hamburger */}
                        <button
                            type="button"
                            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={menuOpen}
                            aria-controls="mobile-nav"
                            onClick={() => setMenuOpen((v) => !v)}
                            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-300 text-slate-700 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 sm:hidden"
                        >
                            {menuOpen ? (
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
                            ) : (
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
                                    <path d="M4 7h16M4 12h16M4 17h16" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* ── Mobile drawer ────────────────────────────── */}
            {/* Backdrop */}
            <div
                aria-hidden={!menuOpen}
                onClick={() => setMenuOpen(false)}
                className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 sm:hidden ${
                    menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
            />

            {/* Panel */}
            <aside
                id="mobile-nav"
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
                className={`fixed inset-y-0 right-0 z-50 flex w-[85%] max-w-sm transform flex-col bg-white shadow-2xl transition-transform duration-300 ease-out sm:hidden ${
                    menuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Drawer header */}
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                    <Link
                        href="/dashboard"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5"
                    >
                        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-blue-700 to-blue-900 text-sm font-bold text-white">
                            OP
                        </span>
                        <span className="text-sm font-semibold tracking-tight text-slate-800">
                            Opol Portal
                        </span>
                    </Link>

                    <button
                        type="button"
                        aria-label="Close menu"
                        onClick={() => setMenuOpen(false)}
                        className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
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

                {/* User card */}
                <div className="border-b border-slate-200 px-5 py-4">
                    <div className="flex items-center gap-3">
                        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-700 to-blue-900 text-sm font-semibold text-white">
                            {initials || '?'}
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">
                                {user?.name}
                            </p>
                            <p className="truncate text-xs capitalize text-slate-500">
                                {user?.role}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Nav links */}
                <nav className="flex-1 overflow-y-auto px-3 py-4">
                    <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                        Menu
                    </p>
                    <ul className="space-y-1">
                        {links.map((item) => {
                            const active = isActive(item.href);
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={() => setMenuOpen(false)}
                                        className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                                            active
                                                ? 'bg-blue-50 text-blue-800'
                                                : 'text-slate-700 hover:bg-slate-100'
                                        }`}
                                    >
                                        <span>{item.label}</span>
                                        {active && (
                                            <span
                                                aria-hidden="true"
                                                className="h-1.5 w-1.5 rounded-full bg-blue-700"
                                            />
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Footer / logout */}
                <div className="border-t border-slate-200 p-3">
                    <button
                        type="button"
                        onClick={logout}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
                    >
                        Log out
                    </button>
                </div>
            </aside>

            {/* ── Main ─────────────────────────────────────── */}
            <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
                {title && (
                    <h1 className="mb-6 text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                        {title}
                    </h1>
                )}

                {flash?.success && (
                    <div
                        role="status"
                        className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span>{flash.success}</span>
                    </div>
                )}

                {flash?.error && (
                    <div
                        role="alert"
                        className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            className="mt-0.5 h-5 w-5 shrink-0 text-red-600"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span>{flash.error}</span>
                    </div>
                )}

                {children}
            </main>
        </div>
    );
}