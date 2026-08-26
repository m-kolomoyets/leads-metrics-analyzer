import type { Viewer } from './scope';
import { scopeFor } from './scope';

// SERVER-usable pure seam (ADR-0018, on top of ADR-0007). Decides whether one Snapshot may be
// superseded by a correction. Kept free of the DB so the rule is the tested thing and the handler is
// only plumbing: it loads the row, asks one question here, and writes.
//
// A Snapshot is immutable (ADR-0015) — replacement never edits it, it flips three lifecycle columns
// and leaves a second row standing beside it. The window is what keeps that honest: an hour is long
// enough to notice a broken export and short enough that anything older is a fact of record.

// How long after `taken_at` a buyer may still correct their own push. Exported because the handler's
// refusal message and the UI's countdown must both read the same number.
export const REPLACEMENT_WINDOW_MINUTES = 60;

// The dollar dimension a Snapshot rolls up into — the same gate `snapshotAccessFor` uses. A
// Designer/BDM sees no whole Snapshot, so it can replace none either.
const SNAPSHOT_DIMENSION = 'campaign';

// The minimal Snapshot identity the verdict needs. `hasNewerActive` is the one fact the caller has to
// go to the DB for: whether the same buyer already has a LATER active Snapshot for the same
// `report_date`. Passed in rather than looked up here so this stays pure.
export type ReplacementSubject = {
    createdByUserId: string;
    teamId: string | null;
    status: 'active' | 'replaced';
    takenAt: Date;
    reportDate: string;
    hasNewerActive: boolean;
};

// 'ok' permits the write; every other value is a refusal, never a silent no-op (ADR-0018). They are
// distinct because they mean different things to a buyer staring at a failed correction: a stale
// window is "too late", a supersession is "you already pushed again".
export type ReplacementVerdict = 'ok' | 'forbidden' | 'already-replaced' | 'window-elapsed' | 'superseded';

const withinWindow = (takenAt: Date, now: Date): boolean => {
    return now.getTime() - takenAt.getTime() <= REPLACEMENT_WINDOW_MINUTES * 60_000;
};

export const replacementVerdictFor = (viewer: Viewer, subject: ReplacementSubject, now: Date): ReplacementVerdict => {
    const scope = scopeFor(viewer);
    const isHead = scope.rowScope === 'all' && scope.dimensions.includes(SNAPSHOT_DIMENSION);

    // Ownership is answered first, before anything that would confirm the row's timing or state: a
    // caller with no business here learns only that it may not act.
    if (!isHead && viewer.id !== subject.createdByUserId) {
        return 'forbidden';
    }

    // A dollar-barred role (Designer/BDM) reaching its OWN row would pass the ownership check above,
    // since it can create nothing to own only by accident of identity. Gated here for the same reason
    // `snapshotAccessFor` gates reading: a Snapshot is not theirs to see, let alone to correct.
    if (!isHead && !scope.dimensions.includes(SNAPSHOT_DIMENSION)) {
        return 'forbidden';
    }

    // Replacing a replacement would fork the audit trail: two rows would claim to supersede the same
    // push. The Head is not exempt — it corrects the successor instead.
    if (subject.status !== 'active') {
        return 'already-replaced';
    }

    // Once a buyer has pushed again, the trajectory has a shape others have read, and rewriting its
    // middle is not a correction. Applies to the Head for the same reason.
    if (subject.hasNewerActive) {
        return 'superseded';
    }

    // The Head may correct past the window — that is the manual-DB-edit escape hatch, made auditable.
    if (!isHead && !withinWindow(subject.takenAt, now)) {
        return 'window-elapsed';
    }

    return 'ok';
};
