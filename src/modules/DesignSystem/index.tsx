import type { ColourToken, ThemeName } from './constants';
import { BellIcon, ChartLineIcon, SearchIcon, SettingsIcon } from 'lucide-react';
import {
    ACCENT_TOKENS,
    CHROME_TOKENS,
    ICON_SIZES,
    INTERACTION_TOKENS,
    RADIUS_STEPS,
    SHADOW_BY_THEME,
    SURFACE_BY_THEME,
    TYPE_SCALE,
    WEIGHT_RAMP,
    ZONE_TOKENS,
} from './constants';
import { formatContrastRatio } from './utils/contrast';
import { ActionPrimitives } from './components/ActionPrimitives';
import { ContentPrimitives } from './components/ContentPrimitives';
import { FormPrimitives } from './components/FormPrimitives';
import { OverlayPrimitives } from './components/OverlayPrimitives';
import { Section } from './components/Section';
import { Specimen } from './components/Specimen';
import { Swatch } from './components/Swatch';
import { TablePrimitive } from './components/TablePrimitive';
import { ThemeSplit } from './components/ThemeSplit';

const swatchesFor = (tokens: ReadonlyArray<ColourToken>, theme: ThemeName, withRatio = false) => {
    return tokens.map((token) => {
        return (
            <Swatch
                key={token.name}
                name={token.name}
                value={token[theme]}
                usage={token.usage}
                // Against its own surface, which is the only comparison that means anything: the dark
                // amber is measured on #161616, the light one on #ffffff.
                ratio={withRatio ? formatContrastRatio(token[theme], SURFACE_BY_THEME[theme]) : undefined}
            />
        );
    });
};

