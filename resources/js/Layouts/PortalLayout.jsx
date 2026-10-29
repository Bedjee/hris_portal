import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

// ─────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────
const Icon = ({ path, className = 'h-5 w-5', strokeWidth = 1.8 }) => (
    <svg
        className={className}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        {path}
    </svg>
);

const HomeIcon = (p) => <Icon {...p} path={<><path d="M3 9.5 12 3l9 6.5V21a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1V9.5Z" /></>} />;
const BriefcaseIcon = (p) => <Icon {...p} path={<><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></>} />;
const BellIcon = (p) => <Icon {...p} path={<><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></>} />;
const UserIcon = (p) => <Icon {...p} path={<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>} />;
const UsersIcon = (p) => <Icon {...p} path={<><path d="M16 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="9.5" cy="7" r="3.5" /><path d="M21 20v-2a4 4 0 0 0-3-3.87" /><path d="M15.5 3.13a3.5 3.5 0 0 1 0 6.74" /></>} />;
const ShieldCheckIcon = (p) => <Icon {...p} path={<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></>} />;
const MenuIcon = (p) => <Icon {...p} strokeWidth={2} path={<><path d="M4 7h16M4 12h16M4 17h16" /></>} />;
const XIcon = (p) => <Icon {...p} strokeWidth={2} path={<><path d="M6 6l12 12M18 6L6 18" /></>} />;
const LogOutIcon = (p) => <Icon {...p} path={<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>} />;

export const BottomNavIcons = {
    home: HomeIcon,
    applications: BriefcaseIcon,
    notices: BellIcon,
    profile: UserIcon,
    users: UsersIcon,
    audit: ShieldCheckIcon,
};

function getInitials(name = '') {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();
}

// ─────────────────────────────────────────────────────────────
// Logout confirmation modal
// ─────────────────────────────────────────────────────────────
function LogoutConfirmModal({ open, onClose, onConfirm }) {
    const cardRef = useRef(null);
    const cancelRef = useRef(null);
    const previousFocus = useRef(null);

    useEffect(() => {
        if (!open) return;

        previousFocus.current = document.activeElement;

        // Prevent background scroll
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        // Autofocus "Cancel" — safer than focusing the destructive action
        const t = setTimeout(() => cancelRef.current?.focus(), 30);

        const onKey = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
                return;
            }

            // Minimal focus trap: keep Tab cycling inside the dialog
            if (e.key === 'Tab') {
                const focusables = cardRef.current?.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
                );
                if (!focusables || focusables.length === 0) return;
                const first = focusables[0];
                const last = focusables[focusables.length - 1];

                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        document.addEventListener('keydown', onKey);

        return () => {
            clearTimeout(t);
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
            if (previousFocus.current instanceof HTMLElement) {
                previousFocus.current.focus();
            }
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-confirm-title"
            aria-describedby="logout-confirm-desc"
            className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center"
        >
            {/* Backdrop */}
            <div
                aria-hidden="true"
                onClick={onClose}
                className="animate-fade-in absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
            />

            {/* Card — bottom sheet on mobile, centered dialog on desktop */}
            <div
                ref={cardRef}
                className="animate-modal-in relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl ring-1 ring-slate-200 sm:max-w-md sm:p-7"
            >
                {/* Drag handle (mobile only) */}
                <div
                    aria-hidden="true"
                    className="mx-auto mb-4 h-1 w-10 rounded-full bg-slate-200 sm:hidden"
                />

                <div className="flex items-start gap-3.5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                        <LogOutIcon className="h-5 w-5" strokeWidth={2} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h2
                            id="logout-confirm-title"
                            className="text-base font-semibold tracking-tight text-slate-900"
                        >
                            Log out of your account?
                        </h2>
                        <p
                            id="logout-confirm-desc"
                            className="mt-1.5 text-sm leading-relaxed text-slate-600"
                        >
                            You&rsquo;ll need to sign in again to access the HRMO Portal.
                            Any unsaved changes will be lost.
                        </p>
                    </div>
                </div>

                <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <button
                        ref={cancelRef}
                        type="button"
                        onClick={onClose}
                        className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-red-600/25 transition hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2"
                    >
                        <LogOutIcon className="h-4 w-4" />
                        Yes, log out
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────
// Mobile bottom navigation
// ─────────────────────────────────────────────────────────────
function MobileBottomNav({ items, isActive, onMenuClick }) {
    const total = items.length + 1;

    return (
        <nav
            aria-label="Primary navigation"
            className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 shadow-[0_-1px_4px_rgba(0,0,0,0.05)] backdrop-blur-md sm:hidden"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
            <ul
                className="grid"
                style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}
            >
                {items.map((item) => {
                    const active = isActive(item.href);
                    const IconCmp = item.icon;

                    return (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                aria-current={active ? 'page' : undefined}
                                className={`flex flex-col items-center justify-center gap-0.5 px-1 py-2 text-[10px] font-semibold transition-colors ${
                                    active
                                        ? 'text-blue-700'
                                        : 'text-slate-500 hover:text-slate-800'
                                }`}
                            >
                                <span className="relative">
                                    <IconCmp
                                        className="h-5 w-5"
                                        strokeWidth={active ? 2.2 : 1.8}
                                    />
                                    {item.badge > 0 && (
                                        <span className="absolute -right-2 -top-1.5 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold leading-none text-white ring-2 ring-white">
                                            {item.badge > 9 ? '9+' : item.badge}
                                        </span>
                                    )}
                                </span>
                                <span className="w-full truncate text-center">{item.label}</span>
                            </Link>
                        </li>
                    );
                })}

                <li>
                    <button
                        type="button"
                        onClick={onMenuClick}
                        aria-label="Open menu"
                        className="flex w-full flex-col items-center justify-center gap-0.5 px-1 py-2 text-[10px] font-semibold text-slate-500 transition-colors hover:text-slate-800"
                    >
                        <MenuIcon className="h-5 w-5" />
                        <span className="w-full truncate text-center">Menu</span>
                    </button>
                </li>
            </ul>
        </nav>
    );
}

// ─────────────────────────────────────────────────────────────
// PortalLayout
// ─────────────────────────────────────────────────────────────
export default function PortalLayout({
    children,
    title,
    nav = [],
    adminNav = null,
    bottomNav = [],
    adminBottomNav = null,
}) {
    const { auth, flash, url } = usePage().props;
    const user = auth?.user;
    const [menuOpen, setMenuOpen] = useState(false);
    const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

    const currentPath = (url || '').split('?')[0];
    const isActive = (href) =>
        currentPath === href || currentPath.startsWith(`${href}/`);

    const links = [...nav, ...(adminNav && user?.is_admin ? adminNav : [])];
    const effectiveBottomNav =
        adminBottomNav && user?.is_admin ? adminBottomNav : bottomNav;
    const showBottomNav = effectiveBottomNav.length > 0;

    const initials = getInitials(user?.name);

    // Open the modal instead of logging out immediately
    const requestLogout = () => {
        setMenuOpen(false); // close the drawer behind the modal
        setLogoutConfirmOpen(true);
    };

    // Actual logout — only runs when the user confirms
    const confirmLogout = () => {
        setLogoutConfirmOpen(false);
        router.post('/logout');
    };

    // Drawer: lock body scroll + close on Escape
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

    // Auto-close the drawer whenever the route changes
    useEffect(() => {
        setMenuOpen(false);
    }, [url]);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            {/* ── Header ───────────────────────────────────── */}
            <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
                    <Link href="/dashboard" className="flex items-center gap-2.5">
                        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-blue-700 to-blue-900 text-sm font-bold text-white shadow-sm shadow-blue-900/20">
                            OP
                        </span>
                        <span className="hidden text-sm font-semibold tracking-tight text-slate-800 sm:block">
                            Opol Portal
                        </span>
                    </Link>

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

                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex items-center gap-2.5">
                            <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-blue-700 to-blue-900 text-xs font-semibold text-white">
                                {initials || '?'}
                            </div>
                            <div className="hidden text-right sm:block">
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
                            onClick={requestLogout}
                            className="hidden rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 sm:inline-flex"
                        >
                            Log out
                        </button>

                        {!showBottomNav && (
                            <button
                                type="button"
                                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                                aria-expanded={menuOpen}
                                aria-controls="mobile-nav"
                                onClick={() => setMenuOpen((v) => !v)}
                                className="grid h-9 w-9 place-items-center rounded-lg border border-slate-300 text-slate-700 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2 sm:hidden"
                            >
                                {menuOpen ? <XIcon /> : <MenuIcon />}
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* ── Mobile drawer ────────────────────────────── */}
            <div
                aria-hidden={!menuOpen}
                onClick={() => setMenuOpen(false)}
                className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 sm:hidden ${
                    menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
            />

            <aside
                id="mobile-nav"
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
                className={`fixed inset-y-0 right-0 z-50 flex w-[85%] max-w-sm transform flex-col bg-white shadow-2xl transition-transform duration-300 ease-out sm:hidden ${
                    menuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
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
                        <XIcon />
                    </button>
                </div>

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

                <div className="border-t border-slate-200 p-3">
                    <button
                        type="button"
                        onClick={requestLogout}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
                    >
                        Log out
                    </button>
                </div>
            </aside>

            {/* ── Main ─────────────────────────────────────── */}
            <main
                className={`mx-auto max-w-6xl px-4 pt-6 sm:px-6 sm:pt-8 ${
                    showBottomNav ? 'pb-24 sm:pb-8' : 'pb-6 sm:pb-8'
                }`}
            >
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

            {showBottomNav && (
                <MobileBottomNav
                    items={effectiveBottomNav}
                    isActive={isActive}
                    onMenuClick={() => setMenuOpen(true)}
                />
            )}

            {/* ── Logout confirmation modal ────────────────── */}
            <LogoutConfirmModal
                open={logoutConfirmOpen}
                onClose={() => setLogoutConfirmOpen(false)}
                onConfirm={confirmLogout}
            />

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                @keyframes modalIn {
                    from { opacity: 0; transform: translateY(12px) scale(0.98); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-fade-in  { animation: fadeIn 150ms ease-out both; }
                .animate-modal-in { animation: modalIn 200ms cubic-bezier(0.16, 1, 0.3, 1) both; }

                @media (prefers-reduced-motion: reduce) {
                    .animate-fade-in,
                    .animate-modal-in { animation: none; }
                }
            `}</style>
        </div>
    );
}