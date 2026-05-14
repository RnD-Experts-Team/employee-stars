import { Head, Link, router } from '@inertiajs/react';
import { ArrowRight, Building2, Crown, Sparkles, Trophy } from 'lucide-react';
import { leaderboard } from '@/routes';
import admin from '@/routes/admin';
import type { OverviewStore } from '@/types/stars';

type OverviewPageProps = {
    stores: OverviewStore[];
};

export default function OverviewPage({ stores }: OverviewPageProps) {
    const network = stores.reduce(
        (acc, store) => ({
            employees: acc.employees + store.employees,
            champions: acc.champions + store.champions,
            points: acc.points + store.total_points,
        }),
        { employees: 0, champions: 0, points: 0 },
    );

    const switchToStore = (store: OverviewStore) => {
        router.post(admin.stores.switch(store.number).url);
    };

    return (
        <>
            <Head title="All stores overview" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <header>
                    <h1 className="font-display text-4xl font-bold tracking-tight uppercase">
                        Network overview
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Cross-store snapshot of {stores.length} location{stores.length === 1 ? '' : 's'}.
                    </p>
                </header>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <NetworkStat
                        label="Active employees"
                        value={network.employees}
                        icon={<Building2 className="size-5" />}
                        color="#1E6FD9"
                    />
                    <NetworkStat
                        label="Champions"
                        value={network.champions}
                        icon={<Crown className="size-5" />}
                        color="#D4A017"
                    />
                    <NetworkStat
                        label="Total stars"
                        value={network.points}
                        icon={<Sparkles className="size-5" />}
                        color="#2E9F45"
                    />
                </div>

                {stores.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
                        <h3 className="font-display text-xl font-bold tracking-tight uppercase">
                            No stores yet
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Create your first store to populate the network overview.
                        </p>
                        <Link
                            href={admin.stores.index()}
                            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--color-brand)] px-5 py-2.5 text-xs font-semibold tracking-widest text-white uppercase"
                        >
                            Open stores admin →
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {stores.map((store) => (
                            <StoreCard
                                key={store.id}
                                store={store}
                                onSwitch={() => switchToStore(store)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

function NetworkStat({
    label,
    value,
    icon,
    color,
}: {
    label: string;
    value: number;
    icon: React.ReactNode;
    color: string;
}) {
    return (
        <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2">
                <div
                    className="flex size-9 items-center justify-center rounded-xl text-white"
                    style={{ backgroundColor: color }}
                >
                    {icon}
                </div>
                <span className="font-display text-[11px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                    {label}
                </span>
            </div>
            <div className="mt-3 font-display text-3xl font-bold tracking-tight tabular-nums">
                {value}
            </div>
        </div>
    );
}

function StoreCard({ store, onSwitch }: { store: OverviewStore; onSwitch: () => void }) {
    return (
        <div className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <div className="font-mono text-xs tracking-wider text-muted-foreground">
                        {store.number}
                    </div>
                    <div className="mt-0.5 truncate font-display text-xl font-bold tracking-tight uppercase">
                        {store.name ?? 'Unnamed'}
                    </div>
                </div>
                {!store.is_active && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold tracking-widest text-zinc-500 uppercase">
                        Hidden
                    </span>
                )}
            </div>

            <div className="grid grid-cols-3 gap-2 border-y border-border py-3">
                <Mini label="Crew" value={store.employees} />
                <Mini label="Champs" value={store.champions} accent="#D4A017" />
                <Mini label="Stars" value={store.total_points} />
            </div>

            <div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-display tracking-widest uppercase">
                        Team progress
                    </span>
                    <span className="font-display font-bold tabular-nums">
                        {store.team_progress}%
                    </span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                            width: `${Math.min(100, store.team_progress)}%`,
                            background:
                                store.team_progress >= 80
                                    ? 'linear-gradient(90deg, #F5D061, #D4A017)'
                                    : 'linear-gradient(90deg, #E8651F, #D85A1E)',
                        }}
                    />
                </div>
            </div>

            {store.leader && (
                <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2">
                    <Trophy className="size-4 text-amber-600" />
                    <span className="truncate text-xs">
                        <span className="font-semibold">{store.leader.name}</span>
                        <span className="text-muted-foreground"> leading with </span>
                        <span className="font-display font-bold tabular-nums">
                            {store.leader.points} pts
                        </span>
                    </span>
                </div>
            )}

            <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                <Link
                    href={leaderboard(store.number)}
                    className="text-xs font-semibold tracking-widest text-[var(--color-brand)] uppercase transition-colors hover:text-[var(--color-brand-dark)]"
                >
                    Public board →
                </Link>
                <button
                    type="button"
                    onClick={onSwitch}
                    className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 px-3 py-1.5 text-xs font-semibold tracking-widest text-white uppercase transition-all hover:bg-zinc-800 active:translate-y-px"
                >
                    Manage
                    <ArrowRight className="size-3.5" />
                </button>
            </div>
        </div>
    );
}

function Mini({
    label,
    value,
    accent,
}: {
    label: string;
    value: number;
    accent?: string;
}) {
    return (
        <div>
            <div className="font-display text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                {label}
            </div>
            <div
                className="mt-0.5 font-display text-xl font-bold tabular-nums"
                style={accent ? { color: accent } : undefined}
            >
                {value}
            </div>
        </div>
    );
}
