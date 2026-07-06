import { Head, useForm } from '@inertiajs/react';
import { Pencil, Plus, ShieldCheck, Store as StoreIcon, Trash2, UserCog } from 'lucide-react';
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
import type { AdminUser, StoreSummary } from '@/types/stars';

type UsersPageProps = {
    users: AdminUser[];
    stores: StoreSummary[];
};

export default function UsersPage({ users, stores }: UsersPageProps) {
    const [editing, setEditing] = useState<AdminUser | null>(null);

    return (
        <>
            <Head title="Users" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <header className="flex items-end justify-between gap-4">
                    <div>
                        <h1 className="font-display text-4xl font-bold tracking-tight uppercase">
                            Users
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {users.length} account{users.length === 1 ? '' : 's'} · assign a store to scope a manager.
                        </p>
                    </div>
                    <NewUserDialog stores={stores} />
                </header>

                {users.length === 0 ? (
                    <EmptyState stores={stores} />
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-border bg-card">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/40 text-left">
                                <tr>
                                    <Th>Name</Th>
                                    <Th>Email</Th>
                                    <Th>Role</Th>
                                    <Th>Store</Th>
                                    <th className="px-5 py-3" />
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {users.map((user) => (
                                    <tr key={user.id} className="transition-colors hover:bg-muted/30">
                                        <td className="px-5 py-3 font-medium">{user.name}</td>
                                        <td className="px-5 py-3 text-muted-foreground">
                                            {user.email}
                                        </td>
                                        <td className="px-5 py-3">
                                            <RolePill superAdmin={user.is_super_admin} />
                                        </td>
                                        <td className="px-5 py-3">
                                            <UserStoresCell user={user} />
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => setEditing(user)}
                                                >
                                                    <Pencil className="size-4" />
                                                </Button>
                                                <DeleteButton user={user} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {editing && (
                    <EditUserDialog
                        user={editing}
                        stores={stores}
                        onClose={() => setEditing(null)}
                    />
                )}
            </div>
        </>
    );
}

function Th({ children }: { children: React.ReactNode }) {
    return (
        <th className="px-5 py-3 font-display text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
            {children}
        </th>
    );
}

function UserStoresCell({ user }: { user: AdminUser }) {
    if (user.is_super_admin) {
        return <span className="text-xs text-muted-foreground">All stores</span>;
    }

    if (user.stores.length === 0) {
        return (
            <span className="text-xs text-red-600">
                No store assigned
            </span>
        );
    }

    if (user.stores.length === 1) {
        const store = user.stores[0];

        return (
            <span className="font-mono text-xs">
                {store.number}
                {store.name && (
                    <span className="ml-1.5 text-muted-foreground">
                        {store.name}
                    </span>
                )}
            </span>
        );
    }

    return (
        <div className="flex flex-wrap items-center gap-1.5">
            {user.stores.slice(0, 2).map((store) => (
                <span
                    key={store.id}
                    className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 font-mono text-[10px] font-semibold text-blue-700"
                >
                    {store.number}
                </span>
            ))}
            {user.stores.length > 2 && (
                <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                    +{user.stores.length - 2} more
                </span>
            )}
        </div>
    );
}

function RolePill({ superAdmin }: { superAdmin: boolean }) {
    return superAdmin ? (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-2.5 py-0.5 text-[10px] font-semibold tracking-widest text-violet-700 uppercase">
            <ShieldCheck className="size-3" strokeWidth={1.75} />
            Super admin
        </span>
    ) : (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-semibold tracking-widest text-blue-700 uppercase">
            <StoreIcon className="size-3" strokeWidth={1.75} />
            Store manager
        </span>
    );
}

function EmptyState({ stores }: { stores: StoreSummary[] }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-xl bg-muted">
                <UserCog className="size-7 text-muted-foreground" strokeWidth={1.5} />
            </div>
            <h3 className="mt-4 font-display text-xl font-bold tracking-tight uppercase">
                No users yet
            </h3>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Add a store manager and assign them a store, or create another super admin.
            </p>
            <div className="mt-5">
                <NewUserDialog stores={stores} />
            </div>
        </div>
    );
}

type UserFormData = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: 'super_admin' | 'manager';
    store_ids: number[];
};

function NewUserDialog({ stores }: { stores: StoreSummary[] }) {
    const [open, setOpen] = useState(false);
    const form = useForm<UserFormData>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'manager',
        store_ids: [],
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.transform((data) => ({
            ...data,
            store_ids: data.role === 'super_admin' ? [] : data.store_ids,
        }));
        form.post(admin.users.store().url, {
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
                    <Plus className="mr-1 size-4" /> Add user
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="font-display tracking-tight uppercase">
                        Add user
                    </DialogTitle>
                </DialogHeader>
                <UserFields
                    form={form}
                    stores={stores}
                    onSubmit={submit}
                    submitLabel="Create user"
                    passwordHint="Minimum 8 characters."
                />
            </DialogContent>
        </Dialog>
    );
}

function EditUserDialog({
    user,
    stores,
    onClose,
}: {
    user: AdminUser;
    stores: StoreSummary[];
    onClose: () => void;
}) {
    const form = useForm<UserFormData>({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        role: user.is_super_admin ? 'super_admin' : 'manager',
        store_ids: user.stores.map((store) => store.id),
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.transform((data) => ({
            ...data,
            store_ids: data.role === 'super_admin' ? [] : data.store_ids,
        }));
        form.put(admin.users.update(user.id).url, {
            preserveScroll: true,
            onSuccess: onClose,
        });
    };

    return (
        <Dialog open onOpenChange={(value) => !value && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="font-display tracking-tight uppercase">
                        Edit {user.name}
                    </DialogTitle>
                </DialogHeader>
                <UserFields
                    form={form}
                    stores={stores}
                    onSubmit={submit}
                    submitLabel="Save changes"
                    passwordHint="Leave blank to keep the current password."
                />
            </DialogContent>
        </Dialog>
    );
}

type FormInstance = ReturnType<typeof useForm<UserFormData>>;

function UserFields({
    form,
    stores,
    onSubmit,
    submitLabel,
    passwordHint,
}: {
    form: FormInstance;
    stores: StoreSummary[];
    onSubmit: (event: FormEvent) => void;
    submitLabel: string;
    passwordHint: string;
}) {
    const { data, setData, errors, processing } = form;

    return (
        <form onSubmit={onSubmit} className="grid gap-4">
            <div className="grid gap-2">
                <Label htmlFor="user-name">Name</Label>
                <Input
                    id="user-name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    autoFocus
                />
                {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
            </div>

            <div className="grid gap-2">
                <Label htmlFor="user-email">Email</Label>
                <Input
                    id="user-email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                />
                {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
            </div>

            <div className="grid gap-2">
                <Label htmlFor="user-role">Role</Label>
                <select
                    id="user-role"
                    value={data.role}
                    onChange={(e) => setData('role', e.target.value as UserFormData['role'])}
                    className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                    <option value="manager">Store manager</option>
                    <option value="super_admin">Super admin</option>
                </select>
                <p className="text-xs text-muted-foreground">
                    Super admins see and edit every store. Managers can only edit the stores checked below.
                </p>
            </div>

            {data.role === 'manager' && (
                <div className="grid gap-2">
                    <Label>Assigned stores</Label>
                    <div className="max-h-64 overflow-y-auto rounded-md border border-input bg-background p-1">
                        {stores.length === 0 ? (
                            <p className="px-3 py-2 text-xs text-muted-foreground">
                                No stores exist yet. Create a store first.
                            </p>
                        ) : (
                            stores.map((store) => {
                                const checked = data.store_ids.includes(store.id);

                                return (
                                    <label
                                        key={store.id}
                                        className="flex cursor-pointer items-center gap-3 rounded-sm px-3 py-2 hover:bg-muted/60"
                                    >
                                        <input
                                            type="checkbox"
                                            className="size-4 rounded border-border"
                                            checked={checked}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setData('store_ids', [
                                                        ...data.store_ids,
                                                        store.id,
                                                    ]);
                                                } else {
                                                    setData(
                                                        'store_ids',
                                                        data.store_ids.filter((id) => id !== store.id),
                                                    );
                                                }
                                            }}
                                        />
                                        <span className="flex-1 min-w-0">
                                            <span className="font-mono text-xs">{store.number}</span>
                                            {store.name && (
                                                <span className="ml-2 text-xs text-muted-foreground">
                                                    {store.name}
                                                </span>
                                            )}
                                        </span>
                                    </label>
                                );
                            })
                        )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {data.store_ids.length} store{data.store_ids.length === 1 ? '' : 's'} selected.
                    </p>
                    {errors.store_ids && (
                        <p className="text-xs text-red-600">{errors.store_ids}</p>
                    )}
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="user-password">Password</Label>
                    <Input
                        id="user-password"
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        autoComplete="new-password"
                    />
                    {errors.password && (
                        <p className="text-xs text-red-600">{errors.password}</p>
                    )}
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="user-password-confirm">Confirm</Label>
                    <Input
                        id="user-password-confirm"
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        autoComplete="new-password"
                    />
                </div>
            </div>
            <p className="-mt-2 text-xs text-muted-foreground">{passwordHint}</p>

            <DialogFooter>
                <Button type="submit" disabled={processing}>
                    {processing ? 'Saving…' : submitLabel}
                </Button>
            </DialogFooter>
        </form>
    );
}

function DeleteButton({ user }: { user: AdminUser }) {
    const { delete: destroy, processing } = useForm();

    const onClick = () => {
        if (! confirm(`Remove ${user.name}? They will lose access immediately.`)) {
            return;
        }

        destroy(admin.users.destroy(user.id).url, { preserveScroll: true });
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
