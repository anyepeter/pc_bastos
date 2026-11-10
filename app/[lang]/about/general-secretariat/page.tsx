import PageLayout from '@/components/PageLayout';
import GeneralSecretariatClient from './GeneralSecretariatClient';
import { getPublishedDepartments } from '@/app/actions/departments';
import { toPublicDepartmentSummary } from '@/lib/departments';
import { getPublishedBoardMembers } from '@/app/actions/board';
import { toPublicBoardMember } from '@/lib/board';
import type { Metadata } from 'next';
import JsonLd from '@/components/JsonLd';
import { languageOf, pageTrail, staticPageMetadata } from '@/lib/seo';
import { breadcrumbJsonLd, graph, personJsonLd } from '@/lib/structured-data';

export function generateMetadata({ params }: { params: { lang: string } }): Metadata {
  return staticPageMetadata('generalSecretariat', languageOf(params));
}

export default async function GeneralSecretariatPage({ params }: { params: { lang: string } }) {
  const language = languageOf(params);
  // A failed read comes back as an empty list, which the client answers with
  // the council's original list from the locale files.
  const [result, boardResult] = await Promise.all([
    getPublishedDepartments(),
    getPublishedBoardMembers(),
  ]);
  const rows = result.success ? result.data || [] : [];

  // The General Secretary as published in /admin/board. Without one the page
  // simply leaves the profile out.
  const secretaryRow = (boardResult.success ? boardResult.data || [] : []).find(
    (row: any) => row.office === 'general_secretary'
  );

  return (
    <PageLayout>
      <JsonLd
        data={graph(
          breadcrumbJsonLd(language, pageTrail(language, 'about', 'generalSecretariat')),
          secretaryRow && personJsonLd(language, toPublicBoardMember(secretaryRow))
        )}
      />
      <GeneralSecretariatClient
        departments={rows.map(toPublicDepartmentSummary)}
        secretary={secretaryRow ? toPublicBoardMember(secretaryRow) : null}
      />
    </PageLayout>
  );
}
