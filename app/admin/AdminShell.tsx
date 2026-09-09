'use client';

import { useState } from 'react';
import Link from 'next/link';
import { KeyRound } from 'lucide-react';
import { Sidebar } from '@/components/admin/Sidebar';
import { Header } from '@/components/admin/Header';
import { Toaster } from '@/components/ui/sonner';
import type { AppRole } from '@/lib/auth/roles';

export default function AdminShell({
  role,
  email,
  name = null,
  mustChangePassword = false,
  children,
}: {
  role: AppRole;
  email: string | null;
  name?: string | null;
  /** Set while the account is still on the password the secretariat issued. */
  mustChangePassword?: boolean;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        role={role}
        email={email}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          role={role}
          email={email}
          name={name}
        />

        {mustChangePassword && (
          <div className="flex items-center justify-center gap-2 border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-900">
            <KeyRound className="h-4 w-4 shrink-0" />
            <span>You are still using the password the council issued.</span>
            <Link
              href="/admin/account"
              className="font-semibold underline underline-offset-2 hover:text-amber-950"
            >
              Choose your own
            </Link>
          </div>
        )}

        <main className="flex-1 overflow-y-auto">
          <div className="px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>

      <Toaster position="top-right" />
    </div>
  );
}
