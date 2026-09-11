'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Check,
  Copy,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Mail,
  ShieldCheck,
  Trash2,
  UserPlus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import type { DepartmentAccount } from '@/app/actions/departments';

/** What the server hands back: the password only when it generated one. */
interface IssuedResult {
  email: string;
  temporaryPassword: string | null;
}

/** Shown once, then gone — whichever of the two ways it was chosen. */
interface Issued {
  email: string;
  password: string;
  generated: boolean;
}

interface PendingAction {
  kind: 'reset' | 'remove';
  account: DepartmentAccount;
}

interface DepartmentAccountsPanelProps {
  departmentId: string;
  departmentName: string;
  accounts: DepartmentAccount[];
  /** Pre-fills the email box while the department has no login, e.g. its contact email. */
  suggestedEmail?: string;
  /** The site-wide minimum, from lib/auth/password.ts. */
  minPasswordLength: number;
  onCreate: (
    departmentId: string,
    email: string,
    password?: string
  ) => Promise<{ success: boolean; error?: string; data?: IssuedResult }>;
  onResetPassword: (
    departmentId: string,
    accountId: string,
    password?: string
  ) => Promise<{ success: boolean; error?: string; data?: IssuedResult }>;
  onRemove: (
    departmentId: string,
    accountId: string
  ) => Promise<{ success: boolean; error?: string }>;
}

