import type { VerdictReason, Zone } from '@/lib/domain/types';
import type { ProblemAccount, Verdict } from '@/lib/domain/verdict';

// i18n at the UI edge (ADR-0004): the domain returns structured verdicts/reasons; every display
// string lives here. Ukrainian is the team's canonical language (doc 04 glossary); English mirrors it.

export const LOCALES = ['uk', 'en'] as const;

export type Locale = (typeof LOCALES)[number];

// Verdict action per zone — code ids stop/hold/scale, rendered in the team's words.
const ACTION: Record<Locale, Record<Zone, string>> = {
    uk: { red: 'СТОП', yellow: 'ТРИМАЄМО', green: 'БУСТ', neutral: 'рано' },
    en: { red: 'STOP', yellow: 'HOLD', green: 'BOOST', neutral: 'early' },
};

// Sales-block heading and account chrome.
const UI: Record<Locale, Record<string, string>> = {
    uk: {
        sales: 'З ПРОДАЖАМИ',
        problem: 'проблемний',
        reviewed: 'Акаунт перевірено',
        copyIds: 'Копіювати ID',
        copied: 'Скопійовано ✓',
        problemAccounts: 'Проблемні акаунти',
        excluded: 'виключено',
        checkManually: 'перевір руками (запуск / трекінг)',
        why: 'Чому',
        noPreset: 'без пресету — не оцінюється',
    },
    en: {
        sales: 'WITH SALES',
        problem: 'problem',
        reviewed: 'Account checked',
        copyIds: 'Copy IDs',
        copied: 'Copied ✓',
        problemAccounts: 'Problem accounts',
        excluded: 'excluded',
        checkManually: 'check by hand (launch / tracking)',
        why: 'Why',
        noPreset: 'no preset — ungraded',
    },
};

export function actionLabel(zone: Zone, locale: Locale): string {
    return ACTION[locale][zone];
}

export function ui(key: string, locale: Locale): string {
    return UI[locale][key] ?? key;
}

// The structured reason as a terse cost line: METRIC $value. Null (too early) → em dash.
export function reasonText(reason: VerdictReason | null): string {
    if (!reason) {
        return '—';
    }
    return `${reason.metric.toUpperCase()} $${reason.value.toFixed(2)}`;
}

// A campaign's full "why": action word + the cost line that decided it.
export function verdictWhy(verdict: Verdict, locale: Locale): string {
    if (!verdict.reason) {
        return actionLabel(verdict.verdict, locale);
    }
    return `${actionLabel(verdict.verdict, locale)} · ${reasonText(verdict.reason)}`;
}

// Problem-account reason per rule (doc 04). Rule 1: spend out, nothing tracked. Rule 2: unics dear.
export function problemReason(problem: ProblemAccount, spendPlus: number, cpi: number | null, locale: Locale): string {
    if (problem.rule === 1) {
        return locale === 'uk'
            ? `0 інсталів за Spend⁺ $${spendPlus.toFixed(2)}`
            : `0 installs on Spend⁺ $${spendPlus.toFixed(2)}`;
    }
    const cpiText = cpi === null ? '—' : `$${cpi.toFixed(2)}`;
    return locale === 'uk'
        ? `уніки дорогі (CPI ${cpiText}), реги погані, 0 депозитів`
        : `unics dear (CPI ${cpiText}), regs bad, 0 deposits`;
}
