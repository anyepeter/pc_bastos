import PageLayout from '@/components/PageLayout';
import MemberDetailClient, { PublicChurchDetail } from './MemberDetailClient';
import MemberNotFound from './MemberNotFound';
import {
  getPublishedChurchBySlug,
  getPublishedChurches,
} from '@/app/actions/churches';

export async function generateStaticParams() {
  const result = await getPublishedChurches();
  if (!result.success || !result.data) return [];

  return result.data.map((church: any) => ({ slug: church.slug }));
}

export default async function MemberDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const result = await getPublishedChurchBySlug(params.slug);

  if (!result.success || !result.data) {
    return (
      <PageLayout>
        <MemberNotFound />
      </PageLayout>
    );
  }

  const row = result.data;
  const member: PublicChurchDetail = {
    id: row.id,
    slug: row.slug,
    denomination: row.denomination,
    leader: row.leader,
    location: row.location,
    history: row.history,
    images: row.images || [],
    founded: row.founded,
    logo: row.logo,
    phone: row.phone,
    email: row.email,
    address: row.address,
    website: row.website,
  };

  return (
    <PageLayout>
      <MemberDetailClient member={member} />
    </PageLayout>
  );
}
