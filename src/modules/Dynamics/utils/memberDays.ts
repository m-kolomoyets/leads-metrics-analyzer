import type { DynamicsHistoryDay } from '@/services/dynamics/types';

// The member card's month grid, one dot at a time (SPEC §6.2). Pure, so the grading rule is testable
// without a DOM (ADR-0005).
//
// The grid is built from the CALENDAR month, never from the days that happen to carry a Snapshot: a
// buyer who reported four days out of thirty must show twenty-six holes, and a row of four dots
// would read as a perfect month.

// Where a day's colour comes from. Grey is said twice, deliberately: `unreported` is nobody pushing,
// `ungraded` is a push there is no way to grade — a day with no spend, or one whose Snapshot froze no
// rollup. Collapsing them would let a reported day be mistaken for a missing one.
export type MemberDayState =
    // Later this month — no dot yet, only the slot it will occupy.
    | 'future'
    // The month has passed this day and nothing was pushed for it.
    | 'unreported'
    // Reported, and nothing to grade it on.
    | 'ungraded'
    | 'green'
    | 'yellow'
    | 'red';

export type MemberDay = {
    date: string;
    state: MemberDayState;
    // Absent for every state but the graded three plus `ungraded` — a day nobody reported has no
    // figures at all, which is not the same as figures of zero.
    profit: number | null;
    spendPlus: number;
    // Percent points, null when there was no Spend⁺ to divide by.
    roi: number | null;
};

// The ROI a day has to clear to read green. This is a MAGNITUDE threshold, and it is the only one on
// the page: the tab row grades on the sign of profit alone. A day is graded on ROI rather than on
// dollars so that a $300 buyer and a $5,000 buyer are held to the same standard — a fixed dollar band
// would paint the small buyer amber every day of their life.
//
// It is a flat number rather than a frozen Ruleset threshold on purpose: Rulesets grade cost-per
// metrics per Geo (ADR-0002), and a month grid spans every market a buyer touched, so there is no one
// frozen plan to read it against.
const GREEN_ABOVE_ROI = 20;

// A day with no push of its own: either it has not happened yet, or nobody reported it.
function blankState(date: string, today: string): MemberDayState {
    return date > today ? 'future' : 'unreported';
}

function stateOf(day: DynamicsHistoryDay): MemberDayState {
    // A push that froze no rollup: there is no total to grade, which is not a total of zero.
    if (day.profit === null) {
        return 'ungraded';
    }

    // One dollar of loss is red, the same call the tab row makes.
    if (day.profit < 0) {
        return 'red';
    }

    // Nothing was risked, so nothing is being judged — a green dot here would celebrate a day off.
    if (day.spendPlus <= 0) {
        return 'ungraded';
    }

    return (day.profit / day.spendPlus) * 100 > GREEN_ABOVE_ROI ? 'green' : 'yellow';
}

// The whole month, in order, for one buyer. `today` is the day the page is reading — everything after
// it is a slot rather than a hole, so the grid keeps one width all month.
export function memberDays(month: string[], history: DynamicsHistoryDay[], today: string): MemberDay[] {
    const byDate = new Map(
        history.map((day) => {
            return [day.reportDate, day];
        })
    );

    return month.map((date): MemberDay => {
        const day = byDate.get(date);

        if (!day) {
            return {
                date,
                state: blankState(date, today),
                profit: null,
                spendPlus: 0,
                roi: null,
            };
        }

        return {
            date,
            state: stateOf(day),
            profit: day.profit,
            spendPlus: day.spendPlus,
            roi: day.profit === null || day.spendPlus <= 0 ? null : (day.profit / day.spendPlus) * 100,
        };
    });
}

// The dollar-free month (#10). Every reported day is `ungraded`, because that is exactly what it is:
// a push this viewer holds no dimension to grade.
export function dimensionMemberDays(month: string[], reportedDates: string[], today: string): MemberDay[] {
    const reported = new Set(reportedDates);

    return month.map((date): MemberDay => {
        const state: MemberDayState = reported.has(date) ? 'ungraded' : blankState(date, today);

        return { date, state, profit: null, spendPlus: 0, roi: null };
    });
}
