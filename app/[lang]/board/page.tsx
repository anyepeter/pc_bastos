import PageLayout from '@/components/PageLayout';
import BoardClient from './BoardClient';
import type { OrgDepartment } from './Organogram';
import { getPublishedDepartments } from '@/app/actions/departments';
import { getPublishedBoardMembers } from '@/app/actions/board';
import { toPublicBoardMember } from '@/lib/board';
import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { languageOf, pageTrail, staticPageMetadata } from '@/lib/seo';
import { breadcrumbJsonLd, graph, personJsonLd } from '@/lib/structured-data';

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  return staticPageMetadata('board', languageOf(params));
}

/**
 * The organogram: the board members edited at /admin/board, with the
 * departments attached to the General Secretariat hanging below them.
 */
export default async function BoardPage({ params }: { params: { lang: string } }) {
  const language = languageOf(params);
  const [departmentResult, boardResult] = await Promise.all([
    getPublishedDepartments(),
    getPublishedBoardMembers(),
  ]);

  // A failed read comes back as an empty list: the chart then shows only the
  // departments rather than taking the page down.
  const members = (boardResult.success ? boardResult.data || [] : []).map(toPublicBoardMember);

  const departments: OrgDepartment[] = (departmentResult.success ? departmentResult.data || [] : []).map(
    (row: any) => ({
      id: row.id,
      slug: row.slug,
      acronym: row.acronym,
    })
  );

  return (
    <PageLayout>
      {/* The board members as people working for the council. */}
      <JsonLd
        data={graph(
          breadcrumbJsonLd(language, pageTrail(language, 'board')),
          ...members.map((member) => personJsonLd(language, member))
        )}
      />
      <BoardClient departments={departments} members={members} />
    </PageLayout>
  );
}
