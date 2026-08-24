import Link from 'next/link';
import {
  FileText,
  Calendar,
  Megaphone,
  GraduationCap,
  HeartHandshake,
  Mic,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getAllBlogPosts } from '@/app/actions/blog';
import { getAllEvents } from '@/app/actions/events';
import { getAllAnnouncements } from '@/app/actions/announcements';
import { getAllWorkshops } from '@/app/actions/workshops';
import { getAllCharityPrograms } from '@/app/actions/charity';
import { getAllSermons } from '@/app/actions/sermons';
import { readTranslation } from '@/lib/translations';
import { requireSuperAdminPage } from '@/lib/auth/roles';

const rowsOf = (result: { success: boolean; data?: any[] }) =>
  result.success ? result.data || [] : [];

/** "3 published" / "2 drafts, 1 published" — the counts an editor cares about. */
const describe = (rows: any[]) => {
  const published = rows.filter((row) => row.published).length;
  const drafts = rows.length - published;

  if (rows.length === 0) return 'Nothing added yet';
  if (drafts === 0) return `${published} published`;
  if (published === 0) return `${drafts} draft${drafts === 1 ? '' : 's'}`;
  return `${published} published, ${drafts} draft${drafts === 1 ? '' : 's'}`;
};

export default async function AdminDashboard() {
  await requireSuperAdminPage();

  const [
    blogPostsResult,
    eventsResult,
    announcementsResult,
    workshopsResult,
    charityResult,
    sermonsResult,
  ] = await Promise.all([
    getAllBlogPosts(),
    getAllEvents(),
    getAllAnnouncements(),
    getAllWorkshops(),
    getAllCharityPrograms(),
    getAllSermons(),
  ]);

  const blogPosts = rowsOf(blogPostsResult);
  const events = rowsOf(eventsResult);
  const announcements = rowsOf(announcementsResult);
  const workshops = rowsOf(workshopsResult);
  const charityPrograms = rowsOf(charityResult);
  const sermons = rowsOf(sermonsResult);

  const stats = [
    {
      title: 'Blog Posts',
      value: blogPosts.length,
      description: describe(blogPosts),
      icon: FileText,
      href: '/admin/blog',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Events',
      value: events.length,
      description: describe(events),
      icon: Calendar,
      href: '/admin/events',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Announcements',
      value: announcements.length,
      description: describe(announcements),
      icon: Megaphone,
      href: '/admin/announcements',
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
    {
      title: 'Workshops',
      value: workshops.length,
      description: describe(workshops),
      icon: GraduationCap,
      href: '/admin/workshops',
      color: 'text-teal-600',
      bgColor: 'bg-teal-100',
    },
    {
      title: 'Charity Programs',
      value: charityPrograms.length,
      description: describe(charityPrograms),
      icon: HeartHandshake,
      href: '/admin/charity',
      color: 'text-rose-600',
      bgColor: 'bg-rose-100',
    },
    {
      title: 'Sermons',
      value: sermons.length,
      description: describe(sermons),
      icon: Mic,
      href: '/admin/sermons',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  const recentBlogPosts = blogPosts.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome to your church admin dashboard
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-600 mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent blog posts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Blog Posts</CardTitle>
              <CardDescription>Latest blog posts from your site</CardDescription>
            </div>
            <Button asChild>
              <Link href="/admin/blog">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentBlogPosts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No blog posts
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new blog post.
              </p>
              <div className="mt-6">
                <Button asChild>
                  <Link href="/admin/blog/create">Create Blog Post</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {recentBlogPosts.map((post: any) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">
                      {readTranslation(post.title).en}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        post.published
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/admin/blog/${post.id}/edit`}>Edit</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and actions</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Button asChild variant="outline" className="h-20">
            <Link href="/admin/blog/create" className="flex flex-col">
              <FileText className="h-5 w-5 mb-2" />
              New Blog Post
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20">
            <Link href="/admin/events/create" className="flex flex-col">
              <Calendar className="h-5 w-5 mb-2" />
              Add Event
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20">
            <Link href="/admin/announcements/create" className="flex flex-col">
              <Megaphone className="h-5 w-5 mb-2" />
              New Announcement
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20">
            <Link href="/admin/sermons/create" className="flex flex-col">
              <Mic className="h-5 w-5 mb-2" />
              Add Sermon
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
