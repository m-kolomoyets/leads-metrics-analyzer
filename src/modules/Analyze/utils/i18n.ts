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
        salesCampaigns: '💰 Кампанії з продажами',
        problem: 'проблемний',
        reviewed: 'Акаунт перевірено',
        copyIds: 'Копіювати ID',
        copied: 'Скопійовано ✓',
        problemAccounts: 'Проблемні акаунти',
        excluded: 'виключено',
        checkManually: 'перевір руками (запуск / трекінг)',
        why: 'Чому',
        noPreset: 'без пресету — не оцінюється',
        thresholds: 'Пороги',
        gy: 'зел→жовт',
        yr: 'жовт→черв',
        save: 'Зберегти',
        saving: 'Збереження…',
        readonly: 'лише читання',
        sharedSettings: 'Спільні налаштування',
        defaultCommission: 'Комісія за замовч. (%)',
        reviewMultiplier: 'Множник перевірки',
        sellers: 'Продавці',
        rate: 'ставка (%)',
        accountIds: 'ID акаунтів (через кому)',
        addSeller: 'Додати продавця',
        remove: 'Прибрати',
        createPreset: 'Створити пресет',
        presetName: 'Назва пресету',
        create: 'Створити',
        creating: 'Створення…',
        rename: 'Перейменувати',
        renaming: 'Перейменування…',
        preset: 'Пресет',
        newPreset: 'Новий пресет',
        importPreset: 'Імпортувати пресет',
        chooseImport: 'Оберіть пресет для імпорту',
        cancel: 'Скасувати',
        noResults: 'Нічого не знайдено',
        delete: 'Видалити',
        confirmDelete: 'Підтвердити видалення',
        deleting: 'Видалення…',
        team: 'Команда',
        globalSettings: 'Глобальні (без команди)',
        geoTotal: 'Гео тотал',
        attributed: 'Атрибутовано',
        untaggedGap: 'Без сабів (лише в гео тоталі)',
        divergenceNote:
            'Гео тотал включає дохід без сабів — реальні гроші, які FB не протегував (ADR-0003). Тому гео ≥ сума кампаній.',
        offers: 'Офери',
        osTable: 'OS',
        allocEstimate: 'Spend оцінено: реальний Spend⁺ кампанії розподілено пропорційно інсталам (оцінка).',
        wasteTitle: 'Злито поза нормою',
        wastePctOfSpend: '% від Spend⁺',
        wasteZone: 'Зона втрат',
        copyOffers: 'Копіювати офери',
    },
    en: {
        sales: 'WITH SALES',
        salesCampaigns: '💰 Sales campaigns',
        problem: 'problem',
        reviewed: 'Account checked',
        copyIds: 'Copy IDs',
        copied: 'Copied ✓',
        problemAccounts: 'Problem accounts',
        excluded: 'excluded',
        checkManually: 'check by hand (launch / tracking)',
        why: 'Why',
        noPreset: 'no preset — ungraded',
        thresholds: 'Thresholds',
        gy: 'green→yellow',
        yr: 'yellow→red',
        save: 'Save',
        saving: 'Saving…',
        readonly: 'read-only',
        sharedSettings: 'Shared settings',
        defaultCommission: 'Default commission (%)',
        reviewMultiplier: 'Review multiplier',
        sellers: 'Sellers',
        rate: 'rate (%)',
        accountIds: 'Account IDs (comma-separated)',
        addSeller: 'Add seller',
        remove: 'Remove',
        createPreset: 'Create preset',
        presetName: 'Preset name',
        create: 'Create',
        creating: 'Creating…',
        rename: 'Rename',
        renaming: 'Renaming…',
        preset: 'Preset',
        newPreset: 'New preset',
        importPreset: 'Import preset',
        chooseImport: 'Choose a preset to import',
        cancel: 'Cancel',
        noResults: 'No results',
        delete: 'Delete',
        confirmDelete: 'Confirm delete',
        deleting: 'Deleting…',
        team: 'Team',
        globalSettings: 'Global (no team)',
        geoTotal: 'Geo total',
        attributed: 'Attributed',
        untaggedGap: 'Untagged (Geo total only)',
        divergenceNote:
            'Geo total includes untagged revenue — real money FB failed to tag (ADR-0003). So geo ≥ sum of campaigns.',
        offers: 'Offers',
        osTable: 'OS',
        allocEstimate:
            'Spend is estimated: each campaign real Spend⁺ split across offers/OS in proportion to installs (estimate).',
        wasteTitle: 'Wasted over the line',
        wastePctOfSpend: '% of Spend⁺',
        wasteZone: 'Waste zone',
        copyOffers: 'Copy offers',
    },
};

// The five editable threshold rows, in the reference's order. Keyed to `PresetThresholds`.
export const THRESHOLD_METRICS = ['installs', 'regs', 'sales', 'clicks', 'wasteZones'] as const;

export type ThresholdMetric = (typeof THRESHOLD_METRICS)[number];

const METRIC_LABEL: Record<Locale, Record<ThresholdMetric, string>> = {
    uk: { installs: 'Інстали', regs: 'Реги', sales: 'Продажі', clicks: 'Кліки', wasteZones: 'Зони втрат' },
    en: { installs: 'Installs', regs: 'Regs', sales: 'Sales', clicks: 'Clicks', wasteZones: 'Waste zones' },
};

export function metricLabel(metric: ThresholdMetric, locale: Locale): string {
    return METRIC_LABEL[locale][metric];
}

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
