'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FileText,
  Calendar,
  Megaphone,
  GraduationCap,
  HeartHandshake,
  Church,
  Mic,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AppRole } from '@/lib/auth/roles';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  role: AppRole;
  email: string | null;
}

/** Council secretariat — everything. */
const SUPER_ADMIN_NAV = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Blog Posts', href: '/admin/blog', icon: FileText },
  { name: 'Events', href: '/admin/events', icon: Calendar },
  { name: 'Announcements', href: '/admin/announcements', icon: Megaphone },
  { name: 'Workshops', href: '/admin/workshops', icon: GraduationCap },
  { name: 'Charity', href: '/admin/charity', icon: HeartHandshake },
  { name: 'Sermons', href: '/admin/sermons', icon: Mic },
  { name: 'Member Churches', href: '/admin/churches', icon: Church },
];

/** A member church only ever sees its own page. */
const CHURCH_NAV = [{ name: 'My Church', href: '/admin/my-church', icon: Church }];

export function Sidebar({ isOpen, onClose, role, email }: SidebarProps) {
  const pathname = usePathname();
  const navigation = role === 'super_admin' ? SUPER_ADMIN_NAV : CHURCH_NAV;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 transform bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <Link
              href={role === 'super_admin' ? '/admin' : '/admin/my-church'}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="font-semibold text-gray-900">
                {role === 'super_admin' ? 'Church Admin' : 'My Church'}
              </span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  )}
                >
                  <item.icon
                    className={cn(
                      'mr-3 h-5 w-5',
                      isActive ? 'text-blue-700' : 'text-gray-400'
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Footer — who you are signed in as */}
          <div className="border-t border-gray-200 p-4">
            <p className="text-xs font-medium text-gray-700">
              {role === 'super_admin' ? 'Council secretariat' : 'Church account'}
            </p>
            {email && (
              <p className="mt-0.5 truncate text-xs text-gray-500" title={email}>
                {email}
              </p>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
