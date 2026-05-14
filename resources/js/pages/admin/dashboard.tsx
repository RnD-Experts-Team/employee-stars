import { Head, Link } from '@inertiajs/react';
import { Crown, Pizza as PizzaIcon, Sparkles, Target, Users } from 'lucide-react';
import { leaderboard } from '@/routes';
import admin from '@/routes/admin';

type Stats = {
    employees: number;
    milestones: number;
    target: number;
    hit_target: number;
    total_points: number;
};

type AdminDashboardProps = {
    stats: Stats;
    store: { id: number; number: string; name: string | null };
};

export default function AdminDashboard({ stats, store }: AdminDashboardProps) {
    const percentHit = stats.employees > 0
        ? Math.round((stats.hit_target / stats.employees) * 100)
        : 0;

    return (
        <>
            <Head title="Manager Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
                    <div>
                        <div className="font-display text-xs font-bold tracking-[0.3em] text-muted-foreground uppercase">
                            {store.number}
                            {store.name ? ` · ${store.name}` : ''}
                        </div>
                        <h1 className="mt-1 font-display text-4xl font-bold tracking-tight uppercase">
                            Manager dashboard
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Watch the team progress toward today&apos;s target.
                        </p>
                    </div>
                    <Link
                        href={leaderboard(store.number)}
                        target="_blank"
                        className="inline-flex items-center gap-2 rounded-full bg-[var(--color-brand)] px-5 py-2.5 text-xs font-semibold tracking-widest text-white uppercase transition-all hover:bg-[var(--color-brand-dark)] active:translate-y-px"
                    >
                        <PizzaIcon className="size-4" />
                        Open public board
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <StatCard
                        label="Active employees"
                        value={stats.employees}
                        icon={<Users className="size-5" />}
                        color="#1E6FD9"
                    />
                    <StatCard
                        label="Active milestones"
                        value={stats.milestones}
                        icon={<Sparkles className="size-5" />}
                        color="#2E9F45"
                    />
                    <StatCard
                        label="Target points"
                        value={stats.target}
                        icon={<Target className="size-5" />}
                        color="#E8651F"
                        link={admin.settings.edit()}
                    />
                    <StatCard
                        label="Hit target"
                        value={`${stats.hit_target} (${percentHit}%)`}
                        icon={<Crown className="size-5" />}
                        color="#D4A017"
                    />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <ActionCard
                        title="Manage employees"
                        body="Add, rename, or deactivate the crew on the board."
                        href={admin.employees.index()}
                    />
                    <ActionCard
                        title="Manage milestones"
                        body="Configure categories like Time, Cleaning, Standards. Set per-category caps."
                        href={admin.milestones.index()}
                    />
                    <ActionCard
                        title="Update scoreboard"
                        body="Enter today's points per employee per milestone in the matrix."
                        href={admin.scoreboard.index()}
                    />
                </div>
            </div>
        </>
    );
}

function StatCard({
    label,
    value,
    icon,
    color,
    link,
}: {
    label: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    link?: ReturnType<typeof admin.settings.edit>;
}) {
    const content = (
        <div className="rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
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
            <div className="mt-3 font-display text-3xl font-bold tracking-tight">{value}</div>
        </div>
    );

    if (link) {
        return <Link href={link}>{content}</Link>;
    }

    return content;
}

function ActionCard({
    title,
    body,
    href,
}: {
    title: string;
    body: string;
    href: ReturnType<typeof admin.employees.index>;
}) {
    return (
        <Link
            href={href}
            className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-[var(--color-brand)] hover:shadow-md"
        >
            <h3 className="font-display text-lg font-bold tracking-tight uppercase">
                {title}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold tracking-widest text-[var(--color-brand)] uppercase">
                Open
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </span>
        </Link>
    );
}
