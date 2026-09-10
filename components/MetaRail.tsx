'use client';

import type { LucideIcon } from 'lucide-react';

export interface MetaItem {
  key?: string;
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
}

/**
 * The compact fact rail under a detail page's title: an icon and its value on
 * one line each. The written labels (SINCE, LOCATION, …) were dropped at the
 * client's request — the glyph stands in for them.
 *
 * On a phone the rows stack in a block that is centred as a whole while the
 * rows themselves stay left-aligned. Centring each row instead lets two facts
 * share a line and strands the third, which reads as a mistake. From `sm` up
 * there is room for a single horizontal line, which is what it becomes. The
 * switch waits until `lg` on purpose: at tablet widths two facts fit and the
 * third wraps alone, which is the ragged look this replaced.
 */
export default function MetaRail({
  items,
  className = '',
}: {
  items: MetaItem[];
  className?: string;
}) {
  if (items.length === 0) return null;

  return (
    <div className={`border-t border-ink-200 pt-6 ${className}`}>
      <dl className="mx-auto flex w-fit flex-col items-start gap-2.5 lg:w-auto lg:flex-row lg:flex-wrap lg:items-center lg:justify-center lg:gap-x-7 lg:gap-y-2.5">
        {items.map((item, i) => {
          const Icon = item.icon;

          return (
            <div key={item.key ?? `${item.label}-${i}`} className="inline-flex items-center gap-2">
              <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-leaf-600" />
              {/* The label is kept for assistive tech only: the icon carries it
                  visually, but a bare value with an `aria-hidden` icon beside it
                  would reach a screen reader as an unlabelled string. */}
              <dt className="sr-only">{item.label}</dt>
              <dd className="font-ui text-sm font-medium text-ink-800">{item.value}</dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
