import type { PasswordInputProps } from './types';
import { useToggle } from '@react-hookz/web';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Input } from '@/components/ui/Input';

function PasswordInput({ className, disabled, ...props }: PasswordInputProps) {
    const [isVisible, toggleIsVisible] = useToggle();
    const Icon = isVisible ? EyeOffIcon : EyeIcon;

    return (
        <div className="relative">
            <Input
                className={cn('pe-9', className)}
                type={isVisible ? 'text' : 'password'}
                disabled={disabled}
                {...props}
            />
            <button
                className="absolute inset-y-0 inset-e-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground motion-safe:transition-colors motion-safe:duration-150 hover:text-foreground focus-visible:z-10 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                type="button"
                onClick={toggleIsVisible}
                disabled={disabled}
                aria-pressed={isVisible}
                aria-controls="password"
            >
                <Icon size={16} aria-hidden={true} />
                <span className="sr-only">{isVisible ? 'Hide password' : 'Show password'}</span>
            </button>
        </div>
    );
}

export { PasswordInput };
