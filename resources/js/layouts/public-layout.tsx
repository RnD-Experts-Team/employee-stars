import type { ReactNode } from 'react';

/**
 * Bare-bones wrapper for the customer-facing surface (landing chooser,
 * per-store leaderboard, and employee detail). Holds the page background and
 * viewport sizing only — each page renders its own header + footer chrome.
 */
export default function PublicLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-[100dvh] bg-zinc-50 text-zinc-900 antialiased">
            {children}
        </div>
    );
}
