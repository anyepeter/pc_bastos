import PageLayout from '@/components/PageLayout';
import PageNotFound from '@/components/PageNotFound';

/** An unknown or unpublished post: the site's 404, in the page's language. */
export default function NotFound() {
  return (
    <PageLayout>
      <PageNotFound />
    </PageLayout>
  );
}
