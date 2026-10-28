import { Head } from '@inertiajs/react';
import ApplicationCard from '../Components/ApplicationCard';
import UserLayout from '../Layouts/UserLayout';

function getInitials(name = '') {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();
}

function StatCard({ label, value, icon }) {
    return (
        <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 opacity-[0.08] blur-xl transition-opacity duration-300 group-hover:opacity-20"
            />
            <div className="relative flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-sm shadow-blue-900/20">
                    {icon}
                </div>
                <div className="min-w-0">
                    <p className="text-2xl font-semibold leading-none tracking-tight text-slate-900">
                        {value}
                    </p>
                    <p className="mt-1 truncate text-xs font-medium uppercase tracking-wide text-slate-500">
                        {label}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function Dashboard({ profile, applications = [] }) {
    const count = applications.length;
    const initials = getInitials(profile?.name);
    const categories = new Set(
        applications.map((a) => a.category).filter(Boolean),
    ).size;

    return (
        <UserLayout>
            <Head title="Dashboard" />

            <div className="mx-auto w-full max-w-7xl space-y-6 sm:space-y-8">
                {/* ── Hero greeting card ───────────────────────── */}
                <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 p-5 shadow-xl shadow-blue-900/25 sm:p-7 lg:p-8">
                    {/* Layered background decoration */}
                    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                        <div
                            className="absolute inset-0 opacity-[0.07]"
                            style={{
                                backgroundImage:
                                    'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                                backgroundSize: '20px 20px',
                            }}
                        />
                        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-400/30 blur-3xl" />
                        <div className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                    </div>

                    <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                        {/* Identity block */}
                        <div className="flex items-center gap-4">
                            {/* Avatar with soft halo */}
                            <div className="relative shrink-0">
                                <div
                                    aria-hidden="true"
                                    className="absolute inset-0 rounded-2xl bg-white/20 blur-md"
                                />
                                <div
                                    aria-hidden="true"
                                    className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-white/25 to-white/10 text-base font-semibold text-white ring-1 ring-inset ring-white/30 backdrop-blur-md sm:h-16 sm:w-16 sm:text-lg"
                                >
                                    {initials || '?'}
                                </div>
                            </div>

                            {/* Name + meta */}
                            <div className="min-w-0 flex-1">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-100/70">
                                    Welcome back
                                </p>

                                <h1 className="mt-1 truncate text-xl font-semibold tracking-tight text-white sm:text-2xl lg:text-3xl">
                                    {profile.name}
                                </h1>

                                <div className="mt-2 flex flex-wrap items-center gap-1.5 sm:mt-3 sm:gap-2">
                                    <span className="inline-flex items-center rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium capitalize text-white ring-1 ring-inset ring-white/20 backdrop-blur-sm sm:text-xs">
                                        {profile.role}
                                    </span>

                                    {profile.office && (
                                        <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-blue-50 ring-1 ring-inset ring-white/15 backdrop-blur-sm sm:text-xs">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                                className="h-3.5 w-3.5 shrink-0"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M4 16.5v-13h-.25a.75.75 0 0 1 0-1.5h12.5a.75.75 0 0 1 0 1.5H16v13h.25a.75.75 0 0 1 0 1.5h-3.5a.75.75 0 0 1-.75-.75v-2.5a.75.75 0 0 0-.75-.75h-2.5a.75.75 0 0 0-.75.75v2.5a.75.75 0 0 1-.75.75h-3.5a.75.75 0 0 1 0-1.5H4Zm3-11a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1Zm5.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1ZM7 9a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1A.5.5 0 0 1 7 10V9Zm5.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5V9a.5.5 0 0 0-.5-.5h-1Z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            <span className="truncate">
                                                {profile.office}
                                            </span>
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* CTA — full width on mobile, inline on desktop */}
                        <a
                            href="#applications"
                            className="group inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-800 shadow-lg shadow-blue-950/20 transition-all duration-200 hover:bg-blue-50 hover:shadow-xl hover:shadow-blue-950/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-800 sm:w-auto"
                        >
                            Browse applications
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </a>
                    </div>
                </section>

                {/* ── Stats row ────────────────────────────────── */}
                <section
                    aria-label="Overview"
                    className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4"
                >
                    <StatCard
                        label="Applications"
                        value={count}
                        icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="h-5 w-5"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4.25 2A2.25 2.25 0 0 0 2 4.25v2.5A2.25 2.25 0 0 0 4.25 9h2.5A2.25 2.25 0 0 0 9 6.75v-2.5A2.25 2.25 0 0 0 6.75 2h-2.5Zm0 9A2.25 2.25 0 0 0 2 13.25v2.5A2.25 2.25 0 0 0 4.25 18h2.5A2.25 2.25 0 0 0 9 15.75v-2.5A2.25 2.25 0 0 0 6.75 11h-2.5Zm9-9A2.25 2.25 0 0 0 11 4.25v2.5A2.25 2.25 0 0 0 13.25 9h2.5A2.25 2.25 0 0 0 18 6.75v-2.5A2.25 2.25 0 0 0 15.75 2h-2.5Zm0 9A2.25 2.25 0 0 0 11 13.25v2.5A2.25 2.25 0 0 0 13.25 18h2.5A2.25 2.25 0 0 0 18 15.75v-2.5A2.25 2.25 0 0 0 15.75 11h-2.5Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        }
                    />
                    <StatCard
                        label="Categories"
                        value={categories}
                        icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="h-5 w-5"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.25 2.25a3 3 0 0 0-3 3v2.25a3 3 0 0 0 3 3h2.25a3 3 0 0 0 3-3V5.25a3 3 0 0 0-3-3H5.25ZM16.5 2.25a3 3 0 0 0-3 3v2.25a3 3 0 0 0 3 3h2.25a3 3 0 0 0 3-3V5.25a3 3 0 0 0-3-3H16.5ZM5.25 13.5a3 3 0 0 0-3 3v2.25a3 3 0 0 0 3 3h2.25a3 3 0 0 0 3-3V16.5a3 3 0 0 0-3-3H5.25ZM16.5 13.5a3 3 0 0 0-3 3v2.25a3 3 0 0 0 3 3h2.25a3 3 0 0 0 3-3V16.5a3 3 0 0 0-3-3H16.5Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        }
                    />
                    <StatCard
                        label="Access level"
                        value={profile.role === 'admin' ? 'Full' : 'Standard'}
                        icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="h-5 w-5"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        }
                    />
                </section>

                {/* ── Applications ─────────────────────────────── */}
                <section id="applications" aria-labelledby="applications-heading">
                    <div className="mb-4 flex items-end justify-between gap-3">
                        <div>
                            <h2
                                id="applications-heading"
                                className="text-lg font-semibold tracking-tight text-slate-900 sm:text-xl"
                            >
                                Your applications
                            </h2>
                            <p className="mt-0.5 text-sm text-slate-500">
                                {count > 0
                                    ? 'Jump into any application you have access to.'
                                    : 'Applications you have access to will appear here.'}
                            </p>
                        </div>

                        {count > 0 && (
                            <span className="hidden shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800 ring-1 ring-inset ring-blue-100 sm:inline-flex">
                                {count} total
                            </span>
                        )}
                    </div>

                    {count === 0 ? (
                        <div className="relative overflow-hidden rounded-3xl border border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-white px-6 py-14 text-center sm:py-20">
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-blue-100 blur-3xl"
                            />
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-blue-200 blur-3xl"
                            />

                            <div className="relative flex flex-col items-center">
                                <div
                                    aria-hidden="true"
                                    className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 to-blue-900 text-white shadow-lg shadow-blue-900/30"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="h-7 w-7"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M4.25 2A2.25 2.25 0 0 0 2 4.25v2.5A2.25 2.25 0 0 0 4.25 9h2.5A2.25 2.25 0 0 0 9 6.75v-2.5A2.25 2.25 0 0 0 6.75 2h-2.5Zm0 9A2.25 2.25 0 0 0 2 13.25v2.5A2.25 2.25 0 0 0 4.25 18h2.5A2.25 2.25 0 0 0 9 15.75v-2.5A2.25 2.25 0 0 0 6.75 11h-2.5Zm9-9A2.25 2.25 0 0 0 11 4.25v2.5A2.25 2.25 0 0 0 13.25 9h2.5A2.25 2.25 0 0 0 18 6.75v-2.5A2.25 2.25 0 0 0 15.75 2h-2.5Zm0 9A2.25 2.25 0 0 0 11 13.25v2.5A2.25 2.25 0 0 0 13.25 18h2.5A2.25 2.25 0 0 0 18 15.75v-2.5A2.25 2.25 0 0 0 15.75 11h-2.5Z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>

                                <h3 className="mt-5 text-base font-semibold text-slate-900">
                                    Nothing here yet
                                </h3>
                                <p className="mt-1.5 max-w-md text-sm leading-relaxed text-slate-500">
                                    You don&rsquo;t have access to any applications yet.
                                    Reach out to your portal administrator and
                                    they&rsquo;ll get you set up.
                                </p>

                                <a
                                    href="mailto:admin@example.com"
                                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-blue-700 to-blue-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-900/30 transition-all duration-200 hover:shadow-md hover:shadow-blue-900/40 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
                                >
                                    Contact administrator
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-5">
                            {applications.map((application) => (
                                <ApplicationCard
                                    key={application.id}
                                    application={application}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </UserLayout>
    );
}