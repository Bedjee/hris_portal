<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="theme-color" content="#1d4ed8">
    <title>Authorize {{ $client->name }} · Opol Portal</title>

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=inter:400,500,600,700" rel="stylesheet" />

    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
                    },
                },
            },
        };
    </script>
</head>
<body class="min-h-[100dvh] overflow-x-hidden bg-slate-50 font-sans text-slate-900 antialiased">

    {{-- Decorative background (pointer-events-none, aria-hidden) --}}
    <div class="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div class="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-blue-200/50 blur-3xl"></div>
        <div class="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl"></div>
    </div>

    <main class="relative flex min-h-[100dvh] items-center justify-center px-4 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] sm:py-12">
        <div class="w-full max-w-md">

            {{-- Brand --}}
            <div class="mb-6 flex items-center justify-center gap-2.5">
                <div class="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 text-[11px] font-bold text-white shadow-sm shadow-blue-700/30">
                    OP
                </div>
                <span class="text-sm font-semibold tracking-tight text-slate-700">Opol Portal</span>
            </div>

            <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5">

                <div class="p-6 sm:p-8">

                    {{-- Client request --}}
                    <div class="flex items-start gap-3">
                        <div class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600">
                            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                 stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                            </svg>
                        </div>
                        <div class="min-w-0 pt-0.5">
                            <p class="text-xs font-semibold uppercase tracking-wider text-blue-700">
                                Authorization request
                            </p>
                            <h1 class="mt-0.5 text-lg font-semibold leading-snug tracking-tight text-slate-900">
                                Authorize {{ $client->name }}
                            </h1>
                        </div>
                    </div>

                    <p class="mt-4 text-sm leading-relaxed text-slate-600">
                        <strong class="font-semibold text-slate-900">{{ $client->name }}</strong>
                        is requesting access to your Opol Portal account. It will not be able to change your
                        data or read your password.
                    </p>

                    {{-- Signed in as --}}
                    <div class="mt-5">
                        <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Signed in as
                        </p>
                        <div class="mt-2 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                            <div class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-xs font-semibold text-white">
                                {{ strtoupper(mb_substr($user->name, 0, 1)) }}
                            </div>
                            <div class="min-w-0 flex-1">
                                <p class="truncate text-sm font-semibold text-slate-900">{{ $user->name }}</p>
                                <p class="truncate text-xs text-slate-500">&#64;{{ $user->username }}</p>
                            </div>
                        </div>
                    </div>

                    {{-- Permissions --}}
                    <div class="mt-5">
                        <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">
                            This app will receive
                        </p>
                        <div class="mt-2 flex flex-wrap gap-1.5">
                            @foreach (['Name', 'Username', 'Email', 'Office', 'Role', 'Employment status'] as $scope)
                                <span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 ring-1 ring-inset ring-emerald-600/20">
                                    <svg class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fill-rule="evenodd"
                                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                              clip-rule="evenodd"/>
                                    </svg>
                                    {{ $scope }}
                                </span>
                            @endforeach
                        </div>

                        <p class="mt-3 flex items-start gap-1.5 text-xs leading-relaxed text-slate-500">
                            <svg class="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" viewBox="0 0 24 24"
                                 fill="none" stroke="currentColor" stroke-width="2"
                                 stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                <path d="M7 11V7a5 5 0 0110 0v4"/>
                            </svg>
                            <span>Your password is never shared with {{ $client->name }}.</span>
                        </p>
                    </div>
                </div>

                {{-- Actions --}}
                <div class="border-t border-slate-100 bg-slate-50/70 p-4 sm:p-6">
                    {{-- On mobile: Authorize sits on top (primary first), Cancel below.
                         On sm+: Cancel on the left, Authorize on the right. --}}
                    <div class="flex flex-col-reverse gap-2 sm:flex-row">

                        <form method="post" action="{{ route('passport.authorizations.deny') }}" class="sm:flex-1">
                            @csrf
                            @method('DELETE')
                            <input type="hidden" name="state"      value="{{ $request->state }}">
                            <input type="hidden" name="client_id"  value="{{ $client->id }}">
                            <input type="hidden" name="auth_token" value="{{ $authToken }}">
                            <button type="submit"
                                    class="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 active:scale-[0.99]">
                                Cancel
                            </button>
                        </form>

                        <form method="post" action="{{ route('passport.authorizations.approve') }}" class="sm:flex-1">
                            @csrf
                            <input type="hidden" name="state"      value="{{ $request->state }}">
                            <input type="hidden" name="client_id"  value="{{ $client->id }}">
                            <input type="hidden" name="auth_token" value="{{ $authToken }}">
                            <button type="submit"
                                    class="w-full rounded-lg bg-blue-700 px-4 py-3 text-sm font-semibold text-white shadow-sm shadow-blue-700/30 transition hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 active:scale-[0.99]">
                                Authorize
                            </button>
                        </form>
                    </div>

                    <p class="mt-3 text-center text-[11px] leading-relaxed text-slate-400">
                        You can revoke access at any time from your account settings.
                    </p>
                </div>
            </div>
        </div>
    </main>

</body>
</html>