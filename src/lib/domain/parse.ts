import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json' with { type: 'json' };
import Papa from 'papaparse';

// 1 · Ingestion & Hygiene (doc 01). Turn three kinds of uploaded CSV into clean, typed rows ready
// to join. Pure: takes raw file text, returns data + warnings. No fetch, no DOM.

// Register the complete ISO-3166 name→alpha-2 table once. Keitaro emits English country names; we
// need the code ONLY to place untagged/unfired-macro revenue at Geo level (doc 01 §Geo). Unknown
// names fail loud (a warning), never a silent passthrough — the prototype's biggest multi-geo hazard.
countries.registerLocale(enLocale);

export type FileType = 'fb' | 'kt-main' | 'kt-clicks';

export type FbRow = {
    geo: string;
    account: string;
    campaign: string;
    creative: string;
    spend: number;
    impressions: number;
    reportStart: string;
    reportEnd: string;
};

export type KtMainRow = {
    campaign: string;
    account: string;
    creative: string;
    // `Offer ID` — the offer identity (doc 06). Allocation keys and reconciles on this.
    offer: string;
    // The pipe-delimited `Offer` string — display attributes only, parsed at the allocation edge.
    offerName: string;
    os: string;
    installs: number;
    regs: number;
    sales: number;
    revenue: number;
    // Geo as ISO-2, resolved from the Keitaro country name; null when the name is unknown.
    geo: string | null;
    // `Sub ID 2` starts with `{` → macro never expanded; Campaign attribution lost, Geo survives.
    unfiredMacro: boolean;
};

export type KtClicksRow = {
    campaign: string;
    account: string;
    creative: string;
    os: string;
    linkClicks: number;
    geo: string | null;
    unfiredMacro: boolean;
};

export type ParseWarning =
    { kind: 'unknown-geo'; type: FileType; name: string } | { kind: 'unknown-file-type'; headers: string[] };

export type ParsedFiles = {
    fb: FbRow[];
    ktMain: KtMainRow[];
    ktClicks: KtClicksRow[];
    warnings: ParseWarning[];
};

// Number parse (doc 01): strip `$` and whitespace; treat comma as decimal only when there is no dot,
// else as a thousands separator. Non-numeric → 0.
export function num(raw: string | number | null | undefined): number {
    if (typeof raw === 'number') {
        return Number.isFinite(raw) ? raw : 0;
    }
    if (raw === null || raw === undefined) {
        return 0;
    }
    let s = raw.replace(/\$/g, '').replace(/\s/g, '').trim();
    if (s === '') {
        return 0;
    }
    if (s.includes(',') && !s.includes('.')) {
        s = s.replace(/,/g, '.');
    } else {
        s = s.replace(/,/g, '');
    }
    const n = Number(s);
    return Number.isFinite(n) ? n : 0;
}

// Resolve a Keitaro country name to an ISO-2 code. Undefined (→ null + warning) on any miss.
function geoFromName(name: string): string | null {
    const code = countries.getAlpha2Code(name.trim(), 'en');
    return code ?? null;
}

type Rec = Record<string, string>;

function parseCsv(text: string): Rec[] {
    const result = Papa.parse<Rec>(text, {
        header: true,
        skipEmptyLines: true,
        // Trim space-padded, quoted header names before matching (doc 01). PapaParse strips the BOM.
        transformHeader: (h) => {
            return h.trim();
        },
    });
    return result.data;
}

// Route a file by its detected columns, not by drop-zone (doc 01) — a KT file on the FB slot still
// lands correctly.
export function detectType(headers: string[]): FileType | null {
    const set = new Set(
        headers.map((h) => {
            return h.trim();
        })
    );
    if (set.has('Amount spent (USD)')) {
        return 'fb';
    }
    if (set.has('Offer ID')) {
        return 'kt-main';
    }
    if (set.has('ROI (confirmed)')) {
        return 'kt-clicks';
    }
    return null;
}

