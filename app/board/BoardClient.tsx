'use client';

import { useTranslation } from 'react-i18next';
import PageHero from '@/components/PageHero';
import PageSection from '@/components/PageSection';
import Reveal from '@/components/Reveal';
import type { PublicBoardMember } from '@/lib/board';
import Organogram, { type OrgDepartment } from './Organogram';

/** The board of CEPCA: the page title, then the organogram. */
export default function BoardClient({
  departments,
  members,
}: {
  departments: OrgDepartment[];
  members: PublicBoardMember[];
}) {
  const { t } = useTranslation();

  return (
    <>
      <PageHero title={t('about.board.pageTitle')} lede={t('about.board.lede')} />

      <PageSection tone="tint">
        <Reveal>
          <Organogram members={members} departments={departments} />
        </Reveal>
      </PageSection>
    </>
  );
}
