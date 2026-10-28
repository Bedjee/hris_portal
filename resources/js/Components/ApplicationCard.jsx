import { Link } from '@inertiajs/react';
import AppIcon from './AppIcon';

export default function ApplicationCard({ application }) {
    const href =
        application.sso_enabled && application.sso_initiate_url
            ? application.sso_initiate_url
            : application.url;

    const isExternal = typeof href === 'string' && /^https?:\/\//i.test(href);

    const card = (
        <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-900/5 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-700/20">
            {/* Soft corner glow */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-800 opacity-[0.06] blur-2xl transition-opacity duration-300 group-hover:opacity-[0.14]"
            />

            <div className="relative flex items-start gap-4">
                {/* Icon tile */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-700 to-blue-900 text-white shadow-sm shadow-blue-900/25">
                    <AppIcon name={application.icon} className="h-6 w-6" />
                </div>

                <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-semibold tracking-tight text-slate-900">
                        {application.name}
                    </h3>
                    {application.description && (
                        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-500">
                            {application.description}
                        </p>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="relative mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <div className="flex min-w-0 items-center gap-2">
                    {application.sso_enabled && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-800 ring-1 ring-inset ring-blue-100">
                            <span
                                aria-hidden="true"
                                className="h-1.5 w-1.5 rounded-full bg-blue-700"
                            />
                            SSO
                        </span>
                    )}
                </div>

                <span className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-blue-800 transition-transform duration-200 group-hover:translate-x-0.5">
                    Open
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
                </span>
            </div>
        </article>
    );

    if (isExternal) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="block h-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
            >
                {card}
            </a>
        );
    }

    return (
        <Link
            href={href || '#'}
            className="block h-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
        >
            {card}
        </Link>
    );
}