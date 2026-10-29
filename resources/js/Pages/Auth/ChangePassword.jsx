import { Head, router, useForm } from '@inertiajs/react';
import { useState, useMemo } from 'react';

// --- Inline SVG Icons (matching Welcome/Login) ---
const Icon = ({ path, className = "h-5 w-5", strokeWidth = 1.8 }) => (
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

const LockIcon = (p) => <Icon {...p} path={<><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>} />;
const KeyIcon = (p) => <Icon {...p} path={<><circle cx="7.5" cy="15.5" r="5.5" /><path d="m21 2-9.6 9.6" /><path d="m15.5 7.5 3 3L22 7l-3-3" /></>} />;
const EyeIcon = (p) => <Icon {...p} path={<><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>} />;
const EyeOffIcon = (p) => <Icon {...p} path={<><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>} />;
const ShieldCheckIcon = (p) => <Icon {...p} path={<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></>} />;
const CheckIcon = (p) => <Icon {...p} strokeWidth={2.5} path={<polyline points="20 6 9 17 4 12" />} />;
const XIcon = (p) => <Icon {...p} strokeWidth={2.5} path={<><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>} />;
const AlertTriangleIcon = (p) => <Icon {...p} path={<><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>} />;
const LogOutIcon = (p) => <Icon {...p} path={<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>} />;

// --- Logo (identical to Welcome/Login) ---
const Logo = ({ className = "", compact = false }) => (
    <div className={`flex items-center gap-2.5 sm:gap-3 ${className}`}>
        <div className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-600/30 shrink-0">
            <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
        </div>
        <div className="flex flex-col min-w-0">
            <span className="text-base sm:text-xl font-bold leading-tight tracking-tight text-slate-900 whitespace-nowrap">
                HRMO <span className="text-blue-600">Portal</span>
            </span>
            {!compact && (
                <span className="hidden sm:block text-[10px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                    Human Resource Management Office
                </span>
            )}
        </div>
    </div>
);

// --- Password Input with visibility toggle ---
const PasswordInput = ({ id, value, onChange, error, autoComplete, placeholder, hasToggle = true }) => {
    const [visible, setVisible] = useState(false);
    return (
        <>
            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 sm:pl-4 text-slate-400">
                    <LockIcon className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                </div>
                <input
                    id={id}
                    type={visible ? 'text' : 'password'}
                    autoComplete={autoComplete}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`block w-full rounded-xl border bg-white/80 py-3 sm:py-3.5 pl-10 sm:pl-11 pr-11 text-sm text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:bg-white focus:ring-4 ${
                        error
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10'
                            : 'border-slate-200 focus:border-blue-500 focus:ring-blue-500/10'
                    }`}
                />
                {hasToggle && (
                    <button
                        type="button"
                        onClick={() => setVisible(!visible)}
                        className="absolute inset-y-0 right-0 flex items-center justify-center w-11 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                        aria-label={visible ? 'Hide password' : 'Show password'}
                    >
                        {visible ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                )}
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </>
    );
};

// --- Password strength meter ---
const PasswordStrength = ({ password }) => {
    const { score, label, color, textColor, hints } = useMemo(() => {
        if (!password) return { score: 0, label: '', color: 'bg-slate-200', textColor: 'text-slate-400', hints: [] };

        const hints = [
            { met: password.length >= 8, text: 'At least 8 characters' },
            { met: /[a-z]/.test(password), text: 'Lowercase letter' },
            { met: /[A-Z]/.test(password), text: 'Uppercase letter' },
            { met: /[0-9]/.test(password), text: 'Number' },
            { met: /[^A-Za-z0-9]/.test(password), text: 'Special character' },
        ];

        const score = hints.filter((h) => h.met).length;

        const scale = [
            { label: 'Very Weak', color: 'bg-red-500', textColor: 'text-red-600' },
            { label: 'Very Weak', color: 'bg-red-500', textColor: 'text-red-600' },
            { label: 'Weak',      color: 'bg-orange-500', textColor: 'text-orange-600' },
            { label: 'Fair',      color: 'bg-amber-500', textColor: 'text-amber-600' },
            { label: 'Good',      color: 'bg-blue-500', textColor: 'text-blue-600' },
            { label: 'Strong',    color: 'bg-emerald-500', textColor: 'text-emerald-600' },
        ];
        const { label, color, textColor } = scale[score];

        return { score, label, color, textColor, hints };
    }, [password]);

    if (!password) return null;

    return (
        <div className="mt-2.5 space-y-2.5">
            {/* Bar */}
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                            score >= i ? color : 'bg-slate-200'
                        }`}
                    />
                ))}
            </div>

            {/* Label + hints */}
            <div className="flex flex-wrap items-center justify-between gap-2">
                <p className={`text-[11px] font-semibold ${textColor}`}>{label}</p>
                <p className="text-[10px] text-slate-400">{score}/5 requirements</p>
            </div>

            <ul className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                {hints.map((hint, i) => (
                    <li
                        key={i}
                        className={`flex items-center gap-1.5 text-[11px] transition-colors ${
                            hint.met ? 'text-emerald-600' : 'text-slate-400'
                        }`}
                    >
                        <span className={`flex h-3.5 w-3.5 items-center justify-center rounded-full shrink-0 ${
                            hint.met ? 'bg-emerald-100' : 'bg-slate-100'
                        }`}>
                            {hint.met ? <CheckIcon className="h-2.5 w-2.5" /> : <XIcon className="h-2.5 w-2.5" />}
                        </span>
                        {hint.text}
                    </li>
                ))}
            </ul>
        </div>
    );
};

// --- Main Page ---
export default function ChangePassword({ forced, warning }) {
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const passwordsMatch = data.password_confirmation.length > 0 && data.password === data.password_confirmation;
    const passwordsMismatch = data.password_confirmation.length > 0 && data.password !== data.password_confirmation;

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
            <Head title={forced ? 'Set your password · HRMO Portal' : 'Change password · HRMO Portal'} />

            <div className="relative min-h-screen w-full font-sans text-slate-900 selection:bg-blue-200 selection:text-blue-900 overflow-x-hidden">

                {/* Background image — matches Login/Welcome */}
                <div
                    className="fixed inset-0 z-0 bg-[url('/images/hrmo-background.png')] bg-cover bg-center bg-no-repeat sm:absolute"
                    aria-hidden="true"
                />

                {/* Light overlay — heavier on the right where the card sits */}
                <div
                    className="fixed inset-0 z-0 bg-gradient-to-b from-white/85 via-white/65 to-white/80 sm:absolute sm:bg-gradient-to-l sm:from-white/90 sm:via-white/60 sm:to-white/30"
                    aria-hidden="true"
                />

                {/* Content wrapper */}
                <div className="relative z-10 flex flex-col min-h-screen">

                    {/* Header */}
                    <header className="flex items-center justify-between px-5 sm:px-8 lg:px-12 pt-5 sm:pt-6 lg:pt-8 pb-2 sm:pb-4">
                        <Logo />
                        {!forced && (
                            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Authenticated
                            </span>
                        )}
                    </header>

                    {/* Main */}
                    <main className="flex-1 flex items-center justify-center px-5 sm:px-8 py-6 sm:py-10 lg:py-12">
                        <div className="w-full max-w-md animate-fade-in-up">

                            {/* Title block */}
                            <div className="text-center mb-6 sm:mb-7">
                                <div className="mx-auto mb-4 relative inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-lg shadow-blue-900/5 ring-1 ring-blue-100">
                                    <KeyIcon className="h-6 w-6" strokeWidth={2} />
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                                    {forced ? 'Set your ' : 'Change '}
                                    <span className="text-blue-600">password</span>
                                </h1>
                                <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-sm mx-auto leading-relaxed">
                                    {forced
                                        ? 'Your account was created with a temporary password. Choose a new one to continue.'
                                        : 'Keep your account secure by updating your password regularly.'}
                                </p>
                            </div>

                            {/* Card */}
                            <div className="rounded-3xl bg-white/95 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-blue-900/15 ring-1 ring-white/60">

                                {/* Card header strip */}
                                <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-100">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shrink-0">
                                        <ShieldCheckIcon className="h-5 w-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <h2 className="text-base font-bold text-slate-900 leading-tight">
                                            {forced ? 'Password Setup' : 'Password Update'}
                                        </h2>
                                        <p className="text-[11px] text-slate-500 leading-tight">
                                            {forced ? 'Required before you can continue' : 'Enter your current and new password'}
                                        </p>
                                    </div>
                                </div>

                                {/* Warning banner */}
                                {warning && (
                                    <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-3.5 py-3 text-sm text-amber-800">
                                        <AlertTriangleIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                                        <p className="leading-relaxed">{warning}</p>
                                    </div>
                                )}

                                <form onSubmit={submit} className="space-y-4 sm:space-y-5" noValidate>

                                    {/* Current password */}
                                    <div className="space-y-1.5">
                                        <label htmlFor="current_password" className="block text-xs font-semibold text-slate-700">
                                            Current password
                                        </label>
                                        <PasswordInput
                                            id="current_password"
                                            autoComplete="current-password"
                                            value={data.current_password}
                                            onChange={(e) => setData('current_password', e.target.value)}
                                            placeholder="Enter your current password"
                                            error={errors.current_password}
                                        />
                                    </div>

                                    {/* New password */}
                                    <div className="space-y-1.5">
                                        <label htmlFor="password" className="block text-xs font-semibold text-slate-700">
                                            New password
                                        </label>
                                        <PasswordInput
                                            id="password"
                                            autoComplete="new-password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="Create a strong password"
                                            error={errors.password}
                                        />
                                        <PasswordStrength password={data.password} />
                                    </div>

                                    {/* Confirm password */}
                                    <div className="space-y-1.5">
                                        <label htmlFor="password_confirmation" className="block text-xs font-semibold text-slate-700">
                                            Confirm new password
                                        </label>
                                        <div className="relative">
                                            <PasswordInput
                                                id="password_confirmation"
                                                autoComplete="new-password"
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                placeholder="Re-type your new password"
                                            />
                                            {passwordsMatch && (
                                                <div className="pointer-events-none absolute inset-y-0 right-10 flex items-center">
                                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                                                        <CheckIcon className="h-3 w-3" />
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        {passwordsMismatch && (
                                            <p className="flex items-center gap-1.5 text-xs text-red-500 mt-1">
                                                <XIcon className="h-3 w-3" />
                                                Passwords do not match
                                            </p>
                                        )}
                                    </div>

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={processing || passwordsMismatch}
                                        className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-3 sm:py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 transition-all duration-300 hover:from-blue-700 hover:to-blue-600 hover:shadow-blue-600/50 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:opacity-70 mt-2"
                                    >
                                        <span className="relative flex items-center gap-2">
                                            {processing ? (
                                                <>
                                                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                    </svg>
                                                    Saving...
                                                </>
                                            ) : (
                                                forced ? 'Set Password' : 'Save Password'
                                            )}
                                        </span>
                                    </button>
                                </form>

                                {/* Logout */}
                                {!forced && (
                                    <div className="mt-6 sm:mt-7 pt-5 sm:pt-6 border-t border-slate-100">
                                        {!showLogoutConfirm ? (
                                            <button
                                                type="button"
                                                onClick={() => setShowLogoutConfirm(true)}
                                                className="flex w-full items-center justify-center gap-2 rounded-xl py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
                                            >
                                                <LogOutIcon className="h-3.5 w-3.5" />
                                                Log out instead
                                            </button>
                                        ) : (
                                            <div className="space-y-2.5">
                                                <p className="text-center text-xs text-slate-600">
                                                    Are you sure you want to log out?
                                                </p>
                                                <div className="flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowLogoutConfirm(false)}
                                                        className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={logout}
                                                        className="flex-1 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
                                                    >
                                                        Log out
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Security footer */}
                                {forced && (
                                    <div className="mt-6 sm:mt-7 pt-5 sm:pt-6 border-t border-slate-100">
                                        <div className="flex items-start gap-2.5 text-[11px] sm:text-xs text-slate-500">
                                            <ShieldCheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                                            <p className="leading-relaxed">
                                                This is a required security step. You won't be able to access the portal until your password is updated.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Bottom help text */}
                            <p className="mt-6 text-center text-[11px] text-slate-500">
                                Need help?{' '}
                                <a href="#" className="font-semibold text-blue-600 hover:underline">
                                    Contact HRMO support
                                </a>
                            </p>
                        </div>
                    </main>

                    {/* Footer — matches Welcome/Login */}
                    <footer className="px-5 sm:px-8 lg:px-12 pb-6 sm:pb-8 pt-4">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                            <div className="flex flex-wrap items-center justify-center gap-2.5">
                                <span>Better People</span>
                                <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                                <span>Stronger Organizations</span>
                                <span className="h-1 w-1 rounded-full bg-slate-300"></span>
                                <span>Brighter Future</span>
                            </div>
                            <span className="normal-case tracking-normal font-medium text-slate-400">
                                &copy; {new Date().getFullYear()} HRMO Portal
                            </span>
                        </div>
                    </footer>
                </div>
            </div>

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up { animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }

                @media (prefers-reduced-motion: reduce) {
                    .animate-fade-in-up { animation: none; }
                }

                /* iOS: prevent zoom on input focus */
                @media (max-width: 640px) {
                    input[type="password"],
                    input[type="text"] {
                        font-size: 16px !important;
                    }
                }
            `}</style>
        </>
    );
}