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
import { toast } from 'sonner';
import type { ChurchAccount } from '@/app/actions/churches';

interface Issued {
  email: string;
  temporaryPassword: string;
}

interface ChurchAccountsPanelProps {
  churchId: string;
  churchName: string;
  accounts: ChurchAccount[];
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
  onCreate,
  onResetPassword,
  onRemove,
}: ChurchAccountsPanelProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [issued, setIssued] = useState<Issued | null>(null);
  const [copied, setCopied] = useState(false);

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

  const copyPassword = async () => {
    if (!issued) return;
    try {
      await navigator.clipboard.writeText(issued.temporaryPassword);
      setCopied(true);
      toast.success('Password copied');
    } catch {
      toast.error('Could not copy — select the password and copy it by hand');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ShieldCheck className="h-4 w-4" />
          Church accounts
        </CardTitle>
        <CardDescription>
          People who can sign in and edit this church&apos;s page. They cannot see or
          change anything else in the dashboard.
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
                Create account
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
            <div className="mt-3 flex items-center gap-2">
              <code className="flex-1 select-all rounded border border-amber-300 bg-white px-3 py-2 font-mono text-sm text-gray-900">
                {issued.temporaryPassword}
              </code>
              <Button type="button" variant="outline" size="sm" onClick={copyPassword}>
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
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
            No account yet. Create one for someone at {churchName} to let them keep
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
                  <span className="truncate text-sm text-gray-800">{account.email}</span>
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
                    onClick={() => resetPassword(account)}
                    disabled={busyId === account.id}
                    title="Issue a new temporary password"
                  >
                    <KeyRound className="h-4 w-4 text-gray-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(account)}
                    disabled={busyId === account.id}
                    title="Remove access"
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
