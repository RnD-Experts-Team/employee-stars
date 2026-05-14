import { Head, useForm } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import {  useState } from 'react';
import type {FormEvent} from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import admin from '@/routes/admin';
import type { Milestone } from '@/types/stars';

const COLOR_OPTIONS = [
    '#2E9F45', '#1E6FD9', '#7B3FB8', '#E8651F', '#E13F2E',
    '#D85A1E', '#0E9F6E', '#8E44AD', '#1a60bf', '#c8521a',
];

const ICON_OPTIONS = ['star', 'clock', 'sparkles', 'target', 'crown', 'flame', 'trophy', 'users', 'rocket', 'bolt'];

type MilestonesPageProps = {
    milestones: Milestone[];
};

export default function MilestonesPage({ milestones }: MilestonesPageProps) {
    const [editing, setEditing] = useState<Milestone | null>(null);

    return (
        <>
            <Head title="Milestones" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <header className="flex items-end justify-between gap-4">
                    <div>
                        <h1 className="font-display text-4xl font-bold tracking-tight uppercase">
                            Milestones
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Categories that make up an employee&apos;s daily total. Add as many as you need.
                        </p>
                    </div>
                    <NewMilestoneDialog />
                </header>

                <div className="overflow-hidden rounded-2xl border border-border bg-card">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/40 text-left">
                            <tr>
                                <th className="px-5 py-3 font-display text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
                                    Milestone
                                </th>
                                <th className="px-5 py-3 font-display text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
                                    Slug
                                </th>
                                <th className="px-5 py-3 text-right font-display text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
                                    Max points
                                </th>
                                <th className="px-5 py-3 font-display text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
                                    Status
                                </th>
                                <th className="px-5 py-3" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {milestones.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">
                                        No milestones yet.
                                    </td>
                                </tr>
                            ) : (
                                milestones.map((milestone) => (
                                    <tr key={milestone.id} className="transition-colors hover:bg-muted/30">
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className="size-6 rounded-lg"
                                                    style={{ backgroundColor: milestone.color }}
                                                />
                                                <span className="font-medium">{milestone.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                                            {milestone.slug}
                                        </td>
                                        <td className="px-5 py-3 text-right font-display font-bold">
                                            {milestone.max_points}
                                        </td>
                                        <td className="px-5 py-3">
                                            <span
                                                className={
                                                    milestone.is_active
                                                        ? 'inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-semibold tracking-widest text-emerald-700 uppercase'
                                                        : 'inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-semibold tracking-widest text-zinc-500 uppercase'
                                                }
                                            >
                                                <span className="size-1.5 rounded-full bg-current" />
                                                {milestone.is_active ? 'Active' : 'Hidden'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => setEditing(milestone)}
                                                >
                                                    <Pencil className="size-4" />
                                                </Button>
                                                <DeleteButton milestone={milestone} />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {editing && (
                    <EditMilestoneDialog
                        milestone={editing}
                        onClose={() => setEditing(null)}
                    />
                )}
            </div>
        </>
    );
}

function NewMilestoneDialog() {
    const [open, setOpen] = useState(false);
    const form = useForm({
        name: '',
        color: COLOR_OPTIONS[0],
        icon: ICON_OPTIONS[0],
        max_points: 6,
        is_active: true,
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.post(admin.milestones.store().url, {
            preserveScroll: true,
            onSuccess: () => {
                form.reset();
                setOpen(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)]">
                    <Plus className="mr-1 size-4" /> Add milestone
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="font-display tracking-tight uppercase">
                        Add milestone
                    </DialogTitle>
                </DialogHeader>
                <MilestoneFields form={form} onSubmit={submit} submitLabel="Add milestone" />
            </DialogContent>
        </Dialog>
    );
}

function EditMilestoneDialog({
    milestone,
    onClose,
}: {
    milestone: Milestone;
    onClose: () => void;
}) {
    const form = useForm({
        name: milestone.name,
        color: milestone.color,
        icon: milestone.icon,
        max_points: milestone.max_points,
        is_active: milestone.is_active ?? true,
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.put(admin.milestones.update(milestone.id).url, {
            preserveScroll: true,
            onSuccess: onClose,
        });
    };

    return (
        <Dialog open onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="font-display tracking-tight uppercase">
                        Edit {milestone.name}
                    </DialogTitle>
                </DialogHeader>
                <MilestoneFields form={form} onSubmit={submit} submitLabel="Save changes" />
            </DialogContent>
        </Dialog>
    );
}

type FormInstance = ReturnType<typeof useForm<{
    name: string;
    color: string;
    icon: string;
    max_points: number;
    is_active: boolean;
}>>;

function MilestoneFields({
    form,
    onSubmit,
    submitLabel,
}: {
    form: FormInstance;
    onSubmit: (event: FormEvent) => void;
    submitLabel: string;
}) {
    const { data, setData, errors, processing } = form;

    return (
        <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="ms-name">Name</Label>
                    <Input
                        id="ms-name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        autoFocus
                    />
                    {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="ms-max">Max points</Label>
                    <Input
                        id="ms-max"
                        type="number"
                        min={1}
                        max={100}
                        value={data.max_points}
                        onChange={(e) => setData('max_points', parseInt(e.target.value, 10) || 1)}
                    />
                    {errors.max_points && <p className="text-xs text-red-600">{errors.max_points}</p>}
                </div>
            </div>

            <div className="grid gap-2">
                <Label>Color</Label>
                <div className="flex flex-wrap gap-2">
                    {COLOR_OPTIONS.map((c) => (
                        <button
                            key={c}
                            type="button"
                            onClick={() => setData('color', c)}
                            className={`size-8 rounded-lg transition-all ${
                                data.color === c ? 'ring-2 ring-offset-2 ring-zinc-900' : ''
                            }`}
                            style={{ backgroundColor: c }}
                            aria-label={c}
                        />
                    ))}
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="ms-icon">Icon</Label>
                <select
                    id="ms-icon"
                    value={data.icon}
                    onChange={(e) => setData('icon', e.target.value)}
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm capitalize"
                >
                    {ICON_OPTIONS.map((i) => (
                        <option key={i} value={i}>{i}</option>
                    ))}
                </select>
            </div>

            <label className="flex items-center gap-2 text-sm">
                <input
                    type="checkbox"
                    checked={data.is_active}
                    onChange={(e) => setData('is_active', e.target.checked)}
                    className="size-4 rounded border-border"
                />
                Show on the board
            </label>

            <DialogFooter>
                <Button type="submit" disabled={processing}>
                    {processing ? 'Saving…' : submitLabel}
                </Button>
            </DialogFooter>
        </form>
    );
}

function DeleteButton({ milestone }: { milestone: Milestone }) {
    const { delete: destroy, processing } = useForm();

    const onClick = () => {
        if (!confirm(`Delete "${milestone.name}"? This removes the column from all employee scores.`)) {
return;
}

        destroy(admin.milestones.destroy(milestone.id).url, { preserveScroll: true });
    };

    return (
        <Button
            size="sm"
            variant="ghost"
            onClick={onClick}
            disabled={processing}
            className="text-red-600 hover:bg-red-50 hover:text-red-700"
        >
            <Trash2 className="size-4" />
        </Button>
    );
}
