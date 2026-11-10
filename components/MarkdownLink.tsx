'use client';

import type { ComponentPropsWithoutRef } from 'react';
import Link from '@/components/LocalizedLink';
import { isLocalizable } from '@/lib/locale-path';

/**
 * The `a` renderer for ReactMarkdown in public pages. Editors write site links
 * in their English form ("/events/…"); on a French page they lead to the French
 * twin. Other links render as ordinary anchors.
 */
export default function MarkdownLink({ href, children, node: _node, ...props }: ComponentPropsWithoutRef<'a'> & { node?: unknown }) {
  if (href && isLocalizable(href)) {
    return (
      <Link href={href} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} {...props}>
      {children}
    </a>
  );
}
