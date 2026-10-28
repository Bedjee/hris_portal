const KEY = 'hrmo-portal-transition';
const TTL = 5000; // ms — flag expires so direct visits never show the flash

export function startPortalTransition() {
    try {
        sessionStorage.setItem(KEY, String(Date.now()));
    } catch {
        /* sessionStorage unavailable — transition simply won't play */
    }
}

export function consumePortalTransition() {
    try {
        const raw = sessionStorage.getItem(KEY);
        if (!raw) return false;
        sessionStorage.removeItem(KEY);
        const ts = parseInt(raw, 10);
        if (Number.isNaN(ts)) return false;
        return Date.now() - ts <= TTL;
    } catch {
        return false;
    }
}