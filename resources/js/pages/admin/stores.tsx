import { Head, useForm } from '@inertiajs/react';
import { Building2, Pencil, Plus, Trash2 } from 'lucide-react';
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
import type { AdminStore } from '@/types/stars';

type StoresPageProps = {
    stores: AdminStore[];
};

export default function StoresPage({ stores }: StoresPageProps) {
    const [editing, setEditing] = useState<AdminStore | null>(null);

    return (
        <>
            <Head title="Stores" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <header className="flex items-end justify-between gap-4">
                    <div>
                        <h1 className="font-display text-4xl font-bold tracking-tight uppercase">
                            Stores
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {stores.length} location{stores.length === 1 ? '' : 's'} on the network.
                        </p>
                    </div>
                    <NewStoreDialog />
                </header>

                {stores.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-border bg-card">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/40 text-left">
                                <tr>
                                    <Th>Store number</Th>
                                    <Th>Name</Th>
                                    <Th align="right">Target</Th>
                                    <Th align="right">Employees</Th>
                                    <Th align="right">Milestones</Th>
                                    <Th>Status</Th>
                                    <th className="px-5 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {stores.map((store) => (
                                    <tr key={store.id} className="transition-colors hover:bg-muted/30">
                                        <td className="px-5 py-3 font-mono font-medium">
                                            {store.number}
                                        </td>
                                        <td className="px-5 py-3 text-muted-foreground">
                                            {store.name ?? '—'}
                                        </td>
                                        <td className="px-5 py-3 text-right font-display font-bold tabular-nums">
                                            {store.target_points}
                                        </td>
                                        <td className="px-5 py-3 text-right tabular-nums">
                                            {store.employees_count ?? 0}
                                        </td>
                                        <td className="px-5 py-3 text-right tabular-nums">
                                            {store.milestones_count ?? 0}
                                        </td>
                                        <td className="px-5 py-3">
                                            <StatusPill active={store.is_active} />
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => setEditing(store)}
                                                >
                                                    <Pencil className="size-4" />
                                                </Button>
                                                <DeleteButton store={store} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {editing && (
                    <EditStoreDialog
                        store={editing}
                        onClose={() => setEditing(null)}
                    />
                )}
            </div>
        </>
    );
}

function Th({
    children,
    align = 'left',
}: {
    children: React.ReactNode;
    align?: 'left' | 'right';
}) {
    return (
        <th
            className={`px-5 py-3 font-display text-[11px] font-semibold tracking-widest text-muted-foreground uppercase ${
                align === 'right' ? 'text-right' : ''
            }`}
        >
            {children}
        </th>
    );
}

function StatusPill({ active }: { active: boolean }) {
    return (
        <span
            className={
                active
                    ? 'inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-semibold tracking-widest text-emerald-700 uppercase'
                    : 'inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-semibold tracking-widest text-zinc-500 uppercase'
            }
        >
            <span className="size-1.5 rounded-full bg-current" />
            {active ? 'Active' : 'Hidden'}
        </span>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-xl bg-muted">
                <Building2 className="size-7 text-muted-foreground" strokeWidth={1.5} />
            </div>
            <h3 className="mt-4 font-display text-xl font-bold tracking-tight uppercase">
                No stores yet
            </h3>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Add your first store to start tracking employee performance.
            </p>
        </div>
    );
}

function NewStoreDialog() {
    const [open, setOpen] = useState(false);
    const form = useForm({
        number: '',
        name: '',
        target_points: 40,
        board_title: 'Daily Stars Performance',
        board_tagline: 'FOCUS. EXECUTE. DELIVER. REPEAT.',
        is_active: true,
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.post(admin.stores.store().url, {
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
                    <Plus className="mr-1 size-4" /> Add store
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="font-display tracking-tight uppercase">
                        Add store
                    </DialogTitle>
                </DialogHeader>
                <StoreFields form={form} onSubmit={submit} submitLabel="Add store" />
            </DialogContent>
        </Dialog>
    );
}

function EditStoreDialog({ store, onClose }: { store: AdminStore; onClose: () => void }) {
    const form = useForm({
        number: store.number,
        name: store.name ?? '',
        target_points: store.target_points,
        board_title: store.board_title,
        board_tagline: store.board_tagline ?? '',
        is_active: store.is_active,
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.put(admin.stores.update(store.number).url, {
            preserveScroll: true,
            onSuccess: onClose,
        });
    };

    return (
        <Dialog open onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="font-display tracking-tight uppercase">
                        Edit {store.number}
                    </DialogTitle>
                </DialogHeader>
                <StoreFields form={form} onSubmit={submit} submitLabel="Save changes" />
            </DialogContent>
        </Dialog>
    );
}

type FormInstance = ReturnType<typeof useForm<{
    number: string;
    name: string;
    target_points: number;
    board_title: string;
    board_tagline: string;
    is_active: boolean;
}>>;

function StoreFields({
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
                    <Label htmlFor="store-number">Store number</Label>
                    <Input
                        id="store-number"
                        value={data.number}
                        onChange={(e) => setData('number', e.target.value)}
                        placeholder="03795-00012"
                        autoFocus
                    />
                    {errors.number && <p className="text-xs text-red-600">{errors.number}</p>}
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="store-target">Target points</Label>
                    <Input
                        id="store-target"
                        type="number"
                        min={1}
                        max={1000}
                        value={data.target_points}
                        onChange={(e) =>
                            setData('target_points', parseInt(e.target.value, 10) || 1)
                        }
                    />
                    {errors.target_points && (
                        <p className="text-xs text-red-600">{errors.target_points}</p>
                    )}
                </div>
            </div>

            <div className="grid gap-2">
                <Label htmlFor="store-name">Display name (optional)</Label>
                <Input
                    id="store-name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Brookhaven"
                />
                {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
            </div>

            <div className="grid gap-2">
                <Label htmlFor="store-board-title">Board title</Label>
                <Input
                    id="store-board-title"
                    value={data.board_title}
                    onChange={(e) => setData('board_title', e.target.value)}
                />
                {errors.board_title && (
                    <p className="text-xs text-red-600">{errors.board_title}</p>
                )}
            </div>

            <div className="grid gap-2">
                <Label htmlFor="store-board-tagline">Tagline</Label>
                <Input
                    id="store-board-tagline"
                    value={data.board_tagline}
                    onChange={(e) => setData('board_tagline', e.target.value)}
                    placeholder="FOCUS. EXECUTE. DELIVER. REPEAT."
                />
            </div>

            <label className="flex items-center gap-2 text-sm">
                <input
                    type="checkbox"
                    checked={data.is_active}
                    onChange={(e) => setData('is_active', e.target.checked)}
                    className="size-4 rounded border-border"
                />
                Active and visible on the public network
            </label>

            <DialogFooter>
                <Button type="submit" disabled={processing}>
                    {processing ? 'Saving…' : submitLabel}
                </Button>
            </DialogFooter>
        </form>
    );
}

function DeleteButton({ store }: { store: AdminStore }) {
    const { delete: destroy, processing } = useForm();

    const onClick = () => {
        if (! confirm(`Delete store ${store.number}? This removes all of its employees, milestones, and scores.`)) {
            return;
        }

        destroy(admin.stores.destroy(store.number).url, { preserveScroll: true });
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
