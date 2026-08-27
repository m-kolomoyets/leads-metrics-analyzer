import { createFileRoute } from '@tanstack/react-router';
import { DesignSystem } from '@/modules/DesignSystem';

export const Route = createFileRoute('/design/')({
    component: DesignSystem,
});
