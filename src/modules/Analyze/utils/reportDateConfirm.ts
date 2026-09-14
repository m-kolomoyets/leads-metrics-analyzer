import { kyivDay } from '@/lib/utils/kyivDay';

// Saving under any day but today rewrites a closed day (ADR-0017), so the click has to be confirmed.
// "Today" is Kyiv's today — the same clock the whole team reads — never the browser's.
export function needsReportDateConfirmation(reportDate: string, now: Date = new Date()): boolean {
    return reportDate !== kyivDay(now);
}
