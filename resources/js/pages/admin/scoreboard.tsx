import { Head, useForm } from '@inertiajs/react';
import { Save, Trophy } from 'lucide-react';
import {  useMemo, useState } from 'react';
import type {FormEvent} from 'react';
import { Button } from '@/components/ui/button';
import admin from '@/routes/admin';
import type { Milestone, ScoreboardEmployee } from '@/types/stars';

type ScoreboardPageProps = {
    employees: ScoreboardEmployee[];
    milestones: Pick<Milestone, 'id' | 'name' | 'color' | 'max_points'>[];
    target: number;
};

type Cell = { employee_id: number; milestone_id: number; points: number };

export default function ScoreboardPage({ employees, milestones, target }: ScoreboardPageProps) {
    const initial = useMemo<Record<string, number>>(() => {
        const map: Record<string, number> = {};
        employees.forEach((emp) => {
            milestones.forEach((ms) => {
                map[`${emp.id}:${ms.id}`] = emp.points[ms.id] ?? 0;
            });
        });

        return map;
    }, [employees, milestones]);

    const [values, setValues] = useState<Record<string, number>>(initial);

    const totals = useMemo(() => {
        const out: Record<number, number> = {};
        employees.forEach((emp) => {
            out[emp.id] = milestones.reduce(
                (sum, ms) => sum + (values[`${emp.id}:${ms.id}`] ?? 0),
                0,
            );
        });

        return out;
    }, [values, employees, milestones]);

    const isDirty = useMemo(
        () => Object.entries(values).some(([key, value]) => initial[key] !== value),
        [values, initial],
    );

    const form = useForm<{ scores: Cell[] }>({ scores: [] });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        const payload: Cell[] = [];
        Object.entries(values).forEach(([key, points]) => {
            const [employee_id, milestone_id] = key.split(':').map(Number);

            if (initial[key] !== points) {
                payload.push({ employee_id, milestone_id, points });
            }
        });

        form.transform(() => ({ scores: payload }));
        form.put(admin.scoreboard.update().url, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Scoreboard" />

            <form onSubmit={submit} className="flex h-full flex-1 flex-col gap-6 p-6">
                <header className="flex items-end justify-between gap-4">
                    <div>
                        <h1 className="font-display text-4xl font-bold tracking-tight uppercase">
                            Scoreboard
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Enter points for each employee per milestone. Target: <strong>{target} pts</strong>.
                        </p>
                    </div>
                    <Button
                        type="submit"
                        disabled={!isDirty || form.processing}
                        className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)]"
                    >
                        <Save className="mr-1.5 size-4" />
                        {form.processing ? 'Saving…' : isDirty ? 'Save changes' : 'No changes'}
                    </Button>
                </header>

                <div className="overflow-x-auto rounded-2xl border border-border bg-card">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="bg-muted/40">
                                <th className="sticky left-0 z-10 bg-muted/40 px-5 py-3 text-left font-display text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
                                    Employee
                                </th>
                                {milestones.map((ms) => (
                                    <th
                                        key={ms.id}
                                        className="px-3 py-3 text-center font-display text-[11px] font-semibold tracking-widest uppercase"
                                        style={{ color: ms.color }}
                                    >
                                        <div>{ms.name}</div>
                                        <div className="mt-0.5 text-[9px] font-normal text-muted-foreground normal-case">
                                            max {ms.max_points}
                                        </div>
                                    </th>
                                ))}
                                <th className="px-4 py-3 text-right font-display text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
                                    Total
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {employees.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={milestones.length + 2}
                                        className="px-5 py-10 text-center text-muted-foreground"
                                    >
                                        Add employees and milestones first.
                                    </td>
                                </tr>
                            ) : (
                                employees.map((employee) => {
                                    const total = totals[employee.id] ?? 0;
                                    const hit = total >= target;

                                    return (
                                        <tr
                                            key={employee.id}
                                            className={hit ? 'bg-amber-50/60' : undefined}
                                        >
                                            <td className="sticky left-0 z-10 bg-inherit px-5 py-2.5">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className="size-3 rounded-full"
                                                        style={{
                                                            backgroundColor: employee.avatar_color ?? '#cbd5e1',
                                                        }}
                                                    />
                                                    <span className="font-medium">{employee.name}</span>
                                                </div>
                                            </td>
                                            {milestones.map((ms) => {
                                                const key = `${employee.id}:${ms.id}`;

                                                return (
                                                    <td key={ms.id} className="px-2 py-1.5 text-center">
                                                        <input
                                                            type="number"
                                                            min={0}
                                                            max={ms.max_points}
                                                            value={values[key] ?? 0}
                                                            onChange={(e) => {
                                                                const raw = parseInt(e.target.value, 10);
                                                                const safe = Number.isNaN(raw)
                                                                    ? 0
                                                                    : Math.max(0, Math.min(raw, ms.max_points));
                                                                setValues((prev) => ({ ...prev, [key]: safe }));
                                                            }}
                                                            className="w-16 rounded-md border border-input bg-background px-2 py-1.5 text-center font-mono text-sm tabular-nums focus:border-[var(--color-brand)] focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)]"
                                                        />
                                                    </td>
                                                );
                                            })}
                                            <td className="px-4 py-2.5 text-right">
                                                <div className="inline-flex items-center gap-1.5">
                                                    {hit && (
                                                        <Trophy className="size-3.5 text-amber-500" />
                                                    )}
                                                    <span
                                                        className={`font-display text-lg font-bold tabular-nums ${
                                                            hit ? 'text-amber-600' : 'text-foreground'
                                                        }`}
                                                    >
                                                        {total}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        / {target}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </form>
        </>
    );
}
