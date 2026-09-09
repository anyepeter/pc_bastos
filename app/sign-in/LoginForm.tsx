'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import { login } from '@/app/actions/auth';

/**
 * The dashboard login. Everything meaningful happens in the `login` server
 * action — this component only collects the two fields, shows the single
 * generic error the server returns, and moves the browser on success.
 */
export default function LoginForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setError(null);
    setIsSubmitting(true);

    const result = await login(email, password, redirectTo);

    if (result.success) {
      // Clear the password from component state before navigating.
      setPassword('');
      router.replace(result.data?.redirectTo || '/admin');
      router.refresh();
      return;
    }

    setError(result.error || 'Invalid email or password');
    setIsSubmitting(false);
  };

  const fieldClass =
    'w-full rounded-xl border border-ink-200 bg-white py-3 pl-11 pr-4 font-ui text-[15px] text-ink-900 placeholder:text-ink-400 transition-colors duration-200 hover:border-ink-300 focus:border-plum-400 focus:outline-none focus:ring-4 focus:ring-plum-600/10 disabled:cursor-not-allowed disabled:bg-ink-50';

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      {/* Inline error. aria-live so a screen reader announces it without the
          focus having to move into the box. */}
      <div aria-live="polite">
        {error && (
          <p
            role="alert"
            className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-ui text-sm text-red-800"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" aria-hidden />
            <span>{error}</span>
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block font-ui text-[13px] font-semibold tracking-wide text-ink-700"
        >
          Email address
        </label>
        <div className="relative">
          <Mail
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
            aria-hidden
          />
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="username"
            autoFocus
            required
            spellCheck={false}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isSubmitting}
            aria-invalid={error ? true : undefined}
            placeholder="name@cepca.org"
            className={fieldClass}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block font-ui text-[13px] font-semibold tracking-wide text-ink-700"
        >
          Password
        </label>
        <div className="relative">
          <Lock
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
            aria-hidden
          />
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isSubmitting}
            aria-invalid={error ? true : undefined}
            placeholder="••••••••••"
            className={`${fieldClass} pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            disabled={isSubmitting}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
            className="focus-ring absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-ink-400 transition-colors hover:text-ink-700"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden />
            ) : (
              <Eye className="h-4 w-4" aria-hidden />
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="focus-ring flex w-full items-center justify-center gap-2 rounded-xl bg-plum-600 px-6 py-3.5 font-ui text-[15px] font-semibold text-white shadow-[0_14px_30px_-14px_rgba(93,50,166,0.7)] transition-all duration-300 ease-spring hover:bg-plum-700 hover:shadow-[0_18px_36px_-14px_rgba(93,50,166,0.8)] active:translate-y-px disabled:cursor-not-allowed disabled:bg-plum-400 disabled:shadow-none"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Signing in…
          </>
        ) : (
          'Sign in'
        )}
      </button>

      <p className="pt-1 text-center font-ui text-[13px] leading-relaxed text-ink-500">
        Accounts are issued by the council secretariat. Lost your password? Ask
        them to set a new one for you.
      </p>
    </form>
  );
}
