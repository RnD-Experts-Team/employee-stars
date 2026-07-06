export type Milestone = {
    id: number;
    store_id?: number;
    name: string;
    slug: string;
    color: string;
    icon: string;
    max_points: number;
    sort_order?: number;
    is_active?: boolean;
};

export type MilestoneBreakdown = {
    milestone_id: number;
    name: string;
    color: string;
    icon: string;
    points: number;
    max_points: number;
};

export type LeaderboardEmployee = {
    id: number;
    name: string;
    avatar_color: string | null;
    total: number;
    rank: number;
    breakdown: MilestoneBreakdown[];
};

export type AdminEmployee = {
    id: number;
    store_id?: number;
    name: string;
    avatar_color: string | null;
    is_active: boolean;
    sort_order: number;
    total_points?: number;
};

export type ScoreboardEmployee = {
    id: number;
    name: string;
    avatar_color: string | null;
    points: Record<number, number>;
    total: number;
};

export type BoardSettings = {
    target_points: number;
    brand_name: string;
    board_title: string;
    board_tagline: string;
};

export type StoreSummary = {
    id: number;
    number: string;
    name: string | null;
    target_points?: number;
    is_active?: boolean;
};

export type AdminStore = StoreSummary & {
    target_points: number;
    board_title: string;
    board_tagline: string | null;
    is_active: boolean;
    employees_count?: number;
    milestones_count?: number;
    users_count?: number;
};

export type OverviewStore = StoreSummary & {
    target_points: number;
    is_active: boolean;
    employees: number;
    champions: number;
    total_points: number;
    team_progress: number;
    leader: { name: string; points: number } | null;
    can_manage: boolean;
};

export type AdminUser = {
    id: number;
    name: string;
    email: string;
    is_super_admin: boolean;
    stores: { id: number; number: string; name: string | null }[];
};

export type AdminSharedProps = {
    auth: {
        user: { id: number; name: string; email: string } | null;
        isSuperAdmin: boolean;
        currentStore: StoreSummary | null;
        availableStores: StoreSummary[] | null;
    };
    flash?: {
        success?: string | null;
        warning?: string | null;
        error?: string | null;
    };
    [key: string]: unknown;
};
