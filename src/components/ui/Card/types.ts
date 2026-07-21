import type { useRender } from '@base-ui/react/use-render';
import type { VariantProps } from 'class-variance-authority';
import type { cardVariants } from './utils/variants';

export type CardProps = useRender.ComponentProps<'div'> & VariantProps<typeof cardVariants>;
