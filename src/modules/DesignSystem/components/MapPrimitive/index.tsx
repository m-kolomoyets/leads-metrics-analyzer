import type { WorldMapCountry, WorldMapRegion, WorldMapRender } from '@/components/charts/WorldMap/types';
import { useState } from 'react';
import { WorldMap } from '@/components/charts/WorldMap';
import { DOT_GRID_STEP } from '@/components/charts/WorldMap/constants';
import { Segmented, SegmentedItem } from '@/components/ui/Segmented';

// The map with sample data, both themes, so its paint is reviewed against the tokens rather than
// against whatever this month's data happens to be. The shapes/dots toggle is the seat for slice
// 17's experiment: the dot grid is judged here, on the same sample, and never on Home.

const REGION_LABELS: Record<WorldMapRegion, string> = {
    world: 'World',
    europe: 'Europe',
    asia: 'Asia',
    africa: 'Africa',
    'north-america': 'N. America',
    'south-america': 'S. America',
    oceania: 'Oceania',
};

const RENDERS: WorldMapRender[] = ['shapes', 'dots'];

// Lattice steps in degrees for the dot grid, densest first; the primitive's default sits in the
// middle so the review can look either side of it.
const DOT_STEPS = [1, 1.5, 2, 3];

const sample = (code: string, tone: WorldMapCountry['tone'], roi: string): WorldMapCountry => {
    return {
        code,
        tone,
        tooltip: {
            title: code,
            rows: [
                { label: 'Spend⁺', value: '$4,000.00' },
                { label: 'Revenue', value: '$5,200.00' },
                { label: 'ROI', value: roi, tone },
            ],
        },
    };
};

const SAMPLE: WorldMapCountry[] = [
    sample('KR', 'green', '+48%'),
    sample('JP', 'green', '+35%'),
    sample('DE', 'yellow', '+12%'),
    sample('BR', 'yellow', '−5%'),
    sample('US', 'red', '−31%'),
    sample('NG', 'red', '−44%'),
    sample('AU', 'neutral', '+80%'),
    sample('PE', 'neutral', '−92%'),
];

function MapPrimitive() {
    const [render, setRender] = useState<WorldMapRender>('shapes');
    const [dotStep, setDotStep] = useState(DOT_GRID_STEP);

    return (
        <div className="flex flex-col gap-3">
            <Segmented label="Render" mode="toggle">
                {RENDERS.map((option) => {
                    return (
                        <SegmentedItem
                            key={option}
                            selected={option === render}
                            onSelect={() => {
                                setRender(option);
                            }}
                            className="px-2 py-0.5 text-xs"
                        >
                            {option}
                        </SegmentedItem>
                    );
                })}
            </Segmented>
            {render === 'dots' && (
                <Segmented label="Dot step" mode="toggle">
                    {DOT_STEPS.map((step) => {
                        return (
                            <SegmentedItem
                                key={step}
                                selected={step === dotStep}
                                onSelect={() => {
                                    setDotStep(step);
                                }}
                                className="px-2 py-0.5 text-xs"
                            >
                                {step}°
                            </SegmentedItem>
                        );
                    })}
                </Segmented>
            )}
            <WorldMap countries={SAMPLE} regionLabels={REGION_LABELS} render={render} dotStep={dotStep} />
        </div>
    );
}

export { MapPrimitive };
