'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Mail, ShieldCheck, Trash2, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import type { ChurchAccount } from '@/app/actions/churches';

interface ChurchAccountsPanelProps {
  churchId: string;
  churchName: string;
  accounts: ChurchAccount[];
  onInvite: (churchId: string, email: string) => Promise<{ success: boolean; error?: string }>;
  onRemove: (
    churchId: string,
    accountId: string,
    status: 'active' | 'invited'
  ) => Promise<{ success: boolean; error?: string }>;
}

/**
 * Grants a member church its own login. The invited person can sign in and edit
 * this church's page only — never another church's, and never council content.
 */
export function ChurchAccountsPanel({
  churchId,
  churchName,
  accounts,
  onInvite,
  onRemove,
}: ChurchAccountsPanelProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const invite = async () => {
    if (!email.trim()) {
      toast.error('Enter an email address');
      return;
    }

    setIsInviting(true);
    const result = await onInvite(churchId, email);

    if (result.success) {
      toast.success(`Invitation sent to ${email.trim()}`);
      setEmail('');
      router.refresh();
    } else {
      toast.error(result.error || 'Could not send the invitation');
    }
    setIsInviting(false);
  };

  const remove = async (account: ChurchAccount) => {
    setRemovingId(account.id);
    const result = await onRemove(churchId, account.id, account.status);

    if (result.success) {
      toast.success(
        account.status === 'invited'
          ? 'Invitation revoked'
          : `${account.email} can no longer edit ${churchName}`
      );
      router.refresh();
    } else {
      toast.error(result.error || 'Could not remove the account');
    }
    setRemovingId(null);
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
                invite();
              }
            }}
            disabled={isInviting}
          />
          <Button type="button" onClick={invite} disabled={isInviting} className="shrink-0">
            {isInviting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Invite
              </>
            )}
          </Button>
        </div>

        {accounts.length === 0 ? (
          <p className="rounded-lg border border-dashed border-gray-300 px-4 py-6 text-center text-sm text-gray-500">
            No account yet. Invite someone from {churchName} to let them keep this page
            up to date.
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
                    {account.status === 'active' ? 'Active' : 'Invited'}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(account)}
                    disabled={removingId === account.id}
                    title={
                      account.status === 'invited'
                        ? 'Revoke invitation'
                        : 'Remove access'
                    }
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
