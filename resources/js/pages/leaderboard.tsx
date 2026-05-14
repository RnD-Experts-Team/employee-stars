import { Head, Link } from '@inertiajs/react';
import { Crown, LogIn, Pizza as PizzaIcon, Sparkles, Target, Trophy } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { PizzaCard } from '@/components/stars/pizza-card';
import { landing, login } from '@/routes';
import type { LeaderboardEmployee, Milestone, StoreSummary } from '@/types/stars';

type LeaderboardProps = {
    store: StoreSummary;
    employees: LeaderboardEmployee[];
    milestones: Milestone[];
    target: number;
    brand: string;
    title: string;
    tagline: string;
};

function formatNow(date: Date): string {
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

export default function Leaderboard({
    store,
    employees,
    milestones,
    target,
    brand,
    title,
    tagline,
}: LeaderboardProps) {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const id = setInterval(() => setNow(new Date()), 60_000);

        return () => clearInterval(id);
    }, []);

    const stats = useMemo(() => {
        const champions = employees.filter((e) => e.total >= target).length;
        const totalPoints = employees.reduce((sum, e) => sum + e.total, 0);
        const top = employees[0];
        const teamProgress = employees.length > 0
            ? Math.round((totalPoints / (employees.length * target)) * 100)
            : 0;

        return { champions, totalPoints, top, teamProgress };
    }, [employees, target]);

    return (
        <>
            <Head title={title} />

            <header className="relative overflow-hidden bg-[var(--color-brand)]">
                    <div className="pointer-events-none absolute inset-0 opacity-[0.08]"
                        style={{
                            backgroundImage:
                                'radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 60%, white 1px, transparent 1px)',
                            backgroundSize: '40px 40px',
                        }}
                    />

                    <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5">
                        <Link href={landing()} className="flex items-center gap-4">
                            <div className="flex size-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                                <PizzaIcon className="size-7 text-white" strokeWidth={2} />
                            </div>
                            <div>
                                <div className="font-display text-2xl font-bold tracking-wider text-white uppercase md:text-3xl">
                                    {brand}
                                </div>
                                <div className="font-display text-xs font-medium tracking-[0.3em] text-white/70 uppercase">
                                    {store.number}
                                    {store.name ? ` · ${store.name}` : ''}
                                </div>
                            </div>
                        </Link>

                        <Link
                            href={login()}
                            className="hidden items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase backdrop-blur-sm transition-all hover:bg-white/20 active:translate-y-px md:flex"
                            prefetch
                        >
                            <LogIn className="size-3.5" />
                            <span>Manager Sign In</span>
                        </Link>
                    </div>
                </header>

                <section className="mx-auto max-w-7xl px-6 pt-10 pb-6">
                    <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
                        <div>
                            <h1 className="font-display text-5xl font-bold tracking-tight text-zinc-900 uppercase md:text-6xl">
                                {title}
                            </h1>
                            {tagline && (
                                <p className="mt-3 font-display text-sm font-medium tracking-[0.35em] text-zinc-500 uppercase">
                                    {tagline}
                                </p>
                            )}
                        </div>

                        <div className="flex flex-col gap-2 text-right">
                            <div className="flex items-center gap-3 rounded-xl bg-zinc-100 px-4 py-2">
                                <div className="font-display text-xs font-bold tracking-widest text-zinc-500 uppercase">
                                    Today
                                </div>
                                <div className="font-display text-sm font-semibold text-zinc-900">
                                    {formatNow(now)}
                                </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-xl bg-[var(--color-brand)] px-4 py-2 text-white">
                                <div className="font-display text-xs font-bold tracking-widest uppercase opacity-80">
                                    Target
                                </div>
                                <div className="font-display text-sm font-bold">
                                    {target} pts
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-6 pb-8">
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                        <StatTile
                            label="Champions"
                            value={stats.champions}
                            sub={`of ${employees.length}`}
                            icon={<Crown className="size-5" />}
                            color="#D4A017"
                        />
                        <StatTile
                            label="Team Progress"
                            value={`${stats.teamProgress}%`}
                            sub="of team target"
                            icon={<Target className="size-5" />}
                            color="#2E9F45"
                        />
                        <StatTile
                            label="Total Stars"
                            value={stats.totalPoints}
                            sub={`across ${employees.length} crew`}
                            icon={<Sparkles className="size-5" />}
                            color="#1E6FD9"
                        />
                        <StatTile
                            label="Leader"
                            value={stats.top?.name ?? '—'}
                            sub={stats.top ? `${stats.top.total} pts` : 'no data yet'}
                            icon={<Trophy className="size-5" />}
                            color="#7B3FB8"
                        />
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        {milestones.map((m) => (
                            <span
                                key={m.id}
                                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wider text-white uppercase"
                                style={{ backgroundColor: m.color }}
                            >
                                {m.name}
                                <span className="rounded-full bg-white/25 px-1.5 text-[10px]">
                                    max {m.max_points}
                                </span>
                            </span>
                        ))}
                    </div>
                </section>

                <section className="mx-auto max-w-7xl px-6 pb-16">
                    {employees.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {employees.map((employee, idx) => (
                                <PizzaCard
                                    key={employee.id}
                                    storeNumber={store.number}
                                    employee={employee}
                                    target={target}
                                    index={idx}
                                />
                            ))}
                        </div>
                    )}
                </section>

                <footer className="border-t border-zinc-200 bg-zinc-900 py-6">
                    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 text-center md:flex-row md:text-left">
                        <div className="flex items-center gap-2 font-display text-sm font-bold tracking-widest text-white uppercase">
                            <Trophy className="size-4 text-[var(--color-brand-soft)]" />
                            <span>
                                Champions <span className="text-[var(--color-brand-soft)]">focus on the five.</span>
                                <span className="ml-1">Win every day.</span>
                            </span>
                        </div>
                        <Link
                            href={landing()}
                            className="text-xs font-medium tracking-widest text-zinc-500 uppercase transition-colors hover:text-white"
                            prefetch
                        >
                            All stores →
                        </Link>
                    </div>
                </footer>
        </>
    );
}

function StatTile({
    label,
    value,
    sub,
    icon,
    color,
}: {
    label: string;
    value: string | number;
    sub: string;
    icon: React.ReactNode;
    color: string;
}) {
    return (
        <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-4">
            <div className="flex items-center gap-2">
                <div
                    className="flex size-9 items-center justify-center rounded-xl text-white"
                    style={{ backgroundColor: color }}
                >
                    {icon}
                </div>
                <div className="font-display text-[11px] font-semibold tracking-[0.2em] text-zinc-500 uppercase">
                    {label}
                </div>
            </div>
            <div className="mt-3 truncate font-display text-3xl font-bold tracking-tight text-zinc-900">
                {value}
            </div>
            <div className="mt-1 text-xs text-zinc-500">{sub}</div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-300 bg-white px-6 py-20 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-zinc-100">
                <PizzaIcon className="size-8 text-zinc-400" strokeWidth={1.5} />
            </div>
            <h3 className="mt-5 font-display text-2xl font-bold tracking-tight text-zinc-900 uppercase">
                The board is empty
            </h3>
            <p className="mt-2 max-w-md text-sm text-zinc-500">
                Add employees and milestones in the manager dashboard, then start awarding stars.
            </p>
            <Link
                href={login()}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--color-brand)] px-5 py-2.5 text-xs font-semibold tracking-widest text-white uppercase transition-all hover:bg-[var(--color-brand-dark)] active:translate-y-px"
                prefetch
            >
                Manager sign in →
            </Link>
        </div>
    );
}
