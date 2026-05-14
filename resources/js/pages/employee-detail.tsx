import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ArrowUpRight, Crown, Sparkle } from 'lucide-react';
import { Pizza } from '@/components/stars/pizza';
import { leaderboard } from '@/routes';
import type { MilestoneBreakdown, StoreSummary } from '@/types/stars';

type EmployeeDetailProps = {
    store: StoreSummary;
    employee: {
        id: number;
        name: string;
        avatar_color: string | null;
        total: number;
        rank: number | null;
        breakdown: MilestoneBreakdown[];
    };
    target: number;
    brand: string;
};

const EASE = 'cubic-bezier(0.32, 0.72, 0, 1)';

export default function EmployeeDetailPage({
    store,
    employee,
    target,
    brand,
}: EmployeeDetailProps) {
    const isComplete = employee.total >= target;
    const gap = Math.max(0, target - employee.total);
    const bonus = Math.max(0, employee.total - target);
    const progress = target > 0
        ? Math.max(0, Math.min(100, Math.round((employee.total / target) * 100)))
        : 0;
    const maxedCount = employee.breakdown.filter(
        (row) => row.max_points > 0 && row.points >= row.max_points,
    ).length;
    const topMilestone = [...employee.breakdown].sort((a, b) => b.points - a.points)[0];

    return (
        <>
            <Head title={`${employee.name} — ${brand}`} />

            {/* ─── Header: refined brand bar ─────────────────────────── */}
            <header className="relative overflow-hidden bg-[var(--color-brand)]">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-[0.08]"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 18% 32%, white 1px, transparent 1px), radial-gradient(circle at 72% 64%, white 1px, transparent 1px)',
                        backgroundSize: '44px 44px',
                    }}
                />
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
                    <Link
                        href={leaderboard(store.number)}
                        prefetch
                        className="group inline-flex items-center gap-3 rounded-full bg-white/10 py-1.5 pr-4 pl-1.5 text-xs font-semibold tracking-[0.18em] text-white uppercase ring-1 ring-white/15 backdrop-blur-sm transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-white/15 active:scale-[0.97]"
                    >
                        <span className="flex size-7 items-center justify-center rounded-full bg-white/15 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-x-0.5">
                            <ArrowLeft className="size-3.5" strokeWidth={1.5} />
                        </span>
                        <span>Back to board</span>
                    </Link>

                    <div className="text-right">
                        <div className="font-display text-[10px] font-medium tracking-[0.42em] text-white/60 uppercase">
                            {store.number}
                        </div>
                        <div className="font-display text-base font-bold tracking-[0.14em] text-white uppercase">
                            {store.name ?? brand}
                        </div>
                    </div>
                </div>
            </header>

            {/* ─── Soft warm canvas + subtle ambient glow ──────────────── */}
            <div className="relative overflow-hidden bg-[#fafaf6]">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-32 -right-40 size-[720px] rounded-full opacity-60"
                    style={{
                        background:
                            'radial-gradient(closest-side, rgba(216, 90, 30, 0.07), transparent 70%)',
                    }}
                />
                {isComplete && (
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-40 -left-40 size-[640px] rounded-full opacity-50"
                        style={{
                            background:
                                'radial-gradient(closest-side, rgba(212, 160, 23, 0.10), transparent 70%)',
                        }}
                    />
                )}

                {/* ─── Hero: editorial split ─────────────────────────── */}
                <section className="relative mx-auto max-w-7xl px-6 pt-20 pb-32 md:pt-28 md:pb-40">
                    <div className="grid items-center gap-14 md:grid-cols-[1.35fr_1fr] md:gap-20">
                        {/* Left — typography + stats */}
                        <div className="hve-reveal" style={{ animationDelay: '80ms' }}>
                            <EyebrowTag>
                                {isComplete ? 'Champion · Target hit' : 'Crew profile'}
                            </EyebrowTag>

                            <h1 className="mt-8 max-w-full font-display text-6xl leading-[0.92] font-bold tracking-tight break-words text-zinc-950 uppercase sm:text-7xl md:text-[clamp(3.5rem,8vw,8.5rem)]">
                                {employee.name}
                            </h1>

                            <p className="mt-7 max-w-md text-lg leading-relaxed text-zinc-500">
                                {isComplete ? (
                                    <>
                                        Hit today&apos;s target with{' '}
                                        <span className="font-semibold text-zinc-900">
                                            {bonus > 0 ? `+${bonus} bonus pts` : 'zero margin'}
                                        </span>
                                        . {maxedCount > 0 && `${maxedCount} categor${maxedCount === 1 ? 'y' : 'ies'} maxed.`}
                                    </>
                                ) : gap === 0 ? (
                                    <>
                                        One push away from gold —{' '}
                                        <span className="font-semibold text-zinc-900">
                                            target locked in.
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <span className="font-semibold text-zinc-900">{gap} pt{gap === 1 ? '' : 's'}</span>{' '}
                                        away from today&apos;s target.{' '}
                                        {topMilestone && topMilestone.points > 0 && (
                                            <>Strongest in {topMilestone.name}.</>
                                        )}
                                    </>
                                )}
                            </p>

                            {/* Inline stat row — pure typography rhythm */}
                            <div className="mt-12 flex flex-wrap items-baseline gap-x-10 gap-y-6">
                                <StatInline
                                    value={employee.total}
                                    label="points scored"
                                    accent={isComplete ? '#D4A017' : undefined}
                                />
                                <Divider />
                                <StatInline
                                    value={employee.rank ? `#${employee.rank}` : '—'}
                                    label="store rank"
                                />
                                <Divider />
                                <StatInline
                                    value={isComplete ? `+${bonus}` : gap}
                                    suffix="pts"
                                    label={isComplete ? 'over target' : 'to target'}
                                    accent={isComplete ? '#D4A017' : '#D85A1E'}
                                />
                            </div>

                            {/* CTA — button-in-button */}
                            <div className="mt-12 flex flex-wrap items-center gap-3">
                                <Link
                                    href={leaderboard(store.number)}
                                    prefetch
                                    className="group inline-flex items-center gap-3 rounded-full bg-zinc-950 py-2 pr-2 pl-6 text-sm font-semibold tracking-tight text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-zinc-800 active:scale-[0.98]"
                                >
                                    <span>See full leaderboard</span>
                                    <span className="flex size-9 items-center justify-center rounded-full bg-white/10 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:-translate-y-[1px]">
                                        <ArrowUpRight className="size-4" strokeWidth={1.5} />
                                    </span>
                                </Link>

                                {isComplete && (
                                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-semibold tracking-[0.22em] text-amber-700 uppercase ring-1 ring-amber-200/70">
                                        <Crown className="size-3.5" strokeWidth={1.5} />
                                        Champion
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Right — Pizza in double-bezel frame */}
                        <div
                            className="hve-reveal flex justify-center md:justify-end"
                            style={{ animationDelay: '220ms' }}
                        >
                            <div
                                className={
                                    'relative rounded-[2.75rem] p-1.5 ring-1 transition-all duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] ' +
                                    (isComplete
                                        ? 'bg-gradient-to-br from-amber-100/70 via-amber-50/40 to-white ring-amber-200/60'
                                        : 'bg-gradient-to-br from-zinc-100/80 via-white to-zinc-50 ring-zinc-200/60')
                                }
                            >
                                <div
                                    className="rounded-[calc(2.75rem-0.375rem)] bg-white px-8 pt-8 pb-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_40px_80px_-40px_rgba(15,15,15,0.20)]"
                                >
                                    <div className="hve-float">
                                        <Pizza
                                            points={employee.total}
                                            target={target}
                                            size={340}
                                            employeeId={employee.id}
                                        />
                                    </div>

                                    {/* Progress ring strip */}
                                    <div className="mt-6 grid grid-cols-[auto_1fr_auto] items-center gap-3">
                                        <span className="font-display text-[10px] font-bold tracking-[0.3em] text-zinc-400 uppercase">
                                            Today
                                        </span>
                                        <div className="h-1 overflow-hidden rounded-full bg-zinc-100">
                                            <div
                                                className="h-full rounded-full transition-all duration-1000"
                                                style={{
                                                    width: `${progress}%`,
                                                    transitionTimingFunction: EASE,
                                                    background: isComplete
                                                        ? 'linear-gradient(90deg, #F5D061, #D4A017)'
                                                        : 'linear-gradient(90deg, #E8651F, #D85A1E)',
                                                }}
                                            />
                                        </div>
                                        <span className="font-display text-sm font-bold tabular-nums text-zinc-900">
                                            {progress}%
                                        </span>
                                    </div>
                                </div>

                                {/* Floating rank marker */}
                                {employee.rank !== null && employee.rank <= 3 && employee.total > 0 && (
                                    <div
                                        className="absolute -top-3 -left-3 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold tracking-[0.16em] text-white uppercase shadow-[0_12px_24px_-12px_rgba(0,0,0,0.3)]"
                                        style={{
                                            background:
                                                employee.rank === 1
                                                    ? 'linear-gradient(135deg, #F5D061, #D4A017)'
                                                    : employee.rank === 2
                                                      ? 'linear-gradient(135deg, #D4D4D4, #8E8E8E)'
                                                      : 'linear-gradient(135deg, #D89060, #8B5A2B)',
                                        }}
                                    >
                                        <Crown className="size-3" strokeWidth={1.75} />
                                        Rank {employee.rank}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ─── Breakdown: bento double-bezel grid ────────────── */}
                <section className="relative border-t border-zinc-200/60 py-24 md:py-32">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="hve-reveal mb-14 flex flex-col items-start justify-between gap-6 md:mb-16 md:flex-row md:items-end">
                            <div>
                                <EyebrowTag>Detail</EyebrowTag>
                                <h2 className="mt-5 font-display text-5xl leading-[0.95] font-bold tracking-tight text-zinc-950 uppercase md:text-7xl">
                                    Category
                                    <br />
                                    breakdown.
                                </h2>
                            </div>
                            <p className="max-w-sm text-base leading-relaxed text-zinc-500">
                                Today&apos;s score across {employee.breakdown.length} performance
                                {' '}categor{employee.breakdown.length === 1 ? 'y' : 'ies'}. Maxed entries earn a Champion ring.
                            </p>
                        </div>

                        {employee.breakdown.length === 0 ? (
                            <EmptyBreakdown />
                        ) : (
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
                                {employee.breakdown.map((row, index) => (
                                    <MilestoneCard
                                        key={row.milestone_id}
                                        row={row}
                                        delay={index * 70}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* ─── Footer: thin, refined ─────────────────────────── */}
                <footer className="border-t border-zinc-200/60 bg-zinc-950">
                    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-10 md:flex-row">
                        <Link
                            href={leaderboard(store.number)}
                            prefetch
                            className="group inline-flex items-center gap-2.5 text-xs font-semibold tracking-[0.22em] text-zinc-500 uppercase transition-colors duration-500 hover:text-white"
                        >
                            <ArrowLeft className="size-3.5 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-x-0.5" strokeWidth={1.5} />
                            <span>Back to {store.number}</span>
                        </Link>
                        <div className="font-display text-[11px] font-bold tracking-[0.32em] text-zinc-600 uppercase">
                            {brand}
                            <span className="mx-2 text-zinc-700">·</span>
                            <span className="text-zinc-500">Champions focus on the five.</span>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

/* ───────────────── Sub-components ───────────────── */

function EyebrowTag({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[10px] font-semibold tracking-[0.32em] text-zinc-600 uppercase ring-1 ring-zinc-200/70 shadow-[0_1px_2px_rgba(15,15,15,0.04)]">
            <Sparkle className="size-2.5" strokeWidth={1.5} />
            {children}
        </span>
    );
}

function StatInline({
    value,
    label,
    suffix,
    accent,
}: {
    value: string | number;
    label: string;
    suffix?: string;
    accent?: string;
}) {
    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-1.5">
                <span
                    className="font-display text-5xl font-bold tabular-nums tracking-tight md:text-6xl"
                    style={accent ? { color: accent } : undefined}
                >
                    {value}
                </span>
                {suffix && (
                    <span className="font-display text-base font-medium tracking-tight text-zinc-400">
                        {suffix}
                    </span>
                )}
            </div>
            <span className="font-display text-[10px] font-semibold tracking-[0.28em] text-zinc-500 uppercase">
                {label}
            </span>
        </div>
    );
}

function Divider() {
    return <span aria-hidden="true" className="hidden h-14 w-px bg-zinc-200 sm:block" />;
}

function MilestoneCard({
    row,
    delay,
}: {
    row: MilestoneBreakdown;
    delay: number;
}) {
    const maxed = row.max_points > 0 && row.points >= row.max_points;
    const pct = row.max_points > 0
        ? Math.min(100, Math.round((row.points / row.max_points) * 100))
        : 0;
    const empty = row.points === 0;

    return (
        <div
            className={
                'hve-reveal rounded-[2rem] p-1.5 ring-1 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 ' +
                (maxed
                    ? 'bg-gradient-to-br from-amber-100/70 via-amber-50/40 to-white ring-amber-200/60 hover:from-amber-100'
                    : 'bg-gradient-to-br from-zinc-100/70 via-white to-zinc-50/60 ring-zinc-200/60 hover:from-zinc-100')
            }
            style={{ animationDelay: `${300 + delay}ms` }}
        >
            <div className="rounded-[calc(2rem-0.375rem)] bg-white px-7 py-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_24px_48px_-30px_rgba(15,15,15,0.10)]">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                        <span
                            className="size-2.5 rounded-full ring-2 ring-white"
                            style={{ backgroundColor: row.color, boxShadow: `0 0 0 1px ${row.color}30` }}
                        />
                        <span className="font-display text-[11px] font-semibold tracking-[0.26em] text-zinc-600 uppercase">
                            {row.name}
                        </span>
                    </div>
                    {maxed && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100/80 px-2 py-0.5 text-[9px] font-bold tracking-[0.2em] text-amber-800 uppercase ring-1 ring-amber-200/60">
                            <Crown className="size-2.5" strokeWidth={1.75} />
                            Max
                        </span>
                    )}
                </div>

                <div className="mt-10 flex items-baseline gap-1.5">
                    <span
                        className={
                            'font-display text-7xl font-bold tabular-nums tracking-tight ' +
                            (empty ? 'text-zinc-300' : 'text-zinc-950')
                        }
                    >
                        {row.points}
                    </span>
                    <span className="font-display text-xl font-medium tabular-nums text-zinc-400">
                        / {row.max_points}
                    </span>
                </div>

                <div className="mt-7 h-1 overflow-hidden rounded-full bg-zinc-100">
                    <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                            width: `${pct}%`,
                            transitionTimingFunction: EASE,
                            background: maxed
                                ? 'linear-gradient(90deg, #F5D061, #D4A017)'
                                : row.color,
                        }}
                    />
                </div>

                <div className="mt-4 flex items-center justify-between text-[11px]">
                    <span className="font-display font-semibold tracking-[0.22em] text-zinc-400 uppercase tabular-nums">
                        {pct}% complete
                    </span>
                    {!maxed && !empty && (
                        <span className="font-display font-semibold tracking-[0.22em] text-zinc-400 uppercase tabular-nums">
                            +{row.max_points - row.points} to max
                        </span>
                    )}
                    {empty && (
                        <span className="font-display font-semibold tracking-[0.22em] text-zinc-400 uppercase">
                            Not yet
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

function EmptyBreakdown() {
    return (
        <div className="hve-reveal rounded-[2rem] bg-gradient-to-br from-zinc-100/70 via-white to-zinc-50/60 p-1.5 ring-1 ring-zinc-200/60">
            <div className="rounded-[calc(2rem-0.375rem)] bg-white px-12 py-20 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
                <h3 className="font-display text-2xl font-bold tracking-tight text-zinc-950 uppercase">
                    No categories yet
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-500">
                    Once the store sets up its milestones, they&apos;ll appear here.
                </p>
            </div>
        </div>
    );
}
