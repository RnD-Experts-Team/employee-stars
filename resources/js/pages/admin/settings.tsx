import { Head, useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import admin from '@/routes/admin';
import type { BoardSettings } from '@/types/stars';

type SettingsPageProps = {
    settings: BoardSettings;
    isSuperAdmin: boolean;
};

export default function SettingsPage({ settings, isSuperAdmin }: SettingsPageProps) {
    const form = useForm({
        target_points: settings.target_points,
        board_title: settings.board_title,
        board_tagline: settings.board_tagline ?? '',
        brand_name: settings.brand_name,
    });

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.put(admin.settings.update().url, { preserveScroll: true });
    };

    return (
        <>
            <Head title="Settings" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <header>
                    <h1 className="font-display text-4xl font-bold tracking-tight uppercase">
                        Store settings
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Tune the target threshold and the headline shown on this store&apos;s public board.
                    </p>
                </header>

                <form
                    onSubmit={submit}
                    className="grid max-w-2xl gap-6 rounded-2xl border border-border bg-card p-6"
                >
                    <div className="grid gap-2">
                        <Label htmlFor="target_points">Target points (golden pizza threshold)</Label>
                        <Input
                            id="target_points"
                            type="number"
                            min={1}
                            max={1000}
                            value={form.data.target_points}
                            onChange={(e) =>
                                form.setData('target_points', parseInt(e.target.value, 10) || 1)
                            }
                        />
                        <p className="text-xs text-muted-foreground">
                            When an employee&apos;s total meets or exceeds this number, their pizza
                            turns gold and gets a crown badge.
                        </p>
                        {form.errors.target_points && (
                            <p className="text-xs text-red-600">{form.errors.target_points}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="board_title">Board title</Label>
                        <Input
                            id="board_title"
                            value={form.data.board_title}
                            onChange={(e) => form.setData('board_title', e.target.value)}
                        />
                        {form.errors.board_title && (
                            <p className="text-xs text-red-600">{form.errors.board_title}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="board_tagline">Tagline</Label>
                        <Input
                            id="board_tagline"
                            value={form.data.board_tagline}
                            placeholder="FOCUS. EXECUTE. DELIVER. REPEAT."
                            onChange={(e) => form.setData('board_tagline', e.target.value)}
                        />
                        {form.errors.board_tagline && (
                            <p className="text-xs text-red-600">{form.errors.board_tagline}</p>
                        )}
                    </div>

                    {isSuperAdmin && (
                        <div className="grid gap-2 rounded-xl bg-muted/40 p-4">
                            <Label htmlFor="brand_name">
                                Brand name <span className="text-xs font-normal text-muted-foreground">(global, super admin only)</span>
                            </Label>
                            <Input
                                id="brand_name"
                                value={form.data.brand_name}
                                onChange={(e) => form.setData('brand_name', e.target.value)}
                            />
                            <p className="text-xs text-muted-foreground">
                                Shown in the header of every store&apos;s public board.
                            </p>
                            {form.errors.brand_name && (
                                <p className="text-xs text-red-600">{form.errors.brand_name}</p>
                            )}
                        </div>
                    )}

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={form.processing}
                            className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)]"
                        >
                            <Save className="mr-1.5 size-4" />
                            {form.processing ? 'Saving…' : 'Save settings'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
