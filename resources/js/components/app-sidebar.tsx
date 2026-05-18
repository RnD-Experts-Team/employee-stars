import { Link, usePage } from '@inertiajs/react';
import {
    Building2,
    Crown,
    LayoutDashboard,
    LayoutGrid,
    Pizza,
    Settings as SettingsIcon,
    Sparkles,
    UserCog,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { StoreSwitcher } from '@/components/store-switcher';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard, leaderboard } from '@/routes';
import admin from '@/routes/admin';
import type { NavItem } from '@/types';
import type { AdminSharedProps } from '@/types/stars';

const storeManagerNav: NavItem[] = [
    { title: 'Overview', href: dashboard(), icon: LayoutGrid },
    { title: 'Employees', href: admin.employees.index(), icon: Users },
    { title: 'Milestones', href: admin.milestones.index(), icon: Sparkles },
    { title: 'Scoreboard', href: admin.scoreboard.index(), icon: Crown },
    { title: 'Settings', href: admin.settings.edit(), icon: SettingsIcon },
];

const superAdminNav: NavItem[] = [
    { title: 'All stores overview', href: admin.overview(), icon: LayoutDashboard },
    { title: 'Manage stores', href: admin.stores.index(), icon: Building2 },
    { title: 'Manage users', href: admin.users.index(), icon: UserCog },
];

export function AppSidebar() {
    const { auth } = usePage<AdminSharedProps>().props;
    const isSuperAdmin = auth?.isSuperAdmin ?? false;
    const currentStore = auth?.currentStore ?? null;
    const availableStores = auth?.availableStores ?? null;

    const footerNavItems: NavItem[] = currentStore
        ? [
              {
                  title: 'Public leaderboard',
                  href: leaderboard(currentStore.number),
                  icon: Pizza,
              },
          ]
        : [];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                {isSuperAdmin && availableStores && availableStores.length > 0 && (
                    <StoreSwitcher
                        stores={availableStores}
                        currentStore={currentStore}
                    />
                )}
                {!isSuperAdmin && currentStore && (
                    <div className="mx-2 mt-2 rounded-lg border border-sidebar-border/60 bg-sidebar-accent/30 px-3 py-2">
                        <div className="font-display text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                            Store
                        </div>
                        <div className="mt-0.5 truncate font-display text-sm font-bold tracking-tight">
                            {currentStore.number}
                        </div>
                        {currentStore.name && (
                            <div className="truncate text-xs text-muted-foreground">
                                {currentStore.name}
                            </div>
                        )}
                    </div>
                )}
            </SidebarHeader>

            <SidebarContent>
                {currentStore && <NavMain items={storeManagerNav} />}
                {isSuperAdmin && <NavMain items={superAdminNav} />}
            </SidebarContent>

            <SidebarFooter>
                {footerNavItems.length > 0 && (
                    <NavFooter items={footerNavItems} className="mt-auto" />
                )}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
