import { useEffect, useState } from 'react';

// Module-level flag — persists across Inertia client-side navigations,
// resets on a full page reload (F5, direct URL, hard refresh).
let splashShownThisLoad = false;

export function useSplash() {
    const [show, setShow] = useState(() => !splashShownThisLoad);

    const dismiss = () => {
        splashShownThisLoad = true;
        setShow(false);
    };

    return { show, dismiss };
}

export default function SplashScreen({
    onDone,
    duration = 4000,
    logoSrc = '/images/hrlogo.png',
    brandName = 'HRMO PORTAL',
    tagline = 'Human Resource Management Office',
}) {
    // phase drives the whole animation:
    //   'intro'    → logo alone, centered, slightly scaled up
    //   'expanded' → logo shifted, text visible (below on mobile / beside on desktop)
    //   'fading'   → overlay fades out
    const [phase, setPhase] = useState('intro');
    const [hidden, setHidden] = useState(false);

    // Lock body scroll while the splash is on screen.
    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prev;
        };
    }, []);

    // Choreography — all timings scale off `duration`.
    useEffect(() => {
        const expandDelay = 900; // logo alone for ~0.9s
        const fadeOutMs = 700; // matches the CSS transition duration
        const fadeStart = Math.max(
            expandDelay + 700, // ensure expansion finishes first
            duration - fadeOutMs,
        );

        const t1 = setTimeout(() => setPhase('expanded'), expandDelay);
        const t2 = setTimeout(() => setPhase('fading'), fadeStart);
        const t3 = setTimeout(() => {
            setHidden(true);
            onDone?.();
        }, duration);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, [duration, onDone]);

    if (hidden) return null;

    const expanded = phase !== 'intro';
    const fading = phase === 'fading';

    return (
        <div
            role="status"
            aria-live="polite"
            aria-label={`Loading ${brandName}`}
            className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-blue-900 transition-opacity duration-700 ease-out ${
                fading ? 'opacity-0' : 'opacity-100'
            }`}
        >
            {/* ── Background decoration ─────────────────────── */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.08]"
                style={{
                    backgroundImage:
                        'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                    backgroundSize: '24px 24px',
                }}
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-blue-400/30 blur-3xl sm:h-72 sm:w-72"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-32 -left-20 h-64 w-64 rounded-full bg-blue-500/25 blur-3xl sm:h-80 sm:w-80"
            />

            {/* ── Center group ──────────────────────────────────
                Mobile: column — logo on top, text below.
                sm+   : row    — logo on left, text to the right.
            */}
            <div className="splash-group relative flex w-full max-w-3xl flex-col items-center justify-center px-5 sm:flex-row sm:px-6">
                {/* Logo tile — radius scales with the tile so the shape
                    stays consistent across breakpoints. */}
                <div
                    className={`splash-logo flex h-20 w-20 shrink-0 items-center justify-center rounded-[44px] bg-white p-2.5 shadow-2xl shadow-blue-950/40 transition-transform duration-700 ease-out sm:h-24 sm:w-24 sm:rounded-[55px] sm:p-3 md:h-28 md:w-28 md:p-4 ${
                        expanded ? 'scale-100' : 'scale-110'
                    }`}
                >
                    <img
                        src={logoSrc}
                        alt=""
                        draggable={false}
                        className="h-full w-full object-contain"
                    />
                </div>

                {/* Wordmark — animates in via max-height on mobile and
                    max-width on desktop, so the same transition works
                    in both layouts. */}
                <div
                    className={`overflow-hidden text-center transition-all duration-700 ease-out sm:text-left ${
                        expanded
                            ? 'mt-4 max-h-28 opacity-100 sm:mt-0 sm:ml-6 sm:max-h-40 sm:max-w-md'
                            : 'mt-0 max-h-0 opacity-0 sm:ml-0 sm:max-h-40 sm:max-w-0'
                    }`}
                >
                    <h1 className="whitespace-nowrap text-xl font-extrabold tracking-tight text-white sm:text-2xl md:text-3xl lg:text-4xl">
                        {brandName}
                    </h1>

                    <p className="mx-auto mt-1 max-w-[240px] text-balance text-[9px] font-semibold uppercase leading-tight tracking-[0.14em] text-blue-100/80 sm:mx-0 sm:max-w-none sm:whitespace-nowrap sm:text-[10px] sm:tracking-[0.18em] md:text-xs md:tracking-[0.2em]">
                        {tagline}
                    </p>
                </div>
            </div>

            {/* ── Progress bar at the bottom ────────────────── */}
            <div className="absolute bottom-14 left-1/2 w-[70%] max-w-[240px] -translate-x-1/2 sm:bottom-16 sm:w-56 sm:max-w-none">
                <div className="h-0.5 overflow-hidden rounded-full bg-white/15">
                    <div
                        className="splash-progress h-full rounded-full bg-gradient-to-r from-blue-200 to-white"
                        style={{ animationDuration: `${duration}ms` }}
                    />
                </div>
            </div>

            {/* ── Skip button ───────────────────────────────── */}
            <button
                type="button"
                onClick={onDone}
                className="absolute bottom-5 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-800 sm:bottom-6"
            >
                Skip
            </button>

            {/* ── Scoped animations ─────────────────────────── */}
            <style>{`
                /* Logo enters centered with a soft pop */
                @keyframes splashLogoIn {
                    from { opacity: 0; transform: scale(0.7); }
                    to   { opacity: 1; transform: scale(1.1); }
                }
                .splash-logo {
                    animation: splashLogoIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
                }

                /* Progress bar fills over the full duration */
                @keyframes splashProgress {
                    from { width: 0%; }
                    to   { width: 100%; }
                }
                .splash-progress {
                    animation-name: splashProgress;
                    animation-timing-function: linear;
                    animation-fill-mode: forwards;
                }

                /* Reduced motion: skip animation entirely, show final state */
                @media (prefers-reduced-motion: reduce) {
                    .splash-logo {
                        animation: none;
                        transform: scale(1);
                        opacity: 1;
                    }
                    .splash-progress {
                        animation: none;
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
}