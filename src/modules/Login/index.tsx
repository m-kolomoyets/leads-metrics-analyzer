import { Link } from '@tanstack/react-router';
import { LoginForm } from '@/components/LoginForm';

// The product's own name and its one-line reason for existing, rather than the studio's mark: this
// is the first screen a buyer meets, and "Adjoin" is what they are signing in to. The line says the
// join the app performs — Facebook knows what was spent, Keitaro what was earned, and neither side
// answers the question alone (CONTEXT.md).
const WORDMARK = 'Adjoin';
const TAGLINE = 'Where ad spend meets what it earned';

function Login() {
    return (
        <div className="grid flex-1 lg:grid-cols-2">
            <div className="relative hidden flex-col justify-between bg-black p-10 lg:flex dark:bg-white">
                <Link className="w-fit rounded-md" to="/login">
                    <span className="text-background text-xl font-semibold tracking-tight">{WORDMARK}</span>
                </Link>
                <h3 className="text-background text-lg">{TAGLINE}</h3>
            </div>
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex flex-col items-center justify-center gap-2 lg:hidden">
                    <Link to="/login" className="w-fit rounded-md font-medium">
                        <span className="text-xl font-semibold tracking-tight">{WORDMARK}</span>
                    </Link>
                    <h3 className="text-md text-muted-foreground">{TAGLINE}</h3>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}

export { Login };
