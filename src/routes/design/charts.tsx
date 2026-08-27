import { createFileRoute } from '@tanstack/react-router';
import { ChartsLab } from '@/modules/ChartsLab';

export const Route = createFileRoute('/design/charts')({
    component: ChartsLab,
});