// The whole system on one page, both themes at once. This is the migration's definition of done:
// 23 primitives × 2 themes × states is not a matrix anyone checks by clicking through the real app,
// and the light theme is where a half-migrated component hides. A primitive is migrated when it
// looks right here, not when the one screen using it looks right.
function DesignSystem() {
    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 p-6">
            <header className="flex flex-col gap-1">
                <h1 className="text-base font-semibold">Design system</h1>
                <p className="text-muted-foreground max-w-3xl text-sm">
                    Every token in <code>docs/design-system.md</code> and every <code>ui/</code> primitive, in both
                    themes side by side. Overlay primitives portal to <code>document.body</code>, so an opened dialog,
                    menu or tooltip wears the app&apos;s own theme rather than the pane&apos;s — check the second one
                    with the theme switcher. Hover and focus-visible are live states: reach for them with the pointer
                    and the Tab key.
                </p>
            </header>

            <Section
                id="colour"
                title="Colour — chrome"
                description="Two surfaces, two borders, true neutral grey. No cool cast, no third surface."
            >
                <ThemeSplit className="grid gap-3 sm:grid-cols-2">
                    {(theme) => {
                        return swatchesFor(CHROME_TOKENS, theme);
                    }}
                </ThemeSplit>
            </Section>

            <Section
                id="accent"
                title="Colour — accent"
                description="Focus ring, active nav item, selected tab, chosen metric, checked control, link. Never a background wash, never a border on a resting element."
            >
                <ThemeSplit className="grid gap-3 sm:grid-cols-2">
                    {(theme) => {
                        return swatchesFor(ACCENT_TOKENS, theme);
                    }}
                </ThemeSplit>
            </Section>

            <Section
                id="zone"
                title="Colour — Zone"
                description="The only other colour. Ratios are measured against each theme's own --surface at render time; the requirement is ≥4.5:1, and light-mode amber is the tightest value in the system."
            >
                <ThemeSplit className="grid gap-3 sm:grid-cols-2">
                    {(theme) => {
                        return swatchesFor(ZONE_TOKENS, theme, true);
                    }}
                </ThemeSplit>
            </Section>

            <Section
                id="interaction"
                title="Colour — interaction"
                description="One translucent grey wash for every hover, one step up for the selected row. Translucent on purpose: it reads the same over --surface, --popover and the sidebar, so no surface needs a hover token of its own. Nothing in navigation is accented any more."
            >
                <ThemeSplit className="grid gap-3 sm:grid-cols-2">
                    {(theme) => {
                        return swatchesFor(INTERACTION_TOKENS, theme);
                    }}
                </ThemeSplit>
            </Section>

            <Section
                id="surfaces"
                title="Surfaces and elevation"
                description="Two levels and one shadow. Inline surfaces get a hairline border and a lightness step; only floating things wear the shadow."
            >
                <ThemeSplit>
                    {(theme) => {
                        return (
                            <>
                                <div className="bg-background border-border flex flex-col gap-3 rounded-md border p-3">
                                    <p className="text-xs font-medium">--background · the page</p>
                                    <div className="bg-surface border-border rounded-md border p-3">
                                        <p className="text-xs font-medium">--surface · inline</p>
                                        <p className="text-muted-foreground text-xs">
                                            cards, panels, tables, sidebar — border, no shadow
                                        </p>
                                    </div>
                                    <div className="bg-surface-overlay border-border shadow-overlay rounded-md border p-3">
                                        <p className="text-xs font-medium">--surface-overlay · floating</p>
                                        <p className="text-muted-foreground text-xs">
                                            popover, menu, dialog, sheet, tooltip, toast
                                        </p>
                                    </div>
                                </div>
                                <p className="text-muted-foreground text-xs">
                                    --shadow-overlay: <span className="tabular-nums">{SHADOW_BY_THEME[theme]}</span>
                                </p>
                            </>
                        );
                    }}
                </ThemeSplit>
            </Section>

            <Section
                id="type"
                title="Type"
                description="Inter only, weights 400/500/600. 700 is not in the vocabulary — emphasis comes from weight, Zone colour and alignment, not size. Figures are tabular."
            >
                <ThemeSplit>
                    {() => {
                        return (
                            <>
                                {TYPE_SCALE.map((step) => {
                                    return (
                                        <div key={step.note} className="flex flex-col gap-0.5">
                                            <span className={step.className}>1 284 leads · $3.42 CPL</span>
                                            <span className="text-muted-foreground text-xs">
                                                {step.note} — {step.role}
                                            </span>
                                        </div>
                                    );
                                })}
                                {WEIGHT_RAMP.map((weight) => {
                                    return (
                                        <p key={weight.name} className={`${weight.className} text-sm`}>
                                            {weight.name} · {weight.note}
                                        </p>
                                    );
                                })}
                            </>
                        );
                    }}
                </ThemeSplit>
            </Section>

            <Section
                id="radius"
                title="Radius"
                description="Three steps and nothing above. xl through 4xl are removed from the theme so those utilities cannot creep back."
            >
                <ThemeSplit className="flex-row flex-wrap gap-4">
                    {() => {
                        return RADIUS_STEPS.map((step) => {
                            return (
                                <div key={step.name} className="flex flex-col items-center gap-1.5">
                                    <span
                                        className={`bg-surface border-border-strong size-12 border ${step.className}`}
                                    />
                                    <span className="text-xs font-medium">{step.name}</span>
                                    <span className="text-muted-foreground text-xs">{step.value}</span>
                                </div>
                            );
                        });
                    }}
                </ThemeSplit>
            </Section>

            <Section
                id="focus"
                title="Focus"
                description="One treatment everywhere: a 2px --accent outline at 1px offset, declared once as a :focus-visible rule in src/styles/index.css rather than per primitive. Held at 2px deliberately — a hairline would fail WCAG 2.2 focus appearance."
            >
                <ThemeSplit>
                    {() => {
                        return (
                            <>
                                <Specimen label="The outline, drawn statically">
                                    <span className="bg-surface border-border rounded-md border px-3 py-1.5 text-sm outline-2 outline-offset-1 outline-[var(--accent)]">
                                        focused
                                    </span>
                                </Specimen>
                                <Specimen label="The outline, live — Tab into these. Nothing declares it locally.">
                                    <button
                                        type="button"
                                        className="bg-surface border-border rounded-md border px-3 py-1.5 text-sm"
                                    >
                                        button
                                    </button>
                                    <a
                                        href="#focus"
                                        className="text-primary rounded-md text-sm underline-offset-4 hover:underline"
                                    >
                                        link
                                    </a>
                                </Specimen>
                            </>
                        );
                    }}
                </ThemeSplit>
            </Section>

            <Section
                id="icons"
                title="Icons"
                description="Lucide at strokeWidth 1.5 — set once by the LucideProvider in __root.tsx, so nothing here passes it. 16px is the default, 12px goes inline with 12px text; nothing larger outside avatars and empty-state art."
            >
                <ThemeSplit>
                    {() => {
                        return ICON_SIZES.map((size) => {
                            return (
                                <Specimen key={size.name} label={`${size.name} — ${size.note}`}>
                                    <SearchIcon className={size.className} />
                                    <SettingsIcon className={size.className} />
                                    <BellIcon className={size.className} />
                                    <ChartLineIcon className={size.className} />
                                </Specimen>
                            );
                        });
                    }}
                </ThemeSplit>
            </Section>

            <Section
                id="actions"
                title="Primitives — actions"
                description="Button, Badge, Toggle, ToggleGroup, Segmented."
            >
                <ThemeSplit>
                    {() => {
                        return <ActionPrimitives />;
                    }}
                </ThemeSplit>
            </Section>

            <Section
                id="forms"
                title="Primitives — forms"
                description="Input, PasswordInput, Label, Field, Select, Combobox."
            >
                <ThemeSplit>
                    {(theme) => {
                        return <FormPrimitives theme={theme} />;
                    }}
                </ThemeSplit>
            </Section>

            <Section
                id="overlays"
                title="Primitives — overlays"
                description="Dialog, Sheet, Popover, DropdownMenu, Tooltip, Toast. Their popups portal out of the pane."
            >
                <ThemeSplit>
                    {() => {
                        return <OverlayPrimitives />;
                    }}
                </ThemeSplit>
            </Section>

            <Section
                id="table"
                title="Primitives — Table"
                description="Hairline row rules and no zebra, figures right and tabular, small grey column heads, a sticky header and one heavier total rule. Two densities."
            >
                <ThemeSplit>
                    {() => {
                        return <TablePrimitive />;
                    }}
                </ThemeSplit>
            </Section>

            <Section
                id="content"
                title="Primitives — content"
                description="Accordion, Avatar, Card, Calendar, Empty, Loader, Separator, Skeleton."
            >
                <ThemeSplit>
                    {() => {
                        return <ContentPrimitives />;
                    }}
                </ThemeSplit>
            </Section>
        </div>
    );
}

export { DesignSystem };
