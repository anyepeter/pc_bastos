'use client';

import { useState } from 'react';
import { Loader2, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { changeOwnPassword } from '@/app/actions/auth';

/**
 * Lets an account replace its own password. The current one is always
 * required, so an unattended open tab cannot lock the owner out.
 */
export default function ChangePasswordForm({ minLength }: { minLength: number }) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSaving) return;

    if (next !== confirm) {
      setError('The two new passwords do not match');
      return;
    }
    if (next.length < minLength) {
      setError(`Use at least ${minLength} characters`);
      return;
    }

    setError(null);
    setIsSaving(true);

    const result = await changeOwnPassword(current, next);

    if (result.success) {
      toast.success('Password changed');
      setCurrent('');
      setNext('');
      setConfirm('');
    } else {
      setError(result.error || 'Could not change the password');
    }

    setIsSaving(false);
  };

  return (
    <form onSubmit={submit} className="max-w-sm space-y-4">
      <div aria-live="polite">
        {error && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
          >
            {error}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="current-password">Current password</Label>
        <Input
          id="current-password"
          type="password"
          autoComplete="current-password"
          required
          value={current}
          onChange={(event) => setCurrent(event.target.value)}
          disabled={isSaving}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="new-password">New password</Label>
        <Input
          id="new-password"
          type="password"
          autoComplete="new-password"
          required
          minLength={minLength}
          value={next}
          onChange={(event) => setNext(event.target.value)}
          disabled={isSaving}
        />
        <p className="text-xs text-gray-500">At least {minLength} characters.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password">Repeat the new password</Label>
        <Input
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          required
          value={confirm}
          onChange={(event) => setConfirm(event.target.value)}
          disabled={isSaving}
        />
      </div>

      <Button type="submit" disabled={isSaving}>
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <KeyRound className="mr-2 h-4 w-4" />
            Change password
          </>
        )}
      </Button>
    </form>
  );
}
