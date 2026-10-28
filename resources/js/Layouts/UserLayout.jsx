import PortalLayout from './PortalLayout';

const NAV = [
    { href: '/dashboard', label: 'Dashboard' },
];

const ADMIN_NAV = [
    { href: '/admin/users',        label: 'Users' },
    { href: '/admin/applications', label: 'Applications' },
    { href: '/admin/audit-logs',   label: 'Audit' },
];

export default function UserLayout({ children, title }) {
    // ─── DEBUG ───
    console.log('[UserLayout] rendering, ADMIN_NAV =', ADMIN_NAV);
    // ─────────────

    return (
        <PortalLayout nav={NAV} adminNav={ADMIN_NAV} title={title}>
            {children}
        </PortalLayout>
    );
}