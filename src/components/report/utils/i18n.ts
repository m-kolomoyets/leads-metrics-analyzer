import type { Stage, VerdictReason, Zone } from '@/lib/domain/types';
import type { ProblemAccount, Verdict } from '@/lib/domain/verdict';
import { usd } from './format';

// i18n at the UI edge (ADR-0004): the domain returns structured verdicts/reasons; every display
// string lives here. Ukrainian is the team's canonical language (doc 04 glossary); English mirrors it.

export const LOCALES = ['uk', 'en'] as const;

export type Locale = (typeof LOCALES)[number];

// Verdict action per zone — code ids stop/hold/scale, rendered in the team's words.
const ACTION: Record<Locale, Record<Zone, string>> = {
    uk: { red: 'СТОП', yellow: 'ТРИМАЄМО', green: 'БУСТ', neutral: 'рано' },
    en: { red: 'STOP', yellow: 'HOLD', green: 'BOOST', neutral: 'early' },
};

// The funnel stage a verdict was decided at, in the team's words (doc 04 "why" column).
const STAGE_LABEL: Record<Locale, Record<Stage, string>> = {
    uk: { sales: 'Продажі', regs: 'Реєстрації', installs: 'Інстали', clicks: 'Кліки' },
    en: { sales: 'Sales', regs: 'Regs', installs: 'Installs', clicks: 'Clicks' },
};

// Zone as an adjective for the "why" line (distinct from the ACTION verb).
const ZONE_LABEL: Record<Locale, Record<Zone, string>> = {
    uk: { green: 'зелена', yellow: 'жовта', red: 'червона', neutral: 'нейтр.' },
    en: { green: 'green', yellow: 'yellow', red: 'red', neutral: 'neutral' },
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
        zoneMetrics: 'Метрики зон',
        save: 'Зберегти',
        saving: 'Збереження…',
        unsaved: 'Незбережені зміни',
        readonly: 'лише читання',
        sharedSettings: 'Спільні налаштування',
        defaultCommission: 'Комісія за замовч. (%)',
        reviewMultiplier: 'Коефіцієнт проблемності',
        wasteRange: 'Діапазон допустимих втрат спенду у %',
        percentScale: 'Шкала 0–100%.',
        sellers: 'Сейлери аккаунтів',
        rate: 'ставка (%)',
        accountIds: 'ID акаунтів (через кому)',
        addSeller: 'Додати сейлера',
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
        geoTotal: 'Гео тотал',
        attributed: 'Атрибутовано',
        untaggedGap: 'Без сабів (лише в гео тоталі)',
        divergenceNote:
            'Гео тотал включає дохід без сабів — реальні гроші, які FB не протегував (ADR-0003). Тому гео ≥ сума кампаній.',
        offers: 'Офери',
        osTable: 'OS',
        totalAvg: 'Разом / сер.',
        allocEstimate: 'Spend оцінено: реальний Spend⁺ кампанії розподілено пропорційно інсталам (оцінка).',
        unallocatedRow: 'Без інсталів (не розподілено)',
        wasteTitle: 'Злито поза нормою',
        wastePctOfSpend: '% від Spend⁺',
        wasteZone: 'Зона втрат',
        copyOffers: 'Копіювати офери',
        creatives: '🎨 Аналіз креативів',
        creative: 'Креатив',
        creativeEstimate:
            'Покази — реальні на креатив; Spend показано з комісією (Spend⁺); воронку (інстали/реги/продажі/кліки) розподілено пропорційно Spend (оцінка).',
        accountSummary: 'Зведення по акаунтах',
        summaryHint: 'клік — до блоку',
        wasteCol: 'Злито',
        wasteEstimate: 'Злито — оцінка (Spend⁺ понад лінію жовт→черв).',
        wasteAccountGrain:
            'Проблемний акаунт: злите рахується по акаунту цілком (Spend⁺ понад бар перевірки), а не як сума кампаній — тож із рядками кампаній не збігається.',
        wasteAccountGrainNote: '* — злите пораховано по акаунту цілком, не сумою кампаній.',
        noSalesCampaigns: 'Кампанії без продажів',
        saveSnapshot: 'Зберегти зріз',
        savingSnapshot: 'Збереження зрізу…',
        snapshotSaved: 'Зріз збережено',
        reportDate: 'Дата звіту',
        snapshotNeedsPreset: 'Спершу збережи пресет для гео',
        snapshotNoFacts: 'Немає рядків для збереження',
        snapshotNeedsDate: 'Вкажи дату звіту',
        snapshotDateConfirmTitle: 'Зберегти не за сьогодні?',
        snapshotDateConfirmBody: 'Звіт буде зараховано за {date}, а не за сьогодні. Це змінює вже закритий день.',
        snapshotDateConfirmYes: 'Так, зарахувати за {date}',
        rowsCount: 'рядків',
        geoCount: 'гео',
        snapshotHint: 'Зріз фіксує активні версії пресетів і спільних налаштувань — числа відтворяться назавжди.',
        report: 'Звіт',
        reportMuted: 'Баєр заглушив кампаній',
        reportMutedNote: 'Ці кампанії відсутні в цифрах нижче.',
        reportNoRollup: 'Зріз збережено до появи гео тоталу — гео тотал, профіт, ROI та злите недоступні.',
        feed: 'Стрічка звітів',
        archive: 'Архів',
        archiveEmpty: 'За цей період ніхто не звітував',
        pushes: 'надсилань',
        lastReport: 'Останній звіт',
        never: 'ніколи',
        noReportsInRange: 'Немає звітів за період',
        noUsersVisible: 'Немає користувачів у зоні видимості',
        pushed: 'Надіслано',
        openReport: 'Відкрити звіт',
        backToDynamics: 'До динаміки',
        backToArchive: 'До архіву',
        backToFeed: 'До стрічки',
        openGeo: 'Відкрити гео',
        cardNoRollup: 'Зріз без гео тоталу — цифри недоступні',
        range: 'Період',
        range1d: 'День',
        range3d: '3 дні',
        range7d: 'Тиждень',
        range30d: 'Місяць',
        rangeAll: 'Увесь час',
        rangeCustom: 'Свій',
        userArchive: 'Усі звіти в архіві',
        allUsers: 'Показати всіх',
        rangeFrom: 'з',
        rangeTo: 'по',
        rangePick: 'Обрати дати',
        datePick: 'Обрати дату',
        rangeClear: 'Скинути',
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
        zoneMetrics: 'Zone metrics',
        save: 'Save',
        saving: 'Saving…',
        unsaved: 'Unsaved changes',
        readonly: 'read-only',
        sharedSettings: 'Shared settings',
        defaultCommission: 'Default commission (%)',
        reviewMultiplier: 'Review multiplier',
        wasteRange: 'Tolerated spend loss range, %',
        percentScale: 'Scale 0\u2013100%.',
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
        geoTotal: 'Geo total',
        attributed: 'Attributed',
        untaggedGap: 'Untagged (Geo total only)',
        divergenceNote:
            'Geo total includes untagged revenue — real money FB failed to tag (ADR-0003). So geo ≥ sum of campaigns.',
        offers: 'Offers',
        osTable: 'OS',
        totalAvg: 'Total / avg',
        allocEstimate:
            'Spend is estimated: each campaign real Spend⁺ split across offers/OS in proportion to installs (estimate).',
        unallocatedRow: 'No installs (unallocated)',
        wasteTitle: 'Wasted over the line',
        wastePctOfSpend: '% of Spend⁺',
        wasteZone: 'Waste zone',
        copyOffers: 'Copy offers',
        creatives: '🎨 Creative analysis',
        creative: 'Creative',
        creativeEstimate:
            'Impressions are real per creative and Spend is commission-inclusive (Spend⁺); the funnel (installs/regs/sales/clicks) is split across creatives in proportion to Spend (estimate).',
        accountSummary: 'Account summary',
        summaryHint: 'click a row to jump',
        wasteCol: 'Waste',
        wasteEstimate: 'Waste is an estimate (Spend⁺ over the yellow→red line).',
        wasteAccountGrain:
            'Problem account: waste is measured over the whole account (Spend⁺ past the review bar), not summed from its campaigns — so it will not match the campaign rows.',
        wasteAccountGrainNote: '* waste measured over the whole account, not summed from its campaigns.',
        noSalesCampaigns: 'Campaigns without sales',
        saveSnapshot: 'Save snapshot',
        savingSnapshot: 'Saving snapshot…',
        snapshotSaved: 'Snapshot saved',
        reportDate: 'Report date',
        snapshotNeedsPreset: 'Save a preset first for geo',
        snapshotNoFacts: 'Nothing left to save',
        snapshotNeedsDate: 'Pick a report date',
        snapshotDateConfirmTitle: 'Save for a day other than today?',
        snapshotDateConfirmBody: 'Report will be counted for {date}, not today. This changes an already closed day.',
        snapshotDateConfirmYes: 'Yes, count for {date}',
        rowsCount: 'rows',
        geoCount: 'geo',
        snapshotHint: 'A snapshot pins the active preset and shared-settings versions — the numbers reproduce forever.',
        report: 'Report',
        reportMuted: 'Campaigns muted by the buyer',
        reportMutedNote: 'Those campaigns are absent from every figure below.',
        reportNoRollup:
            'Saved before geo totals were frozen — Geo total, Profit, ROI and Waste are unavailable for this report.',
        feed: 'Report feed',
        archive: 'Archive',
        archiveEmpty: 'Nobody reported in this range',
        pushes: 'pushes',
        lastReport: 'Last report',
        never: 'never',
        noReportsInRange: 'No reports in this range',
        noUsersVisible: 'No users in view',
        pushed: 'Pushed',
        openReport: 'Open report',
        backToDynamics: 'Back to dynamics',
        backToArchive: 'Back to archive',
        backToFeed: 'Back to feed',
        openGeo: 'Open geo',
        cardNoRollup: 'Snapshot without geo totals — figures unavailable',
        range: 'Range',
        range1d: 'Day',
        range3d: '3 days',
        range7d: 'Week',
        range30d: 'Month',
        rangeAll: 'All time',
        rangeCustom: 'Custom',
        userArchive: 'All reports in the archive',
        allUsers: 'Show everyone',
        rangeFrom: 'from',
        rangeTo: 'to',
        rangePick: 'Pick dates',
        datePick: 'Pick a date',
        rangeClear: 'Clear',
    },
};

