import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { PortalExitOverlay } from '@/Components/PortalTransition';
import { consumePortalTransition } from '@/lib/portalTransition';

// --- Inline SVG Icons (matching Welcome) ---
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

const UserIcon = (p) => <Icon {...p} path={<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>} />;
const LockIcon = (p) => <Icon {...p} path={<><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>} />;
const EyeIcon = (p) => <Icon {...p} path={<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>} />;
const EyeOffIcon = (p) => <Icon {...p} path={<><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>} />;
const ShieldCheckIcon = (p) => <Icon {...p} path={<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></>} />;
const ArrowRightIcon = (p) => <Icon {...p} strokeWidth={2.5} path={<><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>} />;
const ArrowLeftIcon = (p) => <Icon {...p} strokeWidth={2.2} path={<><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></>} />;
const MailIcon = (p) => <Icon {...p} path={<><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 6-10 7L2 6" /></>} />;

// --- Logo (identical to Welcome) ---
const Logo = ({ compact = false }) => (
    <div className="flex items-center gap-2.5 sm:gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[22px] bg-white p-1.5 shadow-md shadow-blue-900/10 ring-1 ring-slate-200 sm:h-11 sm:w-11 sm:rounded-[24px] sm:p-2">
            <img src="/images/hrlogo.png" alt="" draggable={false} className="h-full w-full object-contain" />
        </div>
        <div className="flex min-w-0 flex-col">
            <span className="whitespace-nowrap text-base font-extrabold leading-tight tracking-tight text-slate-900 sm:text-lg">
                HRMO <span className="text-blue-600">Portal</span>
            </span>
            {!compact && (
                <span className="hidden whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-500 sm:block">
                    Human Resource Management Office
                </span>
            )}
        </div>
    </div>
);

// --- Main Page ---
export default function Login({ status, errors = {} }) {
    const [showExitFlash, setShowExitFlash] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [csrfToken, setCsrfToken] = useState('');

    // Read CSRF token from the meta tag rendered by Blade.
    useEffect(() => {
        const meta = document.querySelector('meta[name="csrf-token"]');
        setCsrfToken(meta?.getAttribute('content') ?? '');
    }, []);

    // Preserved: exit flash plays only when arriving from the Welcome gateway
    useEffect(() => {
        if (consumePortalTransition()) {
            setShowExitFlash(true);
            const t = setTimeout(() => setShowExitFlash(false), 780);
            return () => clearTimeout(t);
        }
    }, []);

    // Native form submit — do NOT preventDefault.
    // The browser performs a real navigation, so all redirects (including
    // the cross-origin redirect to the SSO client) are followed natively.
    const handleSubmit = () => {
        setSubmitting(true);
    };

    return (
        <>
            <Head title="Log In · HRMO Portal" />

            <div className="relative min-h-screen w-full overflow-x-hidden bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
                {/* ── Ambient background — identical to Welcome ────── */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none fixed -right-32 -top-32 z-0 h-96 w-96 rounded-full bg-blue-100/50 blur-3xl"
                />
                <div
                    aria-hidden="true"
                    className="pointer-events-none fixed -bottom-40 -left-24 z-0 h-[28rem] w-[28rem] rounded-full bg-sky-100/50 blur-3xl"
                />

                <div className="relative z-10 flex flex-col min-h-screen">
                    {/* ── Header — same frosted style as Welcome ──── */}
                    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
                        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8 lg:px-12">
                            <Link
                                href="/"
                                className="rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                            >
                                <Logo />
                            </Link>

                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:border-blue-300 hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:text-sm"
                            >
                                <ArrowLeftIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                <span className="hidden sm:inline">Back to Welcome</span>
                                <span className="sm:hidden">Back</span>
                            </Link>
                        </div>
                    </header>

                    {/* ── Main ────────────────────────────────────── */}
                    <main className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8 sm:py-14 lg:py-16">
                        <div className="w-full max-w-md animate-fade-in-up">
                            {/* Eyebrow + heading — matches Welcome's hero style */}
                            <div className="mb-8 text-center">
                                <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-blue-600 sm:text-xs">
                                    <span className="h-px w-6 bg-blue-200" />
                                    Welcome back
                                    <span className="h-px w-6 bg-blue-200" />
                                </span>

                                <h1 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
                                    Sign in to <span className="text-blue-600">HRMO Portal</span>
                                </h1>

                                <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-slate-500 sm:text-base">
                                    Enter your credentials to access your HR account.
                                </p>
                            </div>

                            {/* Card — matches the Welcome card language */}
                            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-blue-900/5 sm:p-8">
                                {/* Card header */}
                                <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-5">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                        <LockIcon className="h-5 w-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <h2 className="text-base font-bold leading-tight tracking-tight text-slate-900">
                                            Secure Log In
                                        </h2>
                                        <p className="text-[11px] leading-tight text-slate-500">
                                            Authorized personnel only
                                        </p>
                                    </div>
                                    <span className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-600 ring-1 ring-inset ring-emerald-100">
                                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                                        Secure
                                    </span>
                                </div>

                                {/*
                                  Native form POST — critical for SSO.
                                  When the flow is triggered from a client app (iLeave),
                                  the login redirect chain ends at a cross-origin URL.
                                  A native navigation follows every redirect natively;
                                  Inertia's XHR submission would be blocked by CORS.
                                */}
                                <form
                                    method="POST"
                                    action="/login"
                                    onSubmit={handleSubmit}
                                    className="space-y-4 sm:space-y-5"
                                    noValidate
                                >
                                    <input type="hidden" name="_token" value={csrfToken} />

                                    {status && (
                                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs text-emerald-700">
                                            {status}
                                        </div>
                                    )}

                                    <div className="space-y-1.5">
                                        <label
                                            htmlFor="username"
                                            className="block text-xs font-semibold text-slate-700"
                                        >
                                            Username
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 sm:pl-4">
                                                <UserIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                                            </div>
                                            <input
                                                id="username"
                                                name="username"
                                                type="text"
                                                autoComplete="username"
                                                autoFocus
                                                required
                                                defaultValue=""
                                                placeholder="Enter your username"
                                                className={`block w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:ring-4 sm:py-3.5 sm:pl-11 ${
                                                    errors.username
                                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10'
                                                        : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10'
                                                }`}
                                            />
                                        </div>
                                        {errors.username && (
                                            <p className="mt-1 text-xs text-red-500">{errors.username}</p>
                                        )}
                                    </div>

                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <label
                                                htmlFor="password"
                                                className="block text-xs font-semibold text-slate-700"
                                            >
                                                Password
                                            </label>
                                            
                                        </div>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 sm:pl-4">
                                                <LockIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                                            </div>
                                            <input
                                                id="password"
                                                name="password"
                                                type={showPassword ? 'text' : 'password'}
                                                autoComplete="current-password"
                                                required
                                                defaultValue=""
                                                placeholder="••••••••"
                                                className={`block w-full rounded-xl border bg-white py-3 pl-10 pr-11 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:ring-4 sm:py-3.5 sm:pl-11 ${
                                                    errors.password
                                                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10'
                                                        : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10'
                                                }`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-400 transition-colors hover:text-slate-600 focus:outline-none"
                                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                                            >
                                                {showPassword ? (
                                                    <EyeOffIcon className="h-5 w-5" />
                                                ) : (
                                                    <EyeIcon className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                                        )}
                                    </div>

                                    <label className="group flex min-h-[24px] cursor-pointer items-center gap-2 pt-1">
                                        <input
                                            type="checkbox"
                                            name="remember"
                                            value="1"
                                            className="h-4 w-4 cursor-pointer rounded border-slate-300 text-blue-600 transition-all focus:ring-blue-500/30"
                                        />
                                        <span className="text-xs text-slate-600 transition-colors group-hover:text-slate-900 sm:text-sm">
                                            Keep me signed in
                                        </span>
                                    </label>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="group relative mt-1 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all duration-300 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 focus:outline-none focus:ring-4 focus:ring-blue-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 sm:py-3.5"
                                    >
                                        <span className="relative flex items-center gap-2">
                                            {submitting ? (
                                                <>
                                                    <svg
                                                        className="h-4 w-4 animate-spin"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        />
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                                        />
                                                    </svg>
                                                    Signing in...
                                                </>
                                            ) : (
                                                'Log In'
                                            )}
                                        </span>
                                        {!submitting && (
                                            <ArrowRightIcon className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                        )}
                                    </button>
                                </form>

                                {/* Security note — matches Welcome's security line */}
                                <div className="mt-6 border-t border-slate-100 pt-5 sm:mt-7 sm:pt-6">
                                    <div className="flex items-start gap-2.5 text-[11px] text-slate-500 sm:text-xs">
                                        <ShieldCheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                                        <p className="leading-relaxed">
                                            Secure access for authorized personnel only. All activities are logged and monitored.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Support link */}
                            <div className="mt-8 text-center">
                                <div className="mb-4 flex items-center justify-center gap-3">
                                    <span className="h-px w-10 bg-slate-200" />
                                    <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                                        Need help?
                                    </span>
                                    <span className="h-px w-10 bg-slate-200" />
                                </div>
                                <p className="text-[11px] text-slate-500 sm:text-xs">
                                    Having trouble signing in?{' '}
                                    <a
                                        href="#"
                                        className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:underline"
                                    >
                                        <MailIcon className="h-3 w-3" />
                                        Contact HRMO support
                                    </a>
                                </p>
                            </div>
                        </div>
                    </main>

                    {/* ── Footer — identical to Welcome ────────────── */}
                    <footer className="border-t border-slate-200 bg-slate-50/60 px-5 py-8 sm:px-8 sm:py-10 lg:px-12">
                        <div className="mx-auto max-w-7xl">
                            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400">
                                    Better People • Stronger Organizations • Brighter Future
                                </p>
                                <p className="text-xs text-slate-400">
                                    &copy; {new Date().getFullYear()} HRMO Portal. All rights reserved.
                                </p>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
                    animation-delay: 0.1s;
                }

                @media (prefers-reduced-motion: reduce) {
                    .animate-fade-in-up { animation: none; }
                }

                /* Prevents iOS auto-zoom on input focus */
                @media (max-width: 640px) {
                    input[type="text"],
                    input[type="password"] {
                        font-size: 16px !important;
                    }
                }
            `}</style>

            {showExitFlash && <PortalExitOverlay />}
        </>
    );
}