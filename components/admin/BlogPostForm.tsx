'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageUpload } from './ImageUpload';
import { MarkdownPreview } from './MarkdownPreview';
import { createBlogPost, updateBlogPost } from '@/app/actions/blog';
import { generateSlug } from '@/lib/blog-utils';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';


interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string | null;
  published: boolean;
}

interface BlogPostFormProps {
  post?: BlogPost;
  isEditing?: boolean;
}

export function BlogPostForm({ post, isEditing = false }: BlogPostFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<BlogPost>({
    id: post?.id,
    title: post?.title || '',
    slug: post?.slug || '',
    description: post?.description || '',
    imageUrl: post?.imageUrl || null,
    published: post?.published || false,
  });
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(isEditing);

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugManuallyEdited && formData.title) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(formData.title),
      }));
    }
  }, [formData.title, slugManuallyEdited]);

  const handleSubmit = async (e: React.FormEvent, publish?: boolean) => {
    e.preventDefault();
    setIsSaving(true);

    // Validate form
    if (!formData.title || !formData.slug || !formData.description) {
      toast.error('Please fill in all required fields');
      setIsSaving(false);
      return;
    }

    // Language detection moved to server action
    console.log('Submitting blog post...');


    const dataToSubmit = {
      ...formData,
      published: publish !== undefined ? publish : formData.published,
    };

    try {
      let result;
      if (isEditing && post?.id) {
        result = await updateBlogPost(post.id, dataToSubmit);
      } else {
        result = await createBlogPost(dataToSubmit);
      }

      if (result.success) {
        toast.success(
          isEditing
            ? 'Blog post updated successfully'
            : 'Blog post created successfully'
        );
        router.push('/admin/blog');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to save blog post');
      }
    } catch (error) {
      toast.error('An error occurred while saving the blog post');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <Card>
            <CardHeader>
              <CardTitle>Title</CardTitle>
              <CardDescription>
                Enter a clear, descriptive title for your blog post
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                type="text"
                placeholder="Enter blog post title..."
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                className="text-lg"
              />
            </CardContent>
          </Card>

          {/* Slug */}
          <Card>
            <CardHeader>
              <CardTitle>URL Slug</CardTitle>
              <CardDescription>
                URL-friendly version of the title (auto-generated)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">/blog/</span>
                <Input
                  type="text"
                  placeholder="url-slug"
                  value={formData.slug}
                  onChange={(e) => {
                    setFormData({ ...formData, slug: e.target.value });
                    setSlugManuallyEdited(true);
                  }}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
              <CardDescription>
                Write your blog post content in Markdown format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="edit" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="edit">Edit</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="edit" className="mt-4">
                  <Textarea
                    placeholder="Write your blog post content here... (Markdown supported)"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                    className="min-h-[400px] font-mono text-sm"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Supports Markdown: **bold**, *italic*, [links](url),
                    headings, lists, etc.
                  </p>
                </TabsContent>
                <TabsContent value="preview" className="mt-4">
                  <MarkdownPreview content={formData.description} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">


          {/* Featured image */}
          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
              <CardDescription>
                Upload a main image for your blog post
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={formData.imageUrl || undefined}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                onRemove={() => setFormData({ ...formData, imageUrl: null })}
                disabled={isSaving}
              />
            </CardContent>
          </Card>
          {/* Publish settings */}
          <Card>
            <CardHeader>
              <CardTitle>Publish</CardTitle>
              <CardDescription>
                Control the visibility of your post
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="published" className="flex-1">
                  <div>
                    <p className="font-medium">Published</p>
                    <p className="text-sm text-gray-500">
                      Make this post visible to everyone
                    </p>
                  </div>
                </Label>
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, published: checked })
                  }
                />
              </div>
              <div className="pt-4 border-t space-y-2">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="w-full"
                  onClick={(e) => handleSubmit(e, true)}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {isEditing ? 'Update & Publish' : 'Publish'}
                    </>
                  )}
                </Button>
                <Button
                  type="submit"
                  variant="outline"
                  disabled={isSaving}
                  className="w-full"
                  onClick={(e) => handleSubmit(e, false)}
                >
                  {isEditing ? 'Save Changes' : 'Save as Draft'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
