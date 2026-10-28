// Modern, geometric icon set for applications.
// 24×24 viewBox, 1.5 stroke width, rounded caps — Lucide/Phosphor-inspired.
// The key is persisted on the application record's `icon` field.

const ICONS = {
    document: (
        <>
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <path d="M8 13h8" />
            <path d="M8 17h5" />
        </>
    ),
    chart: (
        <>
            <path d="M3 3v16a2 2 0 0 0 2 2h16" />
            <path d="m7 15 3-3 3 3 5-6" />
        </>
    ),
    users: (
        <>
            <path d="M16 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
            <circle cx="9.5" cy="7" r="3.5" />
            <path d="M21 20v-2a4 4 0 0 0-3-3.87" />
            <path d="M15.5 3.13a3.5 3.5 0 0 1 0 6.74" />
        </>
    ),
    calendar: (
        <>
            <rect x="3" y="4.5" width="18" height="17" rx="2.5" />
            <path d="M8 2.5v4" />
            <path d="M16 2.5v4" />
            <path d="M3 10h18" />
            <path d="M8 14h.01" />
            <path d="M12 14h.01" />
            <path d="M16 14h.01" />
            <path d="M8 18h.01" />
            <path d="M12 18h.01" />
        </>
    ),
    clock: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
        </>
    ),
    mail: (
        <>
            <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
            <path d="m3 7 8.2 5.5a1.5 1.5 0 0 0 1.6 0L21 7" />
        </>
    ),
    settings: (
        <>
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1.03-1.56V3a2 2 0 1 1 4 0v.09A1.7 1.7 0 0 0 15 4.6a1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9a1.7 1.7 0 0 0 1.56 1.03H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1Z" />
        </>
    ),
    database: (
        <>
            <ellipse cx="12" cy="5.5" rx="8.5" ry="3" />
            <path d="M3.5 5.5v13c0 1.66 3.8 3 8.5 3s8.5-1.34 8.5-3v-13" />
            <path d="M3.5 12c0 1.66 3.8 3 8.5 3s8.5-1.34 8.5-3" />
        </>
    ),
    shield: (
        <>
            <path d="M12 21.5c4.5-2 7.5-5.5 7.5-10V5.5L12 2.5 4.5 5.5V11.5c0 4.5 3 8 7.5 10Z" />
            <path d="m9 12 2 2 4-4" />
        </>
    ),
    folder: (
        <>
            <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h3.3a2 2 0 0 1 1.5.7L11.5 7H19a2.5 2.5 0 0 1 2.5 2.5v8A2.5 2.5 0 0 1 19 20H5.5A2.5 2.5 0 0 1 3 17.5Z" />
        </>
    ),
    clipboard: (
        <>
            <rect x="8" y="2.5" width="8" height="3.5" rx="1.5" />
            <path d="M16 4.5h1.5A2.5 2.5 0 0 1 20 7v12a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 19V7a2.5 2.5 0 0 1 2.5-2.5H8" />
            <path d="M9 12h6" />
            <path d="M9 16h4" />
        </>
    ),
    briefcase: (
        <>
            <rect x="2.5" y="7.5" width="19" height="13" rx="2.5" />
            <path d="M16 7.5V5.5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            <path d="M2.5 13h19" />
        </>
    ),
    globe: (
        <>
            <circle cx="12" cy="12" r="9" />
            <path d="M3 12h18" />
            <path d="M12 3c2.4 2.5 3.6 5.6 3.6 9s-1.2 6.5-3.6 9c-2.4-2.5-3.6-5.6-3.6-9S9.6 5.5 12 3Z" />
        </>
    ),
    building: (
        <>
            <rect x="5" y="2.5" width="14" height="19" rx="2" />
            <path d="M10 21.5v-5h4v5" />
            <path d="M9 6.5h.01" />
            <path d="M15 6.5h.01" />
            <path d="M9 10.5h.01" />
            <path d="M15 10.5h.01" />
            <path d="M9 14.5h.01" />
            <path d="M15 14.5h.01" />
        </>
    ),
    'credit-card': (
        <>
            <rect x="2.5" y="5.5" width="19" height="13" rx="2.5" />
            <path d="M2.5 10.5h19" />
            <path d="M6.5 15h2" />
        </>
    ),
    bell: (
        <>
            <path d="M6 9a6 6 0 0 1 12 0c0 4.5 1.5 6 1.5 6h-15S6 13.5 6 9Z" />
            <path d="M10.5 20a1.9 1.9 0 0 0 3 0" />
        </>
    ),
    link: (
        <>
            <path d="M10.5 13.5a4 4 0 0 0 5.66 0l2.83-2.83a4 4 0 1 0-5.66-5.66l-1 1" />
            <path d="M13.5 10.5a4 4 0 0 0-5.66 0L5 13.34a4 4 0 1 0 5.66 5.66l1-1" />
        </>
    ),
    key: (
        <>
            <circle cx="7.5" cy="15.5" r="3.5" />
            <path d="m10.5 12.5 8-8" />
            <path d="m15 7.5 3 3" />
            <path d="m18 4.5 2.5 2.5" />
        </>
    ),
    lock: (
        <>
            <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
            <path d="M8 10.5V7a4 4 0 1 1 8 0v3.5" />
        </>
    ),
    desktop: (
        <>
            <rect x="2.5" y="4" width="19" height="13" rx="2.5" />
            <path d="M8 21h8" />
            <path d="M12 17v4" />
        </>
    ),
    cart: (
        <>
            <circle cx="9.5" cy="20" r="1.5" />
            <circle cx="18.5" cy="20" r="1.5" />
            <path d="M2.5 3h2.4l2.6 12.4a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 1.97-1.6L22 7H6" />
        </>
    ),
    cloud: (
        <path d="M17.5 19a4.5 4.5 0 1 0-1.4-8.8 5.5 5.5 0 0 0-10.8 1.5A3.5 3.5 0 0 0 6.5 19Z" />
    ),
    code: (
        <>
            <path d="m16 18 6-6-6-6" />
            <path d="m8 6-6 6 6 6" />
        </>
    ),
    book: (
        <>
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
        </>
    ),
    heart: (
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 1 0-7.8 7.8l1 1.1L12 21.4l7.8-7.9 1-1.1a5.5 5.5 0 0 0 0-7.8Z" />
    ),
    ticket: (
        <>
            <path d="M2.5 9a3 3 0 0 1 0 6v3A2.5 2.5 0 0 0 5 20.5h14a2.5 2.5 0 0 0 2.5-2.5v-3a3 3 0 0 1 0-6V6A2.5 2.5 0 0 0 19 3.5H5A2.5 2.5 0 0 0 2.5 6Z" />
            <path d="M13 5v2" />
            <path d="M13 11v2" />
            <path d="M13 17v2" />
        </>
    ),
    map: (
        <>
            <path d="M2.5 6.5 9 3.5l6 3 6.5-3v13.5L15 20l-6-3-6.5 3Z" />
            <path d="M9 3.5v13.5" />
            <path d="M15 6.5V20" />
        </>
    ),
    home: (
        <>
            <path d="m3 9.5 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
            <path d="M9.5 21.5v-7h5v7" />
        </>
    ),
    phone: (
        <path d="M22 16.9v2.8a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h2.8a2 2 0 0 1 2 1.7 12.8 12.8 0 0 0 .7 2.8 2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.4-1.1a2 2 0 0 1 2.1-.5 12.8 12.8 0 0 0 2.8.7 2 2 0 0 1 1.7 2Z" />
    ),
    activity: (
        <>
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </>
    ),
    box: (
        <>
            <path d="m21 8-9-5-9 5 9 5 9-5Z" />
            <path d="M3 8v8l9 5 9-5V8" />
            <path d="M12 13v8" />
        </>
    ),
    layers: (
        <>
            <path d="m12 2.5 9.5 5-9.5 5-9.5-5Z" />
            <path d="m2.5 12.5 9.5 5 9.5-5" />
            <path d="m2.5 17 9.5 5 9.5-5" />
        </>
    ),
    zap: (
        <path d="M13 2 3.5 13.5H12l-1 8.5 9.5-11.5H12Z" />
    ),
    target: (
        <>
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="5" />
            <circle cx="12" cy="12" r="1.5" />
        </>
    ),
    pie: (
        <>
            <path d="M21.2 15.9A9 9 0 1 1 8 2.9" />
            <path d="M22 12A10 10 0 0 0 12 2v10Z" />
        </>
    ),
    trending: (
        <>
            <path d="m3 17 6-6 4 4 8-8" />
            <path d="M17 7h4v4" />
        </>
    ),
    wallet: (
        <>
            <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h13A2.5 2.5 0 0 1 21 7.5v9A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5Z" />
            <path d="M16 12h2" />
            <path d="M3 9h18" />
        </>
    ),
    receipt: (
        <>
            <path d="M4 3.5v18l2.5-1.5L9 21.5 12 20l3 1.5 2.5-1.5L20 21.5v-18Z" />
            <path d="M8 8h8" />
            <path d="M8 12h8" />
            <path d="M8 16h5" />
        </>
    ),
    upload: (
        <>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <path d="m7 9 5-5 5 5" />
            <path d="M12 4v12" />
        </>
    ),
    download: (
        <>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <path d="m7 11 5 5 5-5" />
            <path d="M12 16V4" />
        </>
    ),
    filter: (
        <path d="M3 5h18l-7 8v6l-4 2v-8Z" />
    ),
    search: (
        <>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
        </>
    ),
    file: (
        <>
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        </>
    ),
    graduation: (
        <>
            <path d="m2 9 10-5 10 5-10 5Z" />
            <path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" />
            <path d="M22 9v6" />
        </>
    ),
};

export const ICON_KEYS = Object.keys(ICONS);

export default function AppIcon({ name = 'document', className = 'h-5 w-5' }) {
    const content = ICONS[name] ?? ICONS.document;
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            {content}
        </svg>
    );
}