'use client';

import { createContext, useContext } from 'react';
import { DEFAULT_SITE_SETTINGS, type SiteSettingsValues } from '@/lib/site-settings';

const SiteSettingsContext = createContext<SiteSettingsValues>(DEFAULT_SITE_SETTINGS);

/**
 * Hands the council's details — read once on the server in app/layout.tsx —
 * to the client components that show them (header, footer, contact, give).
 */
export default function SiteSettingsProvider({
  value,
  children,
}: {
  value: SiteSettingsValues;
  children: React.ReactNode;
}) {
  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
}

export const useSiteSettings = () => useContext(SiteSettingsContext);
