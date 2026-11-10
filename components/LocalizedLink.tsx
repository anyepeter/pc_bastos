'use client';

import { forwardRef, type ComponentProps } from 'react';
import NextLink from 'next/link';
import { useAppSelector } from '@/store/hooks';
import { localizePath } from '@/lib/locale-path';

type LinkProps = ComponentProps<typeof NextLink>;

/**
 * next/link that keeps the reader in their language: on a French page,
 * href="/events" points to /fr/events. Write every internal href in its
 * English (unprefixed) form and import Link from here in public pages.
 * Dashboard, file and external addresses pass through untouched.
 */
const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link({ href, ...props }, ref) {
  const language = useAppSelector((state) => state.blog.language);

  const localized =
    typeof href === 'string'
      ? localizePath(href, language)
      : href.pathname
        ? { ...href, pathname: localizePath(href.pathname, language) }
        : href;

  return <NextLink ref={ref} href={localized} {...props} />;
});

export default Link;
