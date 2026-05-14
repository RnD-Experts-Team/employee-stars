import { router } from '@inertiajs/react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import admin from '@/routes/admin';
import type { StoreSummary } from '@/types/stars';

type Props = {
    stores: StoreSummary[];
    currentStore: StoreSummary | null;
};

export function StoreSwitcher({ stores, currentStore }: Props) {
    const [open, setOpen] = useState(false);

    const switchTo = (store: StoreSummary) => {
        if (store.id === currentStore?.id) {
            setOpen(false);

            return;
        }

        router.post(admin.stores.switch(store.number).url, {}, {
            preserveScroll: false,
            onFinish: () => setOpen(false),
        });
    };

    return (
        <div className="px-2 pt-2">
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                    <button
                        type="button"
                        className="group flex w-full items-center justify-between rounded-lg border border-sidebar-border/60 bg-sidebar-accent/30 px-3 py-2 text-left transition-colors hover:bg-sidebar-accent/60"
                    >
                        <div className="min-w-0">
                            <div className="font-display text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                                Current store
                            </div>
                            <div className="mt-0.5 truncate font-display text-sm font-bold tracking-tight">
                                {currentStore?.number ?? 'Pick a store'}
                            </div>
                            {currentStore?.name && (
                                <div className="truncate text-xs text-muted-foreground">
                                    {currentStore.name}
                                </div>
                            )}
                        </div>
                        <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="start"
                    className="w-[var(--radix-dropdown-menu-trigger-width)] min-w-[220px]"
                >
                    <DropdownMenuLabel className="text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                        Switch context
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {stores.map((store) => (
                        <DropdownMenuItem
                            key={store.id}
                            onSelect={(event) => {
                                event.preventDefault();
                                switchTo(store);
                            }}
                            className="cursor-pointer"
                        >
                            <div className="flex flex-1 items-center justify-between">
                                <div className="min-w-0">
                                    <div className="font-medium">{store.number}</div>
                                    {store.name && (
                                        <div className="text-xs text-muted-foreground">
                                            {store.name}
                                        </div>
                                    )}
                                </div>
                                {currentStore?.id === store.id && (
                                    <Check className="ml-2 size-4 text-emerald-600" />
                                )}
                            </div>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
