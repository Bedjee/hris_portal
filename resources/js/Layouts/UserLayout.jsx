import PortalLayout, { BottomNavIcons } from './PortalLayout';

const NAV = [
    { href: '/dashboard', label: 'Dashboard' },
];

const ADMIN_NAV = [
    { href: '/admin/users',        label: 'Users' },
    { href: '/admin/applications', label: 'Applications' },
    { href: '/admin/audit-logs',   label: 'Audit' },
];

// ─────────────────────────────────────────────────────────────
// Mobile bottom nav — regular user
// Uncomment each item once the matching route exists.
// ─────────────────────────────────────────────────────────────
const BOTTOM_NAV = [
    { href: '/dashboard', label: 'Home', icon: BottomNavIcons.home },
    // { href: '/applications', label: 'Applications', icon: BottomNavIcons.applications },
    // { href: '/notices',      label: 'Notices',      icon: BottomNavIcons.notices },
    // { href: '/profile',      label: 'Profile',      icon: BottomNavIcons.profile },
];

// ─────────────────────────────────────────────────────────────
// Mobile bottom nav — admins get the admin shortcuts too
// (Home · Users · Apps · Audit · Menu = 5 tabs)
// ─────────────────────────────────────────────────────────────
const ADMIN_BOTTOM_NAV = [
    { href: '/dashboard',          label: 'Home',  icon: BottomNavIcons.home },
    { href: '/admin/users',        label: 'Users', icon: BottomNavIcons.users },
    { href: '/admin/applications', label: 'Apps',  icon: BottomNavIcons.applications },
    { href: '/admin/audit-logs',   label: 'Audit', icon: BottomNavIcons.audit },
];

export default function UserLayout({ children, title }) {
    return (
        <PortalLayout
            nav={NAV}
            adminNav={ADMIN_NAV}
            bottomNav={BOTTOM_NAV}
            adminBottomNav={ADMIN_BOTTOM_NAV}
            title={title}
        >
            {children}
        </PortalLayout>
    );
}