import type { UserRole } from '@/lib/constants';

// Per-surface dollar visibility (offers-and-home PRD). A pure seam beside `scopeFor`: BDM holds only
// the `offer` dimension there, which keeps the feed, the report and Dynamics closed — and that must
// stay so. Offers and Home are the two surfaces where BDM reads dollar figures anyway, so the grant
// lives here, per surface, rather than by widening the dimension set and reopening the rest.
export type DollarSurface = 'offers' | 'home';

const DOLLAR_ROLES: Record<DollarSurface, readonly UserRole[]> = {
    offers: ['head', 'team_lead', 'buyer', 'bdm'],
    home: ['head', 'team_lead', 'buyer', 'bdm'],
};

export const seesDollarsOn = (surface: DollarSurface, role?: UserRole): boolean => {
    return role !== undefined && DOLLAR_ROLES[surface].includes(role);
};
