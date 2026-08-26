import type { DeepPartial, TimeChartOptions } from 'lightweight-charts';
import type { ChartPalette } from '../types';
import { ColorType, CrosshairMode, LineStyle } from 'lightweight-charts';

// One options literal for every chart in the app. Both charts spread it and override only what makes
// them themselves — the sparkline hides its scales, the trajectory chart keeps them — so a third chart
// added later inherits the design system instead of re-deriving it (ADR-0020).
//
// It covers the full appearance surface on purpose. A field left out here is not "unset": it is the
// library's own default, and those defaults are colours from somewhere else (#D6DCDE grid, #2B2B43
// scale borders, #758696 crosshair) rendered in a system font stack.
export function chartOptionsFor(palette: ChartPalette): DeepPartial<TimeChartOptions> {
    return {
        autoSize: true,
        layout: {
            // Transparent, not `--surface`: the chart is a picture inside a card and the card is what
            // owns the surface. Painting one here would double it and show at the rounded corners.
            background: { type: ColorType.Solid, color: 'transparent' },
            textColor: palette.muted,
            fontFamily: palette.fontFamily,
            fontSize: palette.fontSize,
            attributionLogo: false,
            panes: {
                separatorColor: palette.border,
                separatorHoverColor: palette.border,
            },
        },
        // Dotted and hairline-quiet: the grid is orientation, not information. The figures are.
        grid: {
            vertLines: { color: palette.border, style: LineStyle.Dotted },
            horzLines: { color: palette.border, style: LineStyle.Dotted },
        },
        crosshair: {
            mode: CrosshairMode.Normal,
            vertLine: {
                color: palette.guide,
                width: 1,
                style: LineStyle.LargeDashed,
                labelBackgroundColor: palette.surface,
            },
            horzLine: {
                color: palette.guide,
                width: 1,
                style: LineStyle.LargeDashed,
                labelBackgroundColor: palette.surface,
            },
        },
        leftPriceScale: { borderColor: palette.border },
        rightPriceScale: { borderColor: palette.border },
        timeScale: { borderColor: palette.border },
    };
}
