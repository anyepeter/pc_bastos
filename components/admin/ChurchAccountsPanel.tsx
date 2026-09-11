'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Check,
  Copy,
  KeyRound,
  Loader2,
  Mail,
  ShieldCheck,
  Trash2,
  UserPlus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import type { ChurchAccount } from '@/app/actions/churches';

interface Issued {
  email: string;
  temporaryPassword: string;
}

/** An account action waiting for confirmation — both are hard to undo. */
interface PendingAction {
  kind: 'reset' | 'remove';
  account: ChurchAccount;
}

interface ChurchAccountsPanelProps {
  churchId: string;
  churchName: string;
  accounts: ChurchAccount[];
  /** Pre-fills the email box while the church has no login, e.g. its contact email. */
  suggestedEmail?: string;
  onCreate: (
    churchId: string,
    email: string
  ) => Promise<{ success: boolean; error?: string; data?: Issued }>;
  onResetPassword: (
    churchId: string,
    accountId: string
  ) => Promise<{ success: boolean; error?: string; data?: Issued }>;
  onRemove: (
    churchId: string,
    accountId: string
  ) => Promise<{ success: boolean; error?: string }>;
}

/**
 * Grants a member church its own login. The account can sign in and edit this
 * church's page only — never another church's, and never council content.
 *
 * Nothing is emailed: this project has no mailer. The temporary password is
 * shown here once, and the secretariat passes it on themselves.
 */
export function ChurchAccountsPanel({
  churchId,
  churchName,
  accounts,
  suggestedEmail = '',
  onCreate,
  onResetPassword,
  onRemove,
}: ChurchAccountsPanelProps) {
  const router = useRouter();
  const [email, setEmail] = useState(accounts.length === 0 ? suggestedEmail : '');
  const [isCreating, setIsCreating] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [issued, setIssued] = useState<Issued | null>(null);
  const [copied, setCopied] = useState(false);
  const [pending, setPending] = useState<PendingAction | null>(null);

  const confirmPending = () => {
    if (!pending) return;
    const { kind, account } = pending;
    setPending(null);
    if (kind === 'reset') resetPassword(account);
    else remove(account);
  };

  const create = async () => {
    if (!email.trim()) {
      toast.error('Enter an email address');
      return;
    }

    setIsCreating(true);
    const result = await onCreate(churchId, email);

    if (result.success && result.data) {
      setIssued(result.data);
      setCopied(false);
      setEmail('');
      toast.success('Account created — copy the password below');
      router.refresh();
    } else {
      toast.error(result.error || 'Could not create the account');
    }
    setIsCreating(false);
  };

  const resetPassword = async (account: ChurchAccount) => {
    setBusyId(account.id);
    const result = await onResetPassword(churchId, account.id);

    if (result.success && result.data) {
      setIssued(result.data);
      setCopied(false);
      toast.success('New password issued — copy it below');
      router.refresh();
    } else {
      toast.error(result.error || 'Could not reset the password');
    }
    setBusyId(null);
  };

  const remove = async (account: ChurchAccount) => {
    setBusyId(account.id);
    const result = await onRemove(churchId, account.id);

    if (result.success) {
      toast.success(`${account.email} can no longer edit ${churchName}`);
      if (issued?.email === account.email) setIssued(null);
      router.refresh();
    } else {
      toast.error(result.error || 'Could not remove the account');
    }
    setBusyId(null);
  };

  /** Everything the church needs in one paste — ready for a message to them. */
  const copyLoginDetails = async () => {
    if (!issued) return;
    const details = [
      `${churchName} — CEPCA dashboard login`,
      `Sign in at: ${window.location.origin}/sign-in`,
      `Email: ${issued.email}`,
      `Temporary password: ${issued.temporaryPassword}`,
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
          Church logins
        </CardTitle>
        <CardDescription>
          People who can sign in at /sign-in and edit this church&apos;s page. They
          cannot see or change anything else in the dashboard.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            type="email"
            placeholder="name@church.org"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                create();
              }
            }}
            disabled={isCreating}
          />
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

        {/* Shown once. It is never stored in plaintext, so it cannot be shown
            again — only replaced. */}
        {issued && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-medium text-amber-900">
              Temporary password for {issued.email}
            </p>
            <p className="mt-1 text-xs text-amber-800">
              This is the only time it is shown. Pass it to the church yourself —
              nothing is emailed. They will be asked to choose their own password
              after signing in.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <code className="min-w-[12rem] flex-1 select-all rounded border border-amber-300 bg-white px-3 py-2 font-mono text-sm text-gray-900">
                {issued.temporaryPassword}
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
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIssued(null)}
              >
                Done
              </Button>
            </div>
          </div>
        )}

        {accounts.length === 0 ? (
          <p className="rounded-lg border border-dashed border-gray-300 px-4 py-6 text-center text-sm text-gray-500">
            No login yet. Create one for someone at {churchName} to let them keep
            this page up to date.
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
                    {account.status === 'active' ? 'Active' : 'Temporary password'}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setPending({ kind: 'reset', account })}
                    disabled={busyId === account.id}
                    title="Issue a new temporary password"
                    aria-label={`Reset the password for ${account.email}`}
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
              {pending?.kind === 'reset'
                ? 'Issue a new temporary password?'
                : 'Remove this login?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pending?.kind === 'reset'
                ? `${pending.account.email} will be signed out everywhere and their current password will stop working. You will be shown the new one to pass on.`
                : pending
                  ? `${pending.account.email} will be signed out and will no longer be able to edit ${churchName}. You can create a new login at any time.`
                  : ''}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmPending}
              className={
                pending?.kind === 'remove' ? 'bg-red-600 hover:bg-red-700' : undefined
              }
            >
              {pending?.kind === 'reset' ? 'Reset password' : 'Remove login'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
