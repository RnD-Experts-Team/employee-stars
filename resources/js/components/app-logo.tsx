import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-[var(--color-brand)] text-white">
                <AppLogoIcon className="size-5 fill-current" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-display font-bold tracking-[0.12em] uppercase">
                    PNE Stars
                </span>
                <span className="truncate text-[10px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
                    Performance Board
                </span>
            </div>
        </>
    );
}
