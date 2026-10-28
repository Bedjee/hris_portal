import { Head, Link } from '@inertiajs/react';
import SplashScreen, { useSplash } from '../Components/SplashScreen';

// ─────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────
const Icon = ({ path, className = 'h-5 w-5', strokeWidth = 1.8 }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">{path}</svg>
);

const ArrowRightIcon = (p) => <Icon {...p} strokeWidth={2.5} path={<><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>} />;
const LoginIcon = (p) => <Icon {...p} path={<><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></>} />;
const UserIcon = (p) => <Icon {...p} path={<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>} />;
const CalendarIcon = (p) => <Icon {...p} path={<><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>} />;
const ClockIcon = (p) => <Icon {...p} path={<><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></>} />;
const BriefcaseIcon = (p) => <Icon {...p} path={<><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></>} />;
const LayoutGridIcon = (p) => <Icon {...p} path={<><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></>} />;
const ShieldCheckIcon = (p) => <Icon {...p} path={<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></>} />;
const UsersIcon = (p) => <Icon {...p} path={<><path d="M16 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="9.5" cy="7" r="3.5" /><path d="M21 20v-2a4 4 0 0 0-3-3.87" /><path d="M15.5 3.13a3.5 3.5 0 0 1 0 6.74" /></>} />;
const AwardIcon = (p) => <Icon {...p} path={<><circle cx="12" cy="8" r="6" /><path d="M15.5 13.5 17 22l-5-3-5 3 1.5-8.5" /></>} />;
const HeartIcon = (p) => <Icon {...p} path={<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 1 0-7.8 7.8l1 1.1L12 21.4l7.8-7.9 1-1.1a5.5 5.5 0 0 0 0-7.8Z" />} />;
const FacebookIcon = ({ className = 'h-5 w-5' }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.52 1.49-3.91 3.78-3.91 1.1 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22c4.78-.76 8.43-4.92 8.43-9.94Z" />
    </svg>
);
const MapPinIcon = (p) => <Icon {...p} path={<><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>} />;
const PhoneIcon = (p) => <Icon {...p} path={<path d="M22 16.9v2.8a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h2.8a2 2 0 0 1 2 1.7 12.8 12.8 0 0 0 .7 2.8 2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.4-1.1a2 2 0 0 1 2.1-.5 12.8 12.8 0 0 0 2.8.7 2 2 0 0 1 1.7 2Z" />} />;
const MailIcon = (p) => <Icon {...p} path={<><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 6-10 7L2 6" /></>} />;

// ─────────────────────────────────────────────────────────────
// Logo
// ─────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────
// Section heading
// ─────────────────────────────────────────────────────────────
const SectionHeading = ({ eyebrow, title, description, align = 'center' }) => (
    <div className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
        {eyebrow && (
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-blue-600 sm:text-xs">
                {align === 'center' && <span className="h-px w-6 bg-blue-200" />}
                {eyebrow}
                {align === 'center' && <span className="h-px w-6 bg-blue-200" />}
            </span>
        )}
        <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">{title}</h2>
        {description && <p className="mt-4 text-sm leading-relaxed text-slate-500 sm:text-base">{description}</p>}
    </div>
);

// ─────────────────────────────────────────────────────────────
// Stat card
// ─────────────────────────────────────────────────────────────
const StatCard = ({ icon: IconCmp, value, label }) => (
    <div className="group flex flex-col items-center rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/5 sm:p-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100 sm:h-12 sm:w-12">
            <IconCmp className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.8} />
        </div>
        <p className="mt-4 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{value}</p>
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 sm:text-xs">{label}</p>
    </div>
);

// ─────────────────────────────────────────────────────────────
// Service card
// ─────────────────────────────────────────────────────────────
const ServiceCard = ({ icon: IconCmp, label, description }) => (
    <div className="group flex flex-col items-start rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-900/5 sm:p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors duration-300 group-hover:bg-blue-100 sm:h-14 sm:w-14">
            <IconCmp className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.8} />
        </div>
        <h3 className="mt-4 text-base font-bold tracking-tight text-slate-900 sm:text-lg">{label}</h3>
        {description && <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{description}</p>}
    </div>
);

// ─────────────────────────────────────────────────────────────
// Team photo — dual-image circular container with an INSTANT swap
//   Desktop: formal → alternate on :hover, no fade, no zoom
//   Mobile:  no auto-alternate — formal photo only
// ─────────────────────────────────────────────────────────────
const TeamPhoto = ({ name, image, hoverImage }) => {
    const initials = name.split(/\s+/).slice(0, 2).map((p) => p[0]).join('').toUpperCase();

    const hideOnError = (e) => {
        e.currentTarget.style.display = 'none';
    };

    return (
        <div className="relative h-full w-full overflow-hidden rounded-full bg-gradient-to-br from-blue-50 to-sky-100">
            {/* Initials fallback — behind both photos */}
            <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                <span className="text-2xl font-extrabold tracking-tight text-blue-600 sm:text-3xl">
                    {initials}
                </span>
            </div>

            {/* Formal photo — default state. z-10 keeps it above the fallback. */}
            <img
                src={image}
                alt={name}
                loading="lazy"
                draggable={false}
                className="absolute inset-0 z-10 h-full w-full object-cover object-center"
                onError={hideOnError}
            />

            {/* Alternate photo — hidden by default; appears instantly on
                group hover. z-20 keeps it above the formal photo.
                pointer-events-none so it never traps the cursor. */}
            <img
                src={hoverImage}
                alt=""
                aria-hidden="true"
                loading="lazy"
                draggable={false}
                className="pointer-events-none absolute inset-0 z-20 h-full w-full object-cover object-center opacity-0 group-hover:opacity-100"
                onError={hideOnError}
            />
        </div>
    );
};

// ─────────────────────────────────────────────────────────────
// Team node — circular frame + name + role
// ─────────────────────────────────────────────────────────────
const TeamNode = ({ name, role, image, hoverImage, size = 'md' }) => {
    const dims = {
        lg: 'h-28 w-28 sm:h-32 sm:w-32',
        md: 'h-24 w-24 sm:h-28 sm:w-28',
        sm: 'h-20 w-20 sm:h-24 sm:w-24',
        xs: 'h-16 w-16 sm:h-20 sm:w-20',
    }[size];

    return (
        <div className="group flex flex-col items-center">
            <div className={`relative ${dims} shrink-0`}>
                {/* Hover glow — decorative, must NOT intercept pointer events */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-2 rounded-full bg-blue-500/0 blur-lg transition-all duration-500 group-hover:bg-blue-500/25"
                />

                {/* Gradient ring + white gap + image frame.
                    `relative z-10` guarantees this layer sits above
                    the glow and receives all hover / pointer events. */}
                <div className="relative z-10 h-full w-full rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-sky-400 p-[2px] shadow-lg shadow-blue-900/10">
                    <div className="h-full w-full rounded-full bg-white p-[3px]">
                        <TeamPhoto
                            name={name}
                            image={image}
                            hoverImage={hoverImage}
                        />
                    </div>
                </div>

                {/* Online status dot — decorative, must NOT intercept hover */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-sm"
                >
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
                </div>
            </div>

            <div className="mt-4 max-w-[160px] text-center">
                <p className="truncate text-sm font-bold tracking-tight text-slate-900 sm:text-base">{name}</p>
                <p className="mt-0.5 truncate font-mono text-[10px] font-medium uppercase tracking-wider text-blue-600 sm:text-[11px]">{role}</p>
            </div>
        </div>
    );
};



// ─────────────────────────────────────────────────────────────
// Connector: L1 → L2 (single fanout, 3-way)
// ─────────────────────────────────────────────────────────────
const ConnectorRow = () => (
    <div className="grid grid-cols-3">
        <div className="relative h-14 sm:h-16">
            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-blue-300/60 to-blue-400" />
        </div>

        <div className="relative h-14 sm:h-16">
            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-blue-300/60 to-blue-400" />
            <div className="absolute left-[-50%] right-[-50%] top-0 h-px bg-gradient-to-r from-blue-400 via-blue-500 to-blue-400" />
            <span className="absolute left-[-50%] top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400 shadow-[0_0_8px_2px_rgba(59,130,246,0.5)]" />
            <span className="absolute right-[-50%] top-0 h-2 w-2 translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400 shadow-[0_0_8px_2px_rgba(59,130,246,0.5)]" />
            <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500 shadow-[0_0_8px_2px_rgba(59,130,246,0.6)]" />
        </div>

        <div className="relative h-14 sm:h-16">
            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-blue-300/60 to-blue-400" />
        </div>
    </div>
);

// ─────────────────────────────────────────────────────────────
// Connector: L2 → L3 (fan-in / fan-out across a horizontal rail)
// ─────────────────────────────────────────────────────────────
const MultiFanConnector = ({ parents = 3, children = 4 }) => (
    <div className="relative h-16 sm:h-20">
        <div
            className="absolute inset-0 grid"
            style={{ gridTemplateColumns: `repeat(${parents}, minmax(0, 1fr))` }}
        >
            {Array.from({ length: parents }).map((_, i) => (
                <div key={`p-${i}`} className="relative h-full">
                    <div className="absolute left-1/2 top-0 h-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-blue-400 to-blue-500" />
                    <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500 shadow-[0_0_6px_2px_rgba(59,130,246,0.5)]" />
                </div>
            ))}
        </div>

        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-blue-300/60 via-blue-500 to-blue-300/60" />

        <div
            className="absolute inset-0 grid"
            style={{ gridTemplateColumns: `repeat(${children}, minmax(0, 1fr))` }}
        >
            {Array.from({ length: children }).map((_, i) => (
                <div key={`c-${i}`} className="relative h-full">
                    <div className="absolute left-1/2 top-1/2 h-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-blue-500 to-blue-400" />
                    <span
                        className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 animate-pulse-dot rounded-full bg-blue-400 shadow-[0_0_6px_2px_rgba(59,130,246,0.5)]"
                        style={{ animationDelay: `${i * 0.25}s` }}
                    />
                </div>
            ))}
        </div>
    </div>
);

// ─────────────────────────────────────────────────────────────
// Mobile spine — vertical list with left-side connector
// ─────────────────────────────────────────────────────────────
const MobileTeamList = ({ team }) => (
    <div className="relative mx-auto max-w-md">
        <div
            aria-hidden="true"
            className="absolute left-6 top-8 bottom-8 w-px bg-gradient-to-b from-blue-200 via-blue-400 to-blue-200"
        />

        <ul className="space-y-6">
            {team.map((member, i) => (
                <li key={i} className="group relative flex items-center gap-4">
                    <span
                        aria-hidden="true"
                        className="relative z-10 ml-6 h-3 w-3 shrink-0 -translate-x-1/2 rounded-full bg-blue-500 shadow-[0_0_8px_2px_rgba(59,130,246,0.4)]"
                    />

                    <div className="relative h-16 w-16 shrink-0">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 via-blue-600 to-sky-400 p-[2px]">
                            <div className="h-full w-full rounded-full bg-white p-[2px]">
                                <TeamPhoto
                                    name={member.name}
                                    image={member.image}
                                    hoverImage={member.hoverImage}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold tracking-tight text-slate-900">{member.name}</p>
                        <p className="mt-0.5 truncate font-mono text-[10px] font-medium uppercase tracking-wider text-blue-600">{member.role}</p>
                    </div>
                </li>
            ))}
        </ul>
    </div>
);

// ─────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────
export default function Welcome({ canLogin }) {
    const { show: showSplash, dismiss: dismissSplash } = useSplash();

    const facebookUrl = 'https://www.facebook.com/profile.php?id=100064538958287';

    const services = [
        { name: 'Employee Profile', icon: UserIcon, description: 'View and update your personal and employment information.' },
        { name: 'Leave Management', icon: CalendarIcon, description: 'File leave requests and track your balances in real time.' },
        { name: 'Attendance', icon: ClockIcon, description: 'Monitor your daily time records and attendance history.' },
        { name: 'HR Services', icon: BriefcaseIcon, description: 'Access certificates, clearances, and other HR documents.' },
        { name: 'More Systems', icon: LayoutGridIcon, description: 'Explore additional tools integrated with the HRMO Portal.' },
    ];

  

    // 8 HRMO team members — arranged 1 / 3 / 4 in the org chart.
    // Each member has TWO local images:
    //   image      → formal photo (default)
    //   hoverImage → alternate photo shown on hover
    const team = [
        { name: 'Joseph A. Actub',   role: 'HRMO Head',            image: '/images/erap.jpg', hoverImage: '/images/erap.jpg' },
        { name: 'Trishia Z. Pitogo',   role: 'HRMO I',        image: '/images/trishia.jpg', hoverImage: '/images/trishia.jpg' },
        { name: 'Michael E. Escaba', role: 'ADMIN AIDE III',      image: '/images/michael.jpg', hoverImage: '/images/michael.jpg' },
        { name: 'Rezan M. Cagatan',  role: 'DEMO I', image: '/images/rezan.jpg', hoverImage: '/images/rezan.jpg' },
        { name: 'Maria Teresa L. Ardeño',  role: 'Payroll Officer',      image: '/images/maria.jpg', hoverImage: '/images/maria.jpg' },
        { name: 'Yogene Avendan',   role: 'HR Monitoring Officer',     image: '/images/yogene.jpg', hoverImage: '/images/yogene.jpg' },
        { name: 'Lunel Jay C. Maape', role: 'HR Messenger',         image: '/images/lunel.jpg', hoverImage: '/images/lunel.jpg' },
        { name: 'BJ P. De la Cruz', role: 'Web Developer',         image: '/images/bj.jpg', hoverImage: '/images/bj.jpg' },
    ];

    const topMember  = team[0];          // Level 1 — 1 head
    const midTeam    = team.slice(1, 4); // Level 2 — 3 leads
    const bottomTeam = team.slice(4);    // Level 3 — 4 staff

    const navLinks = [
        { href: '#services', label: 'Services' },
        { href: '#about', label: 'About' },
        { href: '#team', label: 'Team' },
        { href: '#connect', label: 'Connect' },
    ];

    return (
        <>
            {showSplash && <SplashScreen onDone={dismissSplash} duration={3500} />}

            <Head title="Welcome to HRMO Portal" />

            <div className="relative min-h-screen w-full overflow-x-hidden bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
                <div aria-hidden="true" className="pointer-events-none fixed -right-32 -top-32 z-0 h-96 w-96 rounded-full bg-blue-100/50 blur-3xl" />
                <div aria-hidden="true" className="pointer-events-none fixed -bottom-40 -left-24 z-0 h-[28rem] w-[28rem] rounded-full bg-sky-100/50 blur-3xl" />

                {/* ── Header ──────────────────────────────────── */}
                <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 sm:px-8 lg:px-12">
                        <Logo />

                        <nav className="hidden items-center gap-7 text-sm font-medium text-slate-500 md:flex">
                            {navLinks.map((link) => (
                                <a key={link.href} href={link.href} className="transition-colors hover:text-blue-600">{link.label}</a>
                            ))}
                        </nav>

                        {canLogin && (
                            <Link
                                href={route('login')}
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-600/25 transition-all hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
                            >
                                <LoginIcon className="h-4 w-4" />
                                <span>Log In</span>
                            </Link>
                        )}
                    </div>
                </header>

                <main className="relative z-10">
                    {/* ── HERO ────────────────────────────────── */}
                    <section className="px-5 pb-16 pt-14 sm:px-8 sm:pb-20 sm:pt-20 lg:px-12 lg:pb-24 lg:pt-24">
                        <div className="mx-auto max-w-3xl animate-fade-in-up text-center">
                            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-blue-600 sm:text-xs">
                                <span className="h-px w-6 bg-blue-200" />
                                Welcome to
                                <span className="h-px w-6 bg-blue-200" />
                            </span>

                            <h1 className="mt-6 text-[2.5rem] font-extrabold leading-[1.05] tracking-tight text-slate-900 sm:mt-7 sm:text-6xl lg:text-7xl">
                                HRMO <span className="text-blue-600">Portal</span>
                            </h1>

                            <h2 className="mx-auto mt-4 max-w-2xl text-base font-semibold leading-snug text-slate-700 sm:mt-5 sm:text-xl lg:text-2xl">
                                Your one-stop access to all HR systems
                            </h2>

                            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-500 sm:mt-4 sm:text-base">
                                Manage your profile, access HR services, and stay connected — all in one place.
                            </p>

                            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:mt-10 sm:flex-row sm:items-center sm:gap-4">
                                {canLogin && (
                                    <Link
                                        href={route('login')}
                                        className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all duration-300 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-500/30 sm:px-7"
                                    >
                                        <LoginIcon className="h-4 w-4" />
                                        <span>Log In to Portal</span>
                                        <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                    </Link>
                                )}

                                <a
                                    href="#services"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-blue-300 hover:text-blue-600 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 sm:px-7"
                                >
                                    Explore Services
                                </a>
                            </div>

                            <div className="mx-auto mt-10 flex max-w-md items-start justify-center gap-2.5 text-[11px] text-slate-500 sm:mt-12 sm:text-xs">
                                <ShieldCheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
                                <p className="text-left leading-relaxed">
                                    Secure access for authorized personnel only. All activities are logged and monitored.
                                </p>
                            </div>
                        </div>
                    </section>

                   

                    {/* ── ABOUT ───────────────────────────────── */}
                    <section className="scroll-mt-20 border-t border-slate-100 bg-slate-50/60 px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
                        <div className="mx-auto max-w-7xl">
                            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
                                <div className="relative">
                                    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-blue-900/5">
                                        <img src="/images/hroffice.jpg" alt="HRMO Office" loading="lazy" className="aspect-[4/3] w-full object-cover" />
                                    </div>
                                    <div aria-hidden="true" className="absolute -bottom-4 -right-4 hidden h-24 w-24 rounded-2xl bg-blue-600/10 blur-xl sm:block" />
                                </div>

                                <div>
                                    <SectionHeading align="left" eyebrow="About HRMO" title="Better people. Stronger organizations." />
                                    <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                                        <p>The Human Resource Management Office is dedicated to supporting the well-being, growth, and productivity of every employee in our organization.</p>
                                        <p>From recruitment and records to benefits and wellness, our office ensures that HR services are accessible, transparent, and efficient — so you can focus on doing your best work.</p>
                                    </div>

                                    <ul className="mt-6 space-y-3">
                                        {['Commitment to employee well-being', 'Streamlined HR processes', 'Transparent records and policies'].map((item, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                                                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                                                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                </span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── TEAM — connected network org chart ─── */}
                {/* ── TEAM — connected network org chart ─── */}
<section id="team" className="relative scroll-mt-20 overflow-hidden px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
    <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(191 219 254) 1px, transparent 0)',
            backgroundSize: '22px 22px',
            maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
        }}
    />

    <div className="relative mx-auto max-w-5xl">
        <SectionHeading
            eyebrow="Meet the team"
            title="The people behind HRMO"
            description="A connected team committed to serving every employee with care, professionalism, and integrity. Hover over a photo to see a different side of them."
        />

        {/* ── Desktop org chart (md+) ─────────── */}
        <div className="mt-16 hidden md:block">
            {/* Level 1 — Head */}
            <div className="flex justify-center">
                <div className="relative">
                    <TeamNode {...topMember} size="md" />
                    <div className="absolute left-1/2 top-full h-14 w-px -translate-x-1/2 bg-gradient-to-b from-blue-500 to-blue-400 sm:h-16" />
                    <span className="absolute left-1/2 top-[calc(100%+3.5rem)] h-2 w-2 -translate-x-1/2 -translate-y-1/2 animate-pulse-dot rounded-full bg-blue-500 shadow-[0_0_10px_3px_rgba(59,130,246,0.6)] sm:top-[calc(100%+4rem)]" />
                </div>
            </div>

            {/* Fan-out: L1 → 3 leads */}
            <ConnectorRow />

            {/* Level 2 — three leads */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6">
                {midTeam.map((member, i) => (
                    <div key={i} className="flex justify-center">
                        <TeamNode {...member} size="md" />
                    </div>
                ))}
            </div>

            {/* Fan-in + fan-out: 3 leads → 4 staff */}
            <MultiFanConnector parents={3} children={4} />

            {/* Level 3 — four staff */}
            <div className="grid grid-cols-4 gap-4 sm:gap-6">
                {bottomTeam.map((member, i) => (
                    <div key={i} className="flex justify-center">
                        <TeamNode {...member} size="md" />
                    </div>
                ))}
            </div>
        </div>

        {/* ── Mobile vertical spine (below md) ── */}
        <div className="mt-12 md:hidden">
            <MobileTeamList team={team} />
        </div>
    </div>
</section>

                    {/* ── CONNECT / FACEBOOK ──────────────────── */}
                    <section id="connect" className="scroll-mt-20 border-t border-slate-100 bg-slate-50/60 px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
                        <div className="mx-auto max-w-5xl">
                            <SectionHeading
                                eyebrow="Stay connected"
                                title="Follow us on Facebook"
                                description="Get the latest announcements, updates, and HR advisories straight from our official page."
                            />

                            <div className="mt-10 sm:mt-12">
                                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                                    <div className="grid grid-cols-1 gap-0 lg:grid-cols-5">
                                        <div className="flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-700 p-8 lg:col-span-2 lg:p-10">
                                            <div className="flex flex-col items-center text-center text-white">
                                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-inset ring-white/25 backdrop-blur-sm">
                                                    <FacebookIcon className="h-8 w-8" />
                                                </div>
                                                <p className="mt-4 text-lg font-bold tracking-tight">HRMO Official</p>
                                                <p className="mt-1 text-sm text-blue-100/80">Opol</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col justify-center p-6 sm:p-8 lg:col-span-3 lg:p-10">
                                            <h3 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">Never miss an announcement</h3>
                                            <p className="mt-2 text-sm leading-relaxed text-slate-500 sm:text-base">
                                                Our Facebook page is the fastest way to hear about trainings, deadlines, benefits updates, and office announcements. Follow us to stay in the loop.
                                            </p>

                                            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                                                <a
                                                    href={facebookUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all duration-300 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-500/30"
                                                >
                                                    <FacebookIcon className="h-4 w-4" />
                                                    <span>Follow on Facebook</span>
                                                    <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                                </a>

                                                <a
                                                    href="#services"
                                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-blue-300 hover:text-blue-600"
                                                >
                                                    Browse services
                                                </a>
                                            </div>

                                            <div className="mt-6 grid grid-cols-1 gap-3 border-t border-slate-100 pt-6 sm:grid-cols-3">
                                                {[
                                                    { icon: MapPinIcon, label: 'Opol, Misamis Oriental' },
                                                    { icon: PhoneIcon, label: '(088) 000-0000' },
                                                    { icon: MailIcon, label: 'hrmo@opol.gov.ph' },
                                                ].map((item, i) => (
                                                    <div key={i} className="flex items-center gap-2.5 text-xs text-slate-600 sm:text-[13px]">
                                                        <item.icon className="h-4 w-4 shrink-0 text-blue-500" />
                                                        <span className="truncate">{item.label}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ── FINAL CTA ───────────────────────────── */}
                    <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
                        <div className="mx-auto max-w-3xl rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-sky-50 px-6 py-12 text-center shadow-sm sm:px-10 sm:py-16">
                            <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                                Ready to access the portal?
                            </h2>
                            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-500 sm:text-base">
                                Log in with your HRMO credentials to manage your profile, file requests, and stay updated on everything HR.
                            </p>

                            {canLogin && (
                                <Link
                                    href={route('login')}
                                    className="group mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all duration-300 hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-blue-500/30"
                                >
                                    <LoginIcon className="h-4 w-4" />
                                    <span>Log In to Portal</span>
                                    <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                                </Link>
                            )}
                        </div>
                    </section>
                </main>

                {/* ── Footer ──────────────────────────────────── */}
                <footer className="border-t border-slate-200 bg-slate-50/60 px-5 py-10 sm:px-8 sm:py-12 lg:px-12">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
                            <div className="sm:col-span-2">
                                <Logo />
                                <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-500">
                                    The official HR portal of the Human Resource Management Office — built to make HR services simpler, faster, and more accessible for every employee.
                                </p>
                            </div>

                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">Quick Links</p>
                                <ul className="mt-4 space-y-2.5">
                                    {navLinks.map((link) => (
                                        <li key={link.href}>
                                            <a href={link.href} className="text-sm text-slate-600 transition-colors hover:text-blue-600">{link.label}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-400">Connect</p>
                                <ul className="mt-4 space-y-2.5">
                                    <li>
                                        <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-blue-600">
                                            <FacebookIcon className="h-4 w-4" />
                                            Facebook
                                        </a>
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-slate-600">
                                        <MailIcon className="h-4 w-4 text-slate-400" />
                                        hrmo@opol.gov.ph
                                    </li>
                                    <li className="flex items-center gap-2 text-sm text-slate-600">
                                        <PhoneIcon className="h-4 w-4 text-slate-400" />
                                        (088) 000-0000
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="mt-10 flex flex-col items-center gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-between">
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

            <style>{`
                html { scroll-behavior: smooth; }

                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
                    animation-delay: 0.1s;
                }

                @keyframes pulseDot {
                    0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
                    50%      { opacity: 1;   transform: translate(-50%, -50%) scale(1.6); }
                }
                .animate-pulse-dot {
                    animation: pulseDot 2.4s ease-in-out infinite;
                }

                @media (prefers-reduced-motion: reduce) {
                    html { scroll-behavior: auto; }
                    .animate-fade-in-up { animation: none; }
                    .animate-pulse-dot { animation: none; }
                }
            `}</style>
        </>
    );
}