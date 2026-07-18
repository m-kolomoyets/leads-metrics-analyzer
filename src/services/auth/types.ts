import type { UserRole, UserStatus } from '@/lib/constants';

export type AuthRole = UserRole;

// The current user as returned by the `me` server function — never carries the password hash.
export type MeData = {
    id: string;
    email: string;
    role: AuthRole;
    status: UserStatus;
    // The user's team (spec: `me` → id, role, team). Null for teamless roles; drives team-scoped
    // visibility (`scopeFor`) for a Team Lead.
    teamId: string | null;
};

export type AuthenticatedState = {
    isAuthenticated: true;
    me: MeData;
};

export type UnauthenticatedState = {
    isAuthenticated: false;
    me: null;
};

export type AuthContext = AuthenticatedState | UnauthenticatedState;