function toFbRow(r: Rec): FbRow {
    return {
        geo: (r['Country'] ?? '').trim(),
        account: (r['Account ID'] ?? '').trim(),
        campaign: (r['Campaign ID'] ?? '').trim(),
        creative: (r['Ad name'] ?? '').trim(),
        spend: num(r['Amount spent (USD)']),
        impressions: num(r['Impressions']),
        reportStart: (r['Reporting starts'] ?? '').trim(),
        reportEnd: (r['Reporting ends'] ?? '').trim(),
    };
}

// Parse one file's text. Applies hygiene (doc 01): Totals and Invalid rows are dropped; Unfired-Macro
// rows are kept and tagged (they survive at Geo level, ADR-0003). Unknown geo names are warned.
export function parseFile(text: string): { type: FileType | null; parsed: Partial<ParsedFiles> } {
    const rows = parseCsv(text);
    const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
    const type = detectType(headers);
    const warnings: ParseWarning[] = [];

    if (type === 'fb') {
        // Totals Row: empty Country.
        const fb = rows.map(toFbRow).filter((row) => {
            return row.geo !== '';
        });
        return { type, parsed: { fb, warnings } };
    }

    if (type === 'kt-main') {
        const ktMain: KtMainRow[] = [];
        for (const r of rows) {
            const campaign = (r['Sub ID 2'] ?? '').trim();
            const os = (r['OS'] ?? '').trim();
            // Totals Row (empty Sub ID 2) and Invalid Row (empty OS) are dropped everywhere.
            if (campaign === '' || os === '') {
                continue;
            }
            const name = (r['Country'] ?? '').trim();
            const geo = geoFromName(name);
            if (name !== '' && geo === null) {
                warnings.push({ kind: 'unknown-geo', type, name });
            }
            ktMain.push({
                campaign,
                account: (r['Sub ID 4'] ?? '').trim(),
                creative: (r['Sub ID 5'] ?? '').trim(),
                offer: (r['Offer ID'] ?? '').trim(),
                offerName: (r['Offer'] ?? '').trim(),
                os,
                installs: num(r['UC (campaign)']),
                regs: num(r['Conv.']),
                sales: num(r['Sales']),
                revenue: num(r['Revenue']),
                geo,
                unfiredMacro: campaign.startsWith('{'),
            });
        }
        return { type, parsed: { ktMain, warnings } };
    }

    if (type === 'kt-clicks') {
        const ktClicks: KtClicksRow[] = [];
        for (const r of rows) {
            const campaign = (r['Sub ID 2'] ?? '').trim();
            // Totals Row: empty Sub ID 2. (Clicks report has no OS-invalid rule.)
            if (campaign === '') {
                continue;
            }
            const name = (r['Country'] ?? '').trim();
            const geo = geoFromName(name);
            if (name !== '' && geo === null) {
                warnings.push({ kind: 'unknown-geo', type, name });
            }
            ktClicks.push({
                campaign,
                account: (r['Sub ID 4'] ?? '').trim(),
                creative: (r['Sub ID 5'] ?? '').trim(),
                os: (r['OS'] ?? '').trim(),
                linkClicks: num(r['UC (campaign)']),
                geo,
                unfiredMacro: campaign.startsWith('{'),
            });
        }
        return { type, parsed: { ktClicks, warnings } };
    }

    return { type: null, parsed: { warnings: [{ kind: 'unknown-file-type', headers }] } };
}

// Ingest a batch of uploaded files, routing each by detected type. Files of the same type merge.
export function parseFiles(texts: string[]): ParsedFiles {
    const out: ParsedFiles = { fb: [], ktMain: [], ktClicks: [], warnings: [] };
    for (const text of texts) {
        const { parsed } = parseFile(text);
        if (parsed.fb) {
            out.fb.push(...parsed.fb);
        }
        if (parsed.ktMain) {
            out.ktMain.push(...parsed.ktMain);
        }
        if (parsed.ktClicks) {
            out.ktClicks.push(...parsed.ktClicks);
        }
        if (parsed.warnings) {
            out.warnings.push(...parsed.warnings);
        }
    }
    return out;
}
