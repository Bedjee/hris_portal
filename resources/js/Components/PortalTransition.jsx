const STYLE = `
    .pt-flash {
        position: fixed;
        inset: 0;
        z-index: 9999;
        pointer-events: none;
        background: radial-gradient(circle at 50% 50%,
            #ffffff 0%,
            #e0f2fe 5%,
            #a5f3fc 14%,
            #67e8f9 26%,
            #38bdf8 42%,
            #0ea5e9 64%,
            #0369a1 85%,
            #082f49 100%);
        will-change: opacity, transform;
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
        transform: translateZ(0);
    }

    /* ENTER — blooms in during the same window as the zoom */
    .pt-enter { animation: pt-in 280ms cubic-bezier(.4, 0, .2, 1) 100ms both; }
    @keyframes pt-in {
        from { opacity: 0; transform: translateZ(0) scale(0.85); }
        to   { opacity: 1; transform: translateZ(0) scale(1); }
    }

    /* EXIT — recedes quickly, page reveals */
    .pt-exit { animation: pt-out 280ms cubic-bezier(.4, 0, .2, 1) forwards; }
    @keyframes pt-out {
        from { opacity: 1; transform: translateZ(0) scale(1); }
        to   { opacity: 0; transform: translateZ(0) scale(1.2); }
    }

    @media (prefers-reduced-motion: reduce) {
        .pt-enter { animation: pt-rm 150ms ease-out both; }
        .pt-exit  { animation: pt-rm 150ms ease-out reverse forwards; }
        @keyframes pt-rm { from { opacity: 0; } to { opacity: 1; } }
    }
`;

export function PortalEnterOverlay({ active }) {
    if (!active) return null;
    return (
        <>
            <style>{STYLE}</style>
            <div className="pt-flash pt-enter" aria-hidden="true" />
        </>
    );
}

export function PortalExitOverlay() {
    return (
        <>
            <style>{STYLE}</style>
            <div className="pt-flash pt-exit" aria-hidden="true" />
        </>
    );
}