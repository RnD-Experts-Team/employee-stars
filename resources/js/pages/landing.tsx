import { Head, Link } from '@inertiajs/react';
import { ArrowUpRight, LogIn, Pizza, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { leaderboard, login } from '@/routes';
import type { StoreSummary } from '@/types/stars';

type LandingProps = {
    stores: StoreSummary[];
    brand: string;
};

export default function LandingPage({ stores, brand }: LandingProps) {
    const [query, setQuery] = useState('');

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();

        if (!q) {
return stores;
}

        return stores.filter(
            (s) =>
                s.number.toLowerCase().includes(q) ||
                (s.name?.toLowerCase().includes(q) ?? false),
        );
    }, [stores, query]);

    return (
        <>
            <Head title={brand} />

            <header className="relative overflow-hidden bg-[var(--color-brand)]">
                    <div
                        className="pointer-events-none absolute inset-0 opacity-[0.08]"
                        style={{
                            backgroundImage:
                                'radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)',
                            backgroundSize: '40px 40px',
                        }}
                    />
                    <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5">
                        <div className="flex items-center gap-4">
                            <div className="flex size-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                                <Pizza className="size-7 text-white" strokeWidth={2} />
                            </div>
                            <div>
                                <div className="font-display text-3xl font-bold tracking-wider text-white uppercase">
                                    {brand}
                                </div>
                                <div className="font-display text-xs font-medium tracking-[0.3em] text-white/70 uppercase">
                                    Store performance network
                                </div>
                            </div>
                        </div>

                        <Link
                            href={login()}
                            className="hidden items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase backdrop-blur-sm transition-all hover:bg-white/20 active:translate-y-px md:flex"
                            prefetch
                        >
                            <LogIn className="size-3.5" />
                            Manager sign in
                        </Link>
                    </div>
                </header>

                <section className="mx-auto max-w-7xl px-6 pt-16 pb-10">
                    <div className="grid items-end gap-8 md:grid-cols-[2fr_1fr]">
                        <div>
                            <div className="font-display text-xs font-bold tracking-[0.4em] text-zinc-400 uppercase">
                                Pick a store
                            </div>
                            <h1 className="mt-3 font-display text-5xl font-bold tracking-tight text-zinc-900 uppercase md:text-7xl">
                                Find your daily board.
                            </h1>
                            <p className="mt-4 max-w-xl text-base leading-relaxed text-zinc-600">
                                Every PNE location runs its own daily scoreboard. Find a store
                                below and you&apos;ll see who&apos;s ahead, who&apos;s closing the gap, and
                                who already hit today&apos;s target.
                            </p>
                        </div>

                        <div className="relative">
                            <Search className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-zinc-400" />
                            <input
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search store number or name"
                                className="w-full rounded-full border border-zinc-200 bg-white py-3 pr-4 pl-11 text-sm shadow-sm focus:border-[var(--color-brand)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)]"
                            />
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-6 pb-20">
                    {stores.length === 0 ? (
                        <EmptyState />
                    ) : filtered.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-12 text-center text-sm text-zinc-500">
                            No stores match &ldquo;{query}&rdquo;.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {filtered.map((store, index) => (
                                <Link
                                    key={store.id}
                                    href={leaderboard(store.number)}
                                    className="group relative flex items-center justify-between gap-4 rounded-2xl border border-zinc-200/70 bg-white px-5 py-4 transition-all hover:-translate-y-0.5 hover:border-[var(--color-brand)] hover:shadow-[0_8px_24px_-12px_rgba(216,90,30,0.25)]"
                                    style={{ animationDelay: `${index * 40}ms` }}
                                >
                                    <div className="min-w-0">
                                        <div className="font-mono text-xs tracking-wider text-zinc-400">
                                            {store.number}
                                        </div>
                                        <div className="mt-1 truncate font-display text-lg font-bold tracking-tight uppercase">
                                            {store.name ?? 'Unnamed location'}
                                        </div>
                                    </div>
                                    <div className="flex size-9 items-center justify-center rounded-full bg-zinc-100 transition-colors group-hover:bg-[var(--color-brand)] group-hover:text-white">
                                        <ArrowUpRight className="size-4" strokeWidth={2} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                <footer className="border-t border-zinc-200 bg-zinc-900 py-6">
                    <div className="mx-auto flex max-w-7xl items-center justify-center px-6 text-center">
                        <div className="font-display text-xs font-bold tracking-[0.3em] text-zinc-500 uppercase">
                            Champions focus on the five. Win every day.
                        </div>
                    </div>
                </footer>
        </>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white px-6 py-20 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-zinc-100">
                <Pizza className="size-8 text-zinc-400" strokeWidth={1.5} />
            </div>
            <h3 className="mt-5 font-display text-2xl font-bold tracking-tight text-zinc-900 uppercase">
                No stores yet
            </h3>
            <p className="mt-2 max-w-md text-sm text-zinc-500">
                A super admin needs to add the first store from the manager dashboard.
            </p>
            <Link
                href={login()}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--color-brand)] px-5 py-2.5 text-xs font-semibold tracking-widest text-white uppercase"
            >
                Sign in →
            </Link>
        </div>
    );
}
