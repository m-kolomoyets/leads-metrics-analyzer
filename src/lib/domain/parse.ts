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
    | { kind: 'unknown-geo'; type: FileType; name: string }
    // `reason` is a human sentence naming the offending column/row situation, shown next to the file.
    | { kind: 'unknown-file-type'; headers: string[]; reason: string };

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

type CsvResult = { rows: Rec[]; fields: string[]; delimiter: string; errors: string[] };

// Every separator a report has ever arrived with, plus the ASCII record/unit separators PapaParse
// knows about. Order is the tie-break order when two candidates score identically.
const CANDIDATE_DELIMITERS = [',', ';', '\t', '|', ':', Papa.RECORD_SEP, Papa.UNIT_SEP];

// Split the header with one candidate delimiter and count how many columns we actually recognise.
// Content beats consistency: PapaParse's own guesser only measures field-count stability, which a
// narrow Keitaro export defeats — every row repeats the same pipe-delimited `Offer` string
// ("SG | Longfu88 | RegForm ... | Falcons"), so `|` looks perfectly consistent and collapses the file
// into one column. A delimiter that yields real report headers is the one that is actually right.
function scoreDelimiter(text: string, delimiter: string): { score: number; fields: number } {
    const header = Papa.parse<string[]>(text, { delimiter, preview: 1, skipEmptyLines: true }).data[0] ?? [];
    const seen = new Set(
        header.map((h) => {
            return h.trim();
        })
    );
    const score = KNOWN_COLUMNS.filter((c) => {
        return seen.has(c);
    }).length;
    return { score, fields: seen.size };
}

// Pick the delimiter that exposes the most known report columns; more columns breaks a tie. Returns
// undefined when nothing is recognised, leaving PapaParse to guess so `unknownReason` can still
// describe whatever the file really is.
function detectDelimiter(text: string): string | undefined {
    let best: { delimiter: string; score: number; fields: number } | undefined;
    for (const delimiter of CANDIDATE_DELIMITERS) {
        const { score, fields } = scoreDelimiter(text, delimiter);
        if (score === 0) {
            continue;
        }
        if (!best || score > best.score || (score === best.score && fields > best.fields)) {
            best = { delimiter, score, fields };
        }
    }
    return best?.delimiter;
}

function parseCsv(text: string): CsvResult {
    const result = Papa.parse<Rec>(text, {
        header: true,
        skipEmptyLines: true,
        // Explicit when we recognise the header, otherwise PapaParse guesses — never with `|`, which
        // its default order tries before `;` and which the `Offer` column is full of.
        delimiter: detectDelimiter(text),
        delimitersToGuess: [';', ',', '\t'],
        // Trim space-padded, quoted header names before matching (doc 01). PapaParse strips the BOM.
        transformHeader: (h) => {
            return h.trim();
        },
    });
    return {
        rows: result.data,
        // `meta.fields` survives a header-only file, where `data` is empty — needed to explain why.
        fields: (result.meta.fields ?? []).filter((f) => {
            return f !== '';
        }),
        delimiter: result.meta.delimiter,
        errors: result.errors.map((e) => {
            return e.row === undefined ? e.message : `row ${e.row + 2}: ${e.message}`;
        }),
    };
}

// Signature column per file type — the single header that routes a file (doc 01).
const SIGNATURES: { type: FileType; column: string; label: string }[] = [
    { type: 'fb', column: 'Amount spent (USD)', label: 'Facebook Ads' },
    { type: 'kt-main', column: 'Offer ID', label: 'Keitaro — Main' },
    { type: 'kt-clicks', column: 'ROI (confirmed)', label: 'Keitaro — Clicks' },
];

// Other columns each report carries — used to spot a near-miss ("looks like FB, but…") so the user
// gets the one missing column name instead of a generic "unrecognised file".
const FAMILY_HINTS: Record<FileType, string[]> = {
    fb: ['Reporting starts', 'Reporting ends', 'Ad name', 'Impressions', 'Account ID', 'Campaign ID'],
    'kt-main': ['Sub ID 2', 'Sub ID 4', 'Sub ID 5', 'Conv.', 'Sales', 'Revenue', 'Offer'],
    'kt-clicks': ['Sub ID 2', 'Sub ID 4', 'Sub ID 5', 'UC (campaign)', 'Clicks'],
};

// Every header any supported report can carry — the vocabulary `detectDelimiter` scores against.
const KNOWN_COLUMNS: string[] = [
    ...SIGNATURES.map((sig) => {
        return sig.column;
    }),
    ...new Set(Object.values(FAMILY_HINTS).flat()),
];

function quoteList(items: string[], max = 6): string {
    const shown = items.slice(0, max).map((i) => {
        return `"${i}"`;
    });
    const rest = items.length - shown.length;
    return rest > 0 ? `${shown.join(', ')} (+${rest} more)` : shown.join(', ');
}

// Why did detection fail? Answer in one sentence naming the actual columns/rows at fault.
function unknownReason(csv: CsvResult): string {
    const { rows, fields, delimiter, errors } = csv;

    if (fields.length === 0) {
        return 'No header row found — the file is empty or contains no readable columns.';
    }

    if (fields.length === 1) {
        return `Only one column was detected ("${fields[0]}") using "${delimiter}" as the separator — the file is likely semicolon- or tab-separated, or is not a CSV at all.`;
    }

    // Near-miss: the file carries a report's supporting columns but not its routing column.
    const near = SIGNATURES.map((sig) => {
        const hits = FAMILY_HINTS[sig.type].filter((h) => {
            return fields.includes(h);
        });
        return { sig, hits: hits.length };
    })
        .filter((c) => {
            return c.hits >= 2;
        })
        .sort((a, b) => {
            return b.hits - a.hits;
        })[0];

    if (near) {
        return `Looks like a ${near.sig.label} export, but the required column "${near.sig.column}" is missing. Columns found: ${quoteList(fields)}.`;
    }

    if (rows.length === 0) {
        return `Header row present but no data rows follow it. Columns found: ${quoteList(fields)}.`;
    }

    if (errors.length > 0) {
        return `CSV is malformed — ${errors[0]}. Columns found: ${quoteList(fields)}.`;
    }

    const expected = SIGNATURES.map((sig) => {
        return `"${sig.column}" (${sig.label})`;
    }).join(', ');
    return `No recognised report column. Expected one of ${expected}, but the file's columns are: ${quoteList(fields, 10)}.`;
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
    const csv = parseCsv(text);
    const { rows } = csv;
    const headers = csv.fields;
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

    return { type: null, parsed: { warnings: [{ kind: 'unknown-file-type', headers, reason: unknownReason(csv) }] } };
}

// Merge already-parsed per-file partials into one batch, routing each row by its type bucket. Cheap
// (array concat only, no Papa.parse) — the heavy `parseFile` runs once per file at ingest, and its
// result is merged here on every recompute (perf: parse-once, grade-many — mirrors the reference).
export function mergeParsed(partials: Partial<ParsedFiles>[]): ParsedFiles {
    const out: ParsedFiles = { fb: [], ktMain: [], ktClicks: [], warnings: [] };
    for (const parsed of partials) {
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

// Ingest a batch of uploaded files, routing each by detected type. Files of the same type merge.
export function parseFiles(texts: string[]): ParsedFiles {
    return mergeParsed(
        texts.map((text) => {
            return parseFile(text).parsed;
        })
    );
}
