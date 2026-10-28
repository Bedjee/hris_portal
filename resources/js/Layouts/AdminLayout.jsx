import PortalLayout from './PortalLayout';

const NAV = [
    { href: '/dashboard', label: 'Dashboard' },
];

const ADMIN_NAV = [
    { href: '/admin/users',        label: 'Users' },
     { href: '/admin/offices',      label: 'Offices' },
    { href: '/admin/applications', label: 'Applications' },

    { href: '/admin/audit-logs',   label: 'Audit' },
];

export default function AdminLayout({ children, title }) {
    // ─── DEBUG ───
    console.log('[AdminLayout] rendering, ADMIN_NAV =', ADMIN_NAV);
    // ─────────────

    return (
        <PortalLayout nav={NAV} adminNav={ADMIN_NAV} title={title}>
            {children}
        </PortalLayout>
    );
}