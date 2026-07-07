import { Head, useForm } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import {  useState } from 'react';
import type {FormEvent} from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogBody,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import admin from '@/routes/admin';
import type { AdminEmployee } from '@/types/stars';

const COLOR_OPTIONS = [
    '#E8651F', '#2E9F45', '#1E6FD9', '#7B3FB8', '#E13F2E',
    '#D85A1E', '#0E9F6E', '#8E44AD', '#1a60bf', '#c8521a',
];

type EmployeesPageProps = {
    employees: AdminEmployee[];
};

export default function EmployeesPage({ employees }: EmployeesPageProps) {
    const [editing, setEditing] = useState<AdminEmployee | null>(null);

    return (
        <>
            <Head title="Employees" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <header className="flex items-end justify-between gap-4">
                    <div>
                        <h1 className="font-display text-4xl font-bold tracking-tight uppercase">
                            Employees
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {employees.length} on the board · click a row to edit
                        </p>
                    </div>
                    <NewEmployeeDialog />
                </header>

                <div className="overflow-hidden rounded-2xl border border-border bg-card">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/40 text-left">
                            <tr>
                                <th className="px-5 py-3 font-display text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
                                    Name
                                </th>
                                <th className="px-5 py-3 font-display text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
                                    Color
                                </th>
                                <th className="px-5 py-3 text-right font-display text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
                                    Points
                                </th>
                                <th className="px-5 py-3 font-display text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
                                    Status
                                </th>
                                <th className="px-5 py-3" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {employees.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">
                                        No employees yet. Add the first one to get started.
                                    </td>
                                </tr>
                            ) : (
                                employees.map((employee) => (
                                    <tr key={employee.id} className="transition-colors hover:bg-muted/30">
                                        <td className="px-5 py-3 font-medium">{employee.name}</td>
                                        <td className="px-5 py-3">
                                            <span
                                                className="inline-block size-5 rounded-full"
                                                style={{ backgroundColor: employee.avatar_color ?? '#cbd5e1' }}
                                            />
                                        </td>
                                        <td className="px-5 py-3 text-right font-display font-bold">
                                            {employee.total_points ?? 0}
                                        </td>
                                        <td className="px-5 py-3">
                                            <span
                                                className={
                                                    employee.is_active
                                                        ? 'inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-semibold tracking-widest text-emerald-700 uppercase'
                                                        : 'inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-0.5 text-[10px] font-semibold tracking-widest text-zinc-500 uppercase'
                                                }
                                            >
                                                <span className="size-1.5 rounded-full bg-current" />
                                                {employee.is_active ? 'Active' : 'Hidden'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => setEditing(employee)}
                                                >
                                                    <Pencil className="size-4" />
                                                </Button>
                                                <DeleteButton employee={employee} />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {editing && (
                    <EditEmployeeDialog
                        employee={editing}
                        onClose={() => setEditing(null)}
                    />
                )}
            </div>
        </>
    );
}

function NewEmployeeDialog() {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        avatar_color: COLOR_OPTIONS[0],
        is_active: true,
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        post(admin.employees.store().url, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)]">
                    <Plus className="mr-1 size-4" /> Add employee
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="font-display tracking-tight uppercase">Add employee</DialogTitle>
                </DialogHeader>
                <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
                    <DialogBody>
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                autoFocus
                            />
                            {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label>Avatar color</Label>
                            <div className="flex flex-wrap gap-2">
                                {COLOR_OPTIONS.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => setData('avatar_color', color)}
                                        className={`size-9 rounded-full transition-all ${
                                            data.avatar_color === color
                                                ? 'ring-2 ring-offset-2 ring-zinc-900'
                                                : ''
                                        }`}
                                        style={{ backgroundColor: color }}
                                        aria-label={color}
                                    />
                                ))}
                            </div>
                        </div>
                    </DialogBody>

                    <DialogFooter>
                        <Button type="submit" disabled={processing} className="w-full sm:w-auto">
                            {processing ? 'Saving…' : 'Add employee'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function EditEmployeeDialog({
    employee,
    onClose,
}: {
    employee: AdminEmployee;
    onClose: () => void;
}) {
    const { data, setData, put, processing, errors } = useForm({
        name: employee.name,
        avatar_color: employee.avatar_color ?? COLOR_OPTIONS[0],
        is_active: employee.is_active,
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        put(admin.employees.update(employee.id).url, {
            preserveScroll: true,
            onSuccess: () => onClose(),
        });
    };

    return (
        <Dialog open onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="font-display tracking-tight uppercase">
                        Edit {employee.name}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
                    <DialogBody>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">Name</Label>
                            <Input
                                id="edit-name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label>Avatar color</Label>
                            <div className="flex flex-wrap gap-2">
                                {COLOR_OPTIONS.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => setData('avatar_color', color)}
                                        className={`size-9 rounded-full transition-all ${
                                            data.avatar_color === color
                                                ? 'ring-2 ring-offset-2 ring-zinc-900'
                                                : ''
                                        }`}
                                        style={{ backgroundColor: color }}
                                        aria-label={color}
                                    />
                                ))}
                            </div>
                        </div>

                        <label className="flex cursor-pointer items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="size-4 shrink-0 rounded border-border"
                            />
                            Show on the public leaderboard
                        </label>
                    </DialogBody>

                    <DialogFooter>
                        <Button type="submit" disabled={processing} className="w-full sm:w-auto">
                            {processing ? 'Saving…' : 'Save changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function DeleteButton({ employee }: { employee: AdminEmployee }) {
    const { delete: destroy, processing } = useForm();

    const onClick = () => {
        if (!confirm(`Remove ${employee.name}? This deletes all their scores.`)) {
return;
}

        destroy(admin.employees.destroy(employee.id).url, { preserveScroll: true });
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