// The four editable threshold rows, in the reference's order. Keyed to `PresetThresholds`. Waste
// zones are no longer one of them — they live in the shared-settings block (SharedSettingsPayload).
export const THRESHOLD_METRICS = ['installs', 'regs', 'sales', 'clicks'] as const;

export type ThresholdMetric = (typeof THRESHOLD_METRICS)[number];

const METRIC_LABEL: Record<Locale, Record<ThresholdMetric, string>> = {
    uk: { installs: 'Інстали', regs: 'Реги', sales: 'Продажі', clicks: 'Кліки' },
    en: { installs: 'Installs', regs: 'Regs', sales: 'Sales', clicks: 'Clicks' },
};

// The zone as an adjective — "зелена" / "green". Used where a dot stands in for the word and the
// word itself only survives as the dot's hover title.
export function zoneLabel(zone: Zone, locale: Locale): string {
    return ZONE_LABEL[locale][zone];
}

export function metricLabel(metric: ThresholdMetric, locale: Locale): string {
    return METRIC_LABEL[locale][metric];
}

export function actionLabel(zone: Zone, locale: Locale): string {
    return ACTION[locale][zone];
}

export function ui(key: string, locale: Locale): string {
    return UI[locale][key] ?? key;
}

// The month spelled out — "3 серпня 2026" — because a stamped report date is read once and has to be
// unambiguous; `03/08/2026` means two different days on two sides of the Atlantic.
const LONG_DATE: Record<Locale, Intl.DateTimeFormat> = {
    uk: new Intl.DateTimeFormat('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' }),
    en: new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
};

export function longDate(date: Date, locale: Locale): string {
    return LONG_DATE[locale].format(date);
}

// The structured reason as the reference "why" line — the criteria that decided, per locale, never
// the action word (the row's colour bar already carries the verdict). Null reason (no preset) → dash.
export function reasonText(reason: VerdictReason | null, locale: Locale): string {
    if (!reason) {
        return '—';
    }
    const money = usd('value' in reason ? reason.value : 0);
    switch (reason.kind) {
        case 'graded': {
            const line = `${STAGE_LABEL[locale][reason.stage]}: ${reason.metric.toUpperCase()} ${money}`;
            return `${line} — ${ZONE_LABEL[locale][reason.zone]}`;
        }
        case 'clicksWaiting': {
            const line = `${STAGE_LABEL[locale].clicks}: CPC ${money} — ${ZONE_LABEL[locale].yellow}`;
            return locale === 'uk' ? `${line}, чекаємо інстал` : `${line}, awaiting install`;
        }
        case 'zeroResult': {
            const stage = STAGE_LABEL[locale][reason.stage];
            return locale === 'uk' ? `${stage}: 0 за ${money} (понад черв.)` : `${stage}: 0 on ${money} (over red)`;
        }
        case 'tooEarly': {
            return locale === 'uk' ? `Рано судити (spend ${money})` : `Too early (spend ${money})`;
        }
        case 'spendZero': {
            return locale === 'uk' ? 'Spend 0 — не аналізується' : 'Spend 0 — not analyzed';
        }
    }
}

// A campaign's "why": the criteria the domain decided on, rendered per locale.
export function verdictWhy(verdict: Verdict, locale: Locale): string {
    return reasonText(verdict.reason, locale);
}

// Problem-account reason per rule (doc 04). Rule 1: spend out, nothing tracked. Rule 2: unics dear.
export function problemReason(problem: ProblemAccount, spendPlus: number, cpi: number | null, locale: Locale): string {
    if (problem.rule === 1) {
        return locale === 'uk' ? `0 інсталів за Spend⁺ ${usd(spendPlus)}` : `0 installs on Spend⁺ ${usd(spendPlus)}`;
    }
    const cpiText = cpi === null ? '—' : usd(cpi);
    return locale === 'uk'
        ? `уніки дорогі (CPI ${cpiText}), реги погані, 0 депозитів`
        : `unics dear (CPI ${cpiText}), regs bad, 0 deposits`;
}
