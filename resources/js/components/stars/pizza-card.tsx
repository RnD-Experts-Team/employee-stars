import { Link } from '@inertiajs/react';
import { Crown, Trophy } from 'lucide-react';
import { memo } from 'react';
import employeeRoute from '@/routes/employee';
import type { LeaderboardEmployee } from '@/types/stars';
import { Pizza } from './pizza';

type PizzaCardProps = {
    storeNumber: string;
    employee: LeaderboardEmployee;
    target: number;
    index: number;
};

function PizzaCardInner({ storeNumber, employee, target, index }: PizzaCardProps) {
    const isComplete = employee.total >= target;
    const isPodium = employee.rank <= 3 && employee.total > 0;
    const progress = Math.min(100, Math.round((employee.total / target) * 100));

    return (
        <Link
            href={employeeRoute.show([storeNumber, employee.id])}
            className="group relative flex flex-col items-center rounded-3xl border border-zinc-200/70 bg-white px-6 pt-8 pb-6 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.12)] transition-all duration-500 hover:-translate-y-1 hover:border-[var(--color-brand)] hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.18)] active:translate-y-0"
            style={{
                animationDelay: `${index * 80}ms`,
            }}
            prefetch
        >
            {isPodium && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div
                        className="flex h-9 items-center gap-1.5 rounded-full px-3 text-xs font-bold tracking-wider text-white shadow-lg"
                        style={{
                            background:
                                employee.rank === 1
                                    ? 'linear-gradient(135deg, #F5D061, #D4A017)'
                                    : employee.rank === 2
                                      ? 'linear-gradient(135deg, #C0C0C0, #808080)'
                                      : 'linear-gradient(135deg, #CD7F32, #8B4513)',
                        }}
                    >
                        {isComplete ? <Crown className="size-3.5" /> : <Trophy className="size-3.5" />}
                        <span>#{employee.rank}</span>
                    </div>
                </div>
            )}

            <div className="font-display text-2xl font-bold tracking-tight text-zinc-900 uppercase">
                {employee.name}
            </div>

            <div className="relative mt-4 mb-3">
                <Pizza
                    points={employee.total}
                    target={target}
                    size={200}
                    employeeId={employee.id}
                />
                {isComplete && (
                    <div className="pointer-events-none absolute inset-0 animate-pulse rounded-full"
                        style={{
                            background:
                                'radial-gradient(circle, transparent 60%, rgba(255, 215, 0, 0.15) 70%, transparent 80%)',
                        }}
                    />
                )}
            </div>

            <div className="flex items-baseline gap-2">
                <span className="font-display text-4xl font-bold tracking-tight text-zinc-900">
                    {employee.total}
                </span>
                <span className="font-display text-sm font-medium tracking-widest text-zinc-500 uppercase">
                    / {target} pts
                </span>
            </div>

            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                        width: `${progress}%`,
                        background: isComplete
                            ? 'linear-gradient(90deg, #F5D061, #D4A017)'
                            : 'linear-gradient(90deg, #E8651F, #D85A1E)',
                    }}
                />
            </div>

            <div className="mt-4 flex w-full flex-wrap justify-center gap-1.5">
                {employee.breakdown.map((m) => (
                    <div
                        key={m.milestone_id}
                        className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wider text-white uppercase"
                        style={{ backgroundColor: m.points > 0 ? m.color : '#cbd5e1' }}
                        title={`${m.name}: ${m.points}/${m.max_points}`}
                    >
                        <span>{m.name.slice(0, 1)}</span>
                        <span className="opacity-90">{m.points}</span>
                    </div>
                ))}
            </div>
        </Link>
    );
}

export const PizzaCard = memo(PizzaCardInner);
