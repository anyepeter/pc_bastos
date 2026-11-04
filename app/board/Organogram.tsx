'use client';

import Image from 'next/image';
import Link from 'next/link';
import { UserRound } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import { getTranslatedText, readTranslation } from '@/lib/translations';
import { DEPARTMENTS } from '@/lib/departments';
import { BOARD_OFFICES, boardAvatar, type PublicBoardMember } from '@/lib/board';

export interface OrgDepartment {
  id: string;
  slug: string;
  acronym: string;
}

interface NodeProps {
  role: string;
  name: string;
  detail: string;
  photo: string | null;
  href: string | null;
}

/**
 * One box in the chart. It is opaque and sits above the spine, so the spine
 * only shows in the gaps between boxes and reads as the connecting line.
 */
function OrgNode({ role, name, detail, photo, href }: NodeProps) {
  const body = (
    <>
      {photo ? (
        <Image
          src={boardAvatar(photo)}
          alt=""
          aria-hidden="true"
          width={128}
          height={128}
          className="mx-auto h-16 w-16 rounded-full border border-ink-200 object-cover object-top"
        />
      ) : (
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-ink-200 bg-ink-50">
          <UserRound aria-hidden="true" className="h-6 w-6 text-leaf-600" />
        </span>
      )}
      {role && (
        <span className="mt-4 block font-ui text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-plum-700">
          {role}
        </span>
      )}
      {name && (
        <span className="mt-1.5 block font-display text-[1.05rem] font-semibold leading-snug tracking-tight text-ink-900 transition-colors duration-300 group-hover:text-plum-700">
          {name}
        </span>
      )}
      {detail && <span className="mt-1.5 block text-[0.82rem] leading-snug text-ink-600 text-pretty">{detail}</span>}
    </>
  );

  // `h-full` + centred column: side by side, boxes in a row share a height,
  // and a short box keeps its content in the middle rather than at the top.
  const box =
    'relative z-10 mx-auto flex h-full w-full max-w-[16.5rem] flex-col items-center justify-center rounded-2xl border border-ink-200 bg-white px-5 pb-5 pt-6 text-center shadow-[0_14px_34px_-22px_rgba(45,27,90,0.35)]';

  if (!href) return <div className={box}>{body}</div>;

  // Another site opens in a new tab; a page of this site does not.
  const external = /^https?:\/\//i.test(href);
  return (
    <Link
      href={href}
      className={`${box} card-hover focus-ring group`}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {body}
    </Link>
  );
}

/** Columns and the branch line for a row of `count` boxes (sm and up). */
const ROW_LAYOUT: Record<number, { grid: string; branch: string | null }> = {
  1: { grid: '', branch: null },
  2: { grid: 'sm:mx-auto sm:max-w-[38rem] sm:grid-cols-2 sm:gap-16', branch: 'left-1/4 right-1/4' },
  3: { grid: 'sm:grid-cols-3 sm:gap-8', branch: 'left-[16.67%] right-[16.67%]' },
};
const WIDE_ROW = { grid: 'sm:grid-cols-2 sm:gap-8 lg:grid-cols-4', branch: null };

/**
 * The board as a chart, drawn from the board members published in /admin/board:
 * the President, the Vice-Presidents, any other officers, the General
 * Secretary, and the departments and services attached to the Secretariat.
 * Rows with nobody in them are left out. On a phone the chart runs as one
 * column down the same spine.
 */
export default function Organogram({
  members,
  departments,
}: {
  members: PublicBoardMember[];
  departments: OrgDepartment[];
}) {
  const { t } = useTranslation();
  const language = useAppSelector((state) => state.blog.language);
  const read = (value: unknown) => getTranslatedText(readTranslation(value), language).trim();

  const rows = BOARD_OFFICES.map(({ value }) => members.filter((member) => member.office === value)).filter(
    (row) => row.length > 0
  );

  // The founding eight keep their short names; a later department shows its
  // acronym. Without published rows the chart still shows the original list.
  const units =
    departments.length > 0
      ? departments.map((department) => {
          const known = DEPARTMENTS.find((entry) => entry.acronym === department.acronym.toUpperCase());
          return {
            key: department.id,
            href: `/departments/${department.slug}`,
            acronym: department.acronym,
            short: known ? t(`about.departments.${known.id}.short`) : department.acronym,
          };
        })
      : DEPARTMENTS.map(({ id, acronym }) => ({
          key: id,
          href: `/departments#${id}`,
          acronym,
          short: t(`about.departments.${id}.short`),
        }));

  return (
    <div className="relative mx-auto max-w-4xl">
      {/* The spine, from the first box down into the departments panel. */}
      <span aria-hidden="true" className="absolute bottom-10 left-1/2 top-10 w-px -translate-x-1/2 bg-ink-300" />

      {rows.map((row, i) => {
        const layout = ROW_LAYOUT[row.length] ?? WIDE_ROW;
        return (
          <div key={row[0].office} className={`relative grid gap-10 ${i > 0 ? 'mt-10' : ''} ${layout.grid}`}>
            {layout.branch && (
              <span
                aria-hidden="true"
                className={`absolute top-1/2 hidden h-px bg-ink-300 sm:block ${layout.branch}`}
              />
            )}
            {row.map((member) => (
              <OrgNode
                key={member.id}
                role={read(member.title)}
                name={member.name}
                detail={read(member.detail)}
                photo={member.photo}
                href={member.link}
              />
            ))}
          </div>
        );
      })}

      <div
        className={`relative z-10 rounded-2xl border border-ink-200 bg-white p-5 shadow-[0_14px_34px_-22px_rgba(45,27,90,0.35)] sm:p-6 ${
          rows.length > 0 ? 'mt-10' : ''
        }`}
      >
        <h3 className="text-center font-display text-lg font-semibold tracking-tight text-ink-900">
          {t('about.generalSecretariat.attachedTitle')}
        </h3>
        <ul className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {units.map((unit) => (
            <li key={unit.key}>
              <Link
                href={unit.href}
                className="focus-ring flex h-full min-h-[44px] items-center gap-2.5 rounded-xl border border-ink-200 bg-ink-50 px-3 py-2.5 text-sm leading-snug text-ink-700 transition-colors duration-300 hover:border-leaf-300 hover:text-plum-700"
              >
                <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-plum-700">
                  {unit.acronym}
                </span>
                <span className="min-w-0">{unit.short}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
