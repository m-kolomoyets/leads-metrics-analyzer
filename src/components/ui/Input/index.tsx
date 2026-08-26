import type { InputProps } from './types';
import { Input as InputPrimitive } from '@base-ui/react/input';
import { cn } from '@/lib/utils/cn';

function Input({ className, type, ...props }: InputProps) {
    return (
        <InputPrimitive
            data-slot="input"
            type={type}
            className={cn(
                'border-input aria-invalid:border-destructive h-8 rounded-md border bg-transparent px-2.5 py-1 text-base motion-safe:transition-colors motion-safe:duration-150 file:h-6 file:text-sm file:font-medium md:text-sm w-full min-w-0 file:inline-flex file:border-0 file:bg-transparent file:text-foreground placeholder:text-faint disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
                className
            )}
            {...props}
        />
    );
}

export { Input };