/** A password box with a show/hide toggle. */
function PasswordInput({
  id,
  value,
  onChange,
  disabled,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        id={id}
        type={visible ? 'text' : 'password'}
        autoComplete="new-password"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className="pr-10"
      />
      <button
        type="button"
        onClick={() => setVisible((shown) => !shown)}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:text-gray-700"
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

/**
 * Grants a department its own login. The account can sign in and edit this
 * department's page and its own events and activities — never another
 * department's, never a church's, and never council content.
 *
 * The secretariat either types the password or leaves the box empty to have
 * one generated. Nothing is emailed: this project has no mailer. The password
 * is shown here once, and the secretariat passes it on themselves; the
 * department is asked to choose its own after signing in.
 */
export function DepartmentAccountsPanel({
  departmentId,
  departmentName,
  accounts,
  suggestedEmail = '',
  minPasswordLength,
  onCreate,
  onResetPassword,
  onRemove,
}: DepartmentAccountsPanelProps) {
  const router = useRouter();
  const [email, setEmail] = useState(accounts.length === 0 ? suggestedEmail : '');
  const [password, setPassword] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [issued, setIssued] = useState<Issued | null>(null);
  const [copied, setCopied] = useState(false);
  const [pending, setPending] = useState<PendingAction | null>(null);
  const [resetPassword, setResetPassword] = useState('');

  /** Mirrors the server's rule so a short password is caught before the round trip. */
  const tooShort = (value: string) => value.length > 0 && value.length < minPasswordLength;

  const showIssued = (result: IssuedResult, typed: string) => {
    setIssued({
      email: result.email,
      password: result.temporaryPassword ?? typed,
      generated: Boolean(result.temporaryPassword),
    });
    setCopied(false);
  };

  const create = async () => {
    if (!email.trim()) {
      toast.error('Enter an email address');
      return;
    }
    if (tooShort(password)) {
      toast.error(`Use at least ${minPasswordLength} characters, or leave the password empty`);
      return;
    }

    setIsCreating(true);
    const typed = password;
    const result = await onCreate(departmentId, email, typed || undefined);

    if (result.success && result.data) {
      showIssued(result.data, typed);
      setEmail('');
      setPassword('');
      toast.success('Account created — pass the login details on below');
      router.refresh();
    } else {
      toast.error(result.error || 'Could not create the account');
    }
    setIsCreating(false);
  };

  const confirmPending = async () => {
    if (!pending) return;
    const { kind, account } = pending;

    if (kind === 'reset' && tooShort(resetPassword)) {
      toast.error(`Use at least ${minPasswordLength} characters, or leave the password empty`);
      return;
    }

    setPending(null);
    setBusyId(account.id);

    if (kind === 'reset') {
      const typed = resetPassword;
      setResetPassword('');
      const result = await onResetPassword(departmentId, account.id, typed || undefined);

      if (result.success && result.data) {
        showIssued(result.data, typed);
        toast.success('New password set — pass it on below');
        router.refresh();
      } else {
        toast.error(result.error || 'Could not reset the password');
      }
    } else {
      const result = await onRemove(departmentId, account.id);

      if (result.success) {
        toast.success(`${account.email} can no longer edit ${departmentName}`);
        if (issued?.email === account.email) setIssued(null);
        router.refresh();
      } else {
        toast.error(result.error || 'Could not remove the account');
      }
    }

    setBusyId(null);
  };

  /** Everything the department needs in one paste — ready for a message to them. */
  const copyLoginDetails = async () => {
    if (!issued) return;
    const details = [
      `${departmentName} — CEPCA dashboard login`,
      `Sign in at: ${window.location.origin}/sign-in`,
      `Email: ${issued.email}`,
      `Password: ${issued.password}`,
      'You will be asked to choose your own password after signing in.',
    ].join('\n');

    try {
      await navigator.clipboard.writeText(details);
      setCopied(true);
      toast.success('Login details copied');
    } catch {
      toast.error('Could not copy — select the password and copy it by hand');
    }
  };

  return (
    <Card id="accounts" className="scroll-mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ShieldCheck className="h-4 w-4" />
          Department logins
        </CardTitle>
        <CardDescription>
          People who can sign in at /sign-in to keep this department&apos;s page up to date
          and post its events and activities. They cannot see or change anything else in
          the dashboard.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <div className="space-y-1.5">
            <Label htmlFor="department-login-email">Email</Label>
            <Input
              id="department-login-email"
              type="email"
              placeholder="name@department.org"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isCreating}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="department-login-password">Password</Label>
            <PasswordInput
              id="department-login-password"
              value={password}
              onChange={setPassword}
              disabled={isCreating}
              placeholder="Leave empty to generate one"
            />
          </div>
          <Button type="button" onClick={create} disabled={isCreating} className="shrink-0">
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Create login
              </>
            )}
          </Button>
        </div>
        <p className="-mt-2 text-xs text-gray-500">
          Type a password of at least {minPasswordLength} characters, or leave it empty and
          a strong one is generated. Either way the department is asked to choose its own
          after its first sign-in.
        </p>

        {/* Shown once. It is never stored in plaintext, so it cannot be shown
            again — only replaced. */}
        {issued && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-medium text-amber-900">
              {issued.generated ? 'Temporary password' : 'Password'} for {issued.email}
            </p>
            <p className="mt-1 text-xs text-amber-800">
              This is the only time it is shown. Pass it to the department yourself —
              nothing is emailed.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <code className="min-w-[12rem] flex-1 select-all rounded border border-amber-300 bg-white px-3 py-2 font-mono text-sm text-gray-900">
                {issued.password}
              </code>
              <Button type="button" variant="outline" size="sm" onClick={copyLoginDetails}>
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy login details
                  </>
                )}
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setIssued(null)}>
                Done
              </Button>
            </div>
          </div>
        )}

        {accounts.length === 0 ? (
          <p className="rounded-lg border border-dashed border-gray-300 px-4 py-6 text-center text-sm text-gray-500">
            No login yet. Create one so someone at {departmentName} can keep this page up
            to date.
          </p>
        ) : (
          <ul className="space-y-2">
            {accounts.map((account) => (
              <li
                key={account.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 px-3 py-2"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <Mail className="h-4 w-4 shrink-0 text-gray-400" />
                  <div className="min-w-0">
                    <p className="truncate text-sm text-gray-800">{account.email}</p>
                    <p className="text-xs text-gray-500">
                      Created {new Date(account.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={
                      account.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }
                  >
                    {account.status === 'active' ? 'Active' : 'Issued password'}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setResetPassword('');
                      setPending({ kind: 'reset', account });
                    }}
                    disabled={busyId === account.id}
                    title="Set a new password"
                    aria-label={`Set a new password for ${account.email}`}
                  >
                    {busyId === account.id ? (
                      <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
                    ) : (
                      <KeyRound className="h-4 w-4 text-gray-600" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setPending({ kind: 'remove', account })}
                    disabled={busyId === account.id}
                    title="Remove access"
                    aria-label={`Remove access for ${account.email}`}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      <AlertDialog open={pending !== null} onOpenChange={(open) => !open && setPending(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pending?.kind === 'reset' ? 'Set a new password?' : 'Remove this login?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pending?.kind === 'reset'
                ? `${pending.account.email} will be signed out everywhere and their current password will stop working. You will be shown the new one to pass on.`
                : pending
                  ? `${pending.account.email} will be signed out and will no longer be able to edit ${departmentName}. You can create a new login at any time.`
                  : ''}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {pending?.kind === 'reset' && (
            <div className="space-y-1.5">
              <Label htmlFor="department-reset-password">New password</Label>
              <PasswordInput
                id="department-reset-password"
                value={resetPassword}
                onChange={setResetPassword}
                placeholder="Leave empty to generate one"
              />
              <p className="text-xs text-gray-500">
                At least {minPasswordLength} characters, or empty for a generated one.
              </p>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                // Keep the dialog open if the typed password is refused.
                if (pending?.kind === 'reset' && tooShort(resetPassword)) {
                  event.preventDefault();
                }
                confirmPending();
              }}
              className={
                pending?.kind === 'remove' ? 'bg-red-600 hover:bg-red-700' : undefined
              }
            >
              {pending?.kind === 'reset' ? 'Set password' : 'Remove login'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
