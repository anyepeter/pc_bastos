'use client';

import Link from 'next/link';
import { KeyRound, LogOut, Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { logout } from '@/app/actions/auth';
import type { AppRole } from '@/lib/auth/roles';

interface HeaderProps {
  onMenuClick: () => void;
  role: AppRole;
  email: string | null;
  name: string | null;
}

/** Initials for the avatar circle, falling back to a person icon. */
function initials(name: string | null, email: string | null): string | null {
  const source = name?.trim() || email?.trim() || '';
  if (!source) return null;

  if (name?.trim()) {
    const parts = name.trim().split(/\s+/).slice(0, 2);
    return parts.map((part) => part[0]?.toUpperCase() ?? '').join('') || null;
  }
  return source[0]?.toUpperCase() ?? null;
}

export function Header({ onMenuClick, role, email, name }: HeaderProps) {
  const badge = initials(name, email);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left side - Menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Open navigation"
        >
          <Menu className="h-6 w-6" />
        </Button>

        <div className="flex-1 lg:ml-0 ml-4">
          <h1 className="text-xl font-semibold text-gray-900 sm:block hidden">
            Admin Dashboard
          </h1>
        </div>

        {/* Right side — who is signed in, and how to leave */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 rounded-full border border-gray-200 py-1 pl-1 pr-3 text-sm transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2"
              aria-label="Account menu"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">
                {badge ?? <User className="h-4 w-4" />}
              </span>
              <span className="hidden max-w-[12rem] truncate text-gray-700 sm:block">
                {name || email || 'Account'}
              </span>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel className="font-normal">
              <p className="text-sm font-medium text-gray-900">
                {role === 'super_admin' ? 'Council secretariat' : 'Church account'}
              </p>
              {email && (
                <p className="mt-0.5 truncate text-xs text-gray-500" title={email}>
                  {email}
                </p>
              )}
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <Link href="/admin/account" className="cursor-pointer">
                <KeyRound className="mr-2 h-4 w-4" />
                Change password
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* A form, not a fetch: the server action clears the session cookie
                and redirects, which needs a real navigation response. */}
            <DropdownMenuItem asChild>
              <form action={logout}>
                <button
                  type="submit"
                  className="flex w-full cursor-pointer items-center text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
