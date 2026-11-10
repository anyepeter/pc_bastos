import PageLayout from '@/components/PageLayout';
import PageNotFound from '@/components/PageNotFound';

/** Any unknown public address, in the language of its prefix. */
export default function NotFound() {
  return (
    <PageLayout>
      <PageNotFound />
    </PageLayout>
  );
}
