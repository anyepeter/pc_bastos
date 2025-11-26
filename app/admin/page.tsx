import Link from 'next/link';
import { FileText, Calendar, Mic, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getAllBlogPosts } from '@/app/actions/blog';

export default async function AdminDashboard() {
  const blogPostsResult = await getAllBlogPosts();
  const blogPosts = blogPostsResult.success ? blogPostsResult.data || [] : [];

  const stats = [
    {
      title: 'Total Blog Posts',
      value: blogPosts.length,
      description: `${blogPosts.filter((p: any) => p.published).length} published`,
      icon: FileText,
      href: '/admin/blog',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Upcoming Events',
      value: '0',
      description: 'No events scheduled',
      icon: Calendar,
      href: '/admin/events',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Sermons',
      value: '0',
      description: 'Total sermons',
      icon: Mic,
      href: '/admin/sermons',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Members',
      value: '0',
      description: 'Total members',
      icon: Users,
      href: '/admin/members',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                      {post.title}
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
            <Link href="/admin/events" className="flex flex-col">
              <Calendar className="h-5 w-5 mb-2" />
              Add Event
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20">
            <Link href="/admin/sermons" className="flex flex-col">
              <Mic className="h-5 w-5 mb-2" />
              Upload Sermon
            </Link>
          </Button>
          <Button asChild variant="outline" className="h-20">
            <Link href="/admin/settings" className="flex flex-col">
              <Users className="h-5 w-5 mb-2" />
              Manage Members
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
