'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ImageUpload } from './ImageUpload';
import { MarkdownPreview } from './MarkdownPreview';
import { TranslationSourcePanel } from './TranslationSourcePanel';
import { createBlogPost, updateBlogPost } from '@/app/actions/blog';
import { translateBlogContent } from '@/app/actions/translate';
import { generateSlug } from '@/lib/blog-utils';
import { toast } from 'sonner';
import { AlertCircle, Check, Languages, Loader2, Save } from 'lucide-react';
import {
  Language,
  LANGUAGE_LABELS,
  Translation,
  readTranslation,
} from '@/lib/translations';

interface BlogPost {
  id?: string;
  title: unknown;
  slug: string;
  description: unknown;
  imageUrl: string | null;
  published: boolean;
}

interface BlogPostFormProps {
  post?: BlogPost;
  isEditing?: boolean;
}

type FieldName = 'title' | 'description';

const FIELD_LABELS: Record<FieldName, string> = {
  title: 'title',
  description: 'content',
};

export function BlogPostForm({ post, isEditing = false }: BlogPostFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [overwritePromptOpen, setOverwritePromptOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [title, setTitle] = useState<Translation>(readTranslation(post?.title));
  const [description, setDescription] = useState<Translation>(
    readTranslation(post?.description)
  );
  const [formData, setFormData] = useState({
    id: post?.id,
    slug: post?.slug || '',
    imageUrl: post?.imageUrl || null,
    published: post?.published || false,
  });
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(isEditing);

  const sourceLang: Language = currentLang === 'en' ? 'fr' : 'en';

  // Per-language completion, used for the tab badges, the status card and to
  // decide whether publishing is allowed.
  const status = useMemo(() => {
    const forLang = (lang: Language) => ({
      title: title[lang].trim().length > 0,
      description: description[lang].trim().length > 0,
    });

    const en = forLang('en');
    const fr = forLang('fr');

    return {
      en: { ...en, complete: en.title && en.description },
      fr: { ...fr, complete: fr.title && fr.description },
    };
  }, [title, description]);

  const canPublish = status.en.complete && status.fr.complete;
  const sourceHasContent =
    title[sourceLang].trim().length > 0 || description[sourceLang].trim().length > 0;
  const targetHasContent =
    title[currentLang].trim().length > 0 || description[currentLang].trim().length > 0;

  // Auto-generate slug from English title
  useEffect(() => {
    if (!slugManuallyEdited && title.en) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(title.en),
      }));
    }
  }, [title.en, slugManuallyEdited]);

  /**
   * Fill the language currently being edited from the other one.
   * The result is a draft — the editor is expected to review it.
   */
  const runTranslation = async () => {
    setOverwritePromptOpen(false);
    setIsTranslating(true);

    try {
      const result = await translateBlogContent({
        title: title[sourceLang],
        description: description[sourceLang],
        from: sourceLang,
        to: currentLang,
      });

      if (!result.success || !result.data) {
        toast.error(result.error || 'Automatic translation failed');
        return;
      }

      setTitle((prev) => ({ ...prev, [currentLang]: result.data!.title }));
      setDescription((prev) => ({ ...prev, [currentLang]: result.data!.description }));
      setSlugManuallyEdited(true); // never let a translated title rewrite the slug

      toast.success(
        `Translated into ${LANGUAGE_LABELS[currentLang]} — please review before publishing`
      );
    } finally {
      setIsTranslating(false);
    }
  };

  const handleTranslateClick = () => {
    if (targetHasContent) {
      setOverwritePromptOpen(true);
      return;
    }
    runTranslation();
  };

  const copyFromSource = (field: FieldName) => {
    if (field === 'title') {
      setTitle((prev) => ({ ...prev, [currentLang]: prev[sourceLang] }));
    } else {
      setDescription((prev) => ({ ...prev, [currentLang]: prev[sourceLang] }));
    }
    setSlugManuallyEdited(true);
  };

  /**
   * Find the first missing field. English is always required (it is the
   * fallback language site-wide); French is only required to publish.
   */
  const findMissingField = (
    publishing: boolean
  ): { lang: Language; field: FieldName } | null => {
    if (!status.en.title) return { lang: 'en', field: 'title' };
    if (!status.en.description) return { lang: 'en', field: 'description' };

    if (publishing) {
      if (!status.fr.title) return { lang: 'fr', field: 'title' };
      if (!status.fr.description) return { lang: 'fr', field: 'description' };
    }

    return null;
  };

  const handleSubmit = async (publish: boolean) => {
    const missing = findMissingField(publish);

    if (missing) {
      setCurrentLang(missing.lang);
      toast.error(
        `Add the ${LANGUAGE_LABELS[missing.lang]} ${FIELD_LABELS[missing.field]}${
          publish ? ' before publishing' : ''
        }`
      );
      return;
    }

    if (!formData.slug.trim()) {
      toast.error('The URL slug is required');
      return;
    }

    setIsSaving(true);

    const dataToSubmit = {
      title,
      slug: formData.slug,
      description,
      imageUrl: formData.imageUrl,
      published: publish,
    };

    try {
      const result =
        isEditing && post?.id
          ? await updateBlogPost(post.id, dataToSubmit)
          : await createBlogPost(dataToSubmit);

      if (result.success) {
        toast.success(
          isEditing ? 'Blog post updated successfully' : 'Blog post created successfully'
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

  const renderTabLabel = (lang: Language) => (
    <span className="flex items-center justify-center gap-2">
      {LANGUAGE_LABELS[lang]}
      {status[lang].complete ? (
        <Check className="h-3.5 w-3.5 text-green-600" />
      ) : (
        <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
      )}
    </span>
  );

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Language switcher */}
          <Card>
            <CardHeader>
              <CardTitle>Language</CardTitle>
              <CardDescription>
                This post is stored in both languages. Write one, then switch tabs to
                add the other — a post can only be published once both are complete.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={currentLang}
                onValueChange={(val) => setCurrentLang(val as Language)}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="en">{renderTabLabel('en')}</TabsTrigger>
                  <TabsTrigger value="fr">{renderTabLabel('fr')}</TabsTrigger>
                </TabsList>
              </Tabs>

              {!status[currentLang].complete && sourceHasContent && (
                <p className="mt-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
                  The {LANGUAGE_LABELS[currentLang]} version is incomplete. Use the{' '}
                  {LANGUAGE_LABELS[sourceLang]} text below as your source.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Translation source / helper */}
          {sourceHasContent && (
            <TranslationSourcePanel
              sourceLang={sourceLang}
              targetLang={currentLang}
              sourceTitle={title[sourceLang]}
              sourceDescription={description[sourceLang]}
              isTranslating={isTranslating}
              onTranslate={handleTranslateClick}
              onCopyTitle={() => copyFromSource('title')}
              onCopyDescription={() => copyFromSource('description')}
            />
          )}

          {/* Title */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Title ({LANGUAGE_LABELS[currentLang]})
                {!status[currentLang].title && (
                  <span className="text-xs font-normal text-amber-600">Required</span>
                )}
              </CardTitle>
              <CardDescription>
                Enter a clear, descriptive title for your blog post
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input
                type="text"
                placeholder={
                  currentLang === 'en'
                    ? 'Enter blog post title...'
                    : 'Entrez le titre du blog...'
                }
                value={title[currentLang]}
                onChange={(e) => setTitle({ ...title, [currentLang]: e.target.value })}
                className="text-lg"
              />
            </CardContent>
          </Card>

          {/* Slug */}
          <Card>
            <CardHeader>
              <CardTitle>URL Slug</CardTitle>
              <CardDescription>
                Shared by both languages, generated from the English title
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">/blogs/</span>
                <Input
                  type="text"
                  placeholder="url-slug"
                  value={formData.slug}
                  onChange={(e) => {
                    setFormData({ ...formData, slug: e.target.value });
                    setSlugManuallyEdited(true);
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Content ({LANGUAGE_LABELS[currentLang]})
                {!status[currentLang].description && (
                  <span className="text-xs font-normal text-amber-600">Required</span>
                )}
              </CardTitle>
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
                    placeholder={
                      currentLang === 'en'
                        ? 'Write your blog post content here... (Markdown supported)'
                        : 'Écrivez le contenu de votre blog ici... (Markdown supporté)'
                    }
                    value={description[currentLang]}
                    onChange={(e) =>
                      setDescription({ ...description, [currentLang]: e.target.value })
                    }
                    className="min-h-[400px] font-mono text-sm"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Supports Markdown: **bold**, *italic*, [links](url), headings,
                    lists, etc.
                  </p>
                </TabsContent>
                <TabsContent value="preview" className="mt-4">
                  <MarkdownPreview content={description[currentLang]} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Translation status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="h-4 w-4" />
                Translations
              </CardTitle>
              <CardDescription>Both languages are required to publish</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {(['en', 'fr'] as Language[]).map((lang) => {
                const langStatus = status[lang];
                const missing = [
                  !langStatus.title && 'title',
                  !langStatus.description && 'content',
                ].filter(Boolean);

                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setCurrentLang(lang)}
                    className={`w-full flex items-center justify-between rounded-md border px-3 py-2 text-left transition-colors ${
                      langStatus.complete
                        ? 'border-green-200 bg-green-50 hover:bg-green-100'
                        : 'border-amber-200 bg-amber-50 hover:bg-amber-100'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {LANGUAGE_LABELS[lang]}
                      </p>
                      <p className="text-xs text-gray-600">
                        {langStatus.complete
                          ? 'Title and content ready'
                          : `Missing ${missing.join(' and ')}`}
                      </p>
                    </div>
                    {langStatus.complete ? (
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </CardContent>
          </Card>

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
              <CardDescription>Control the visibility of your post</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2">
                <span className="text-sm text-gray-600">Current status</span>
                <span
                  className={`text-sm font-medium ${
                    formData.published ? 'text-green-700' : 'text-gray-700'
                  }`}
                >
                  {formData.published ? 'Published' : 'Draft'}
                </span>
              </div>

              <div className="pt-4 border-t space-y-2">
                <Button
                  type="button"
                  disabled={isSaving || isTranslating || !canPublish}
                  className="w-full"
                  onClick={() => handleSubmit(true)}
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

                {!canPublish && (
                  <p className="text-xs text-amber-700">
                    Add the{' '}
                    {!status.en.complete
                      ? LANGUAGE_LABELS.en
                      : LANGUAGE_LABELS.fr}{' '}
                    version to enable publishing. You can save a draft in the meantime.
                  </p>
                )}

                <Button
                  type="button"
                  variant="outline"
                  disabled={isSaving || isTranslating}
                  className="w-full"
                  onClick={() => handleSubmit(false)}
                >
                  Save as Draft
                </Button>

                {isEditing && post?.published && (
                  <p className="text-xs text-gray-500">
                    Saving as a draft takes this post off the public site until you
                    publish it again.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={overwritePromptOpen} onOpenChange={setOverwritePromptOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Replace the {LANGUAGE_LABELS[currentLang]} version?
            </AlertDialogTitle>
            <AlertDialogDescription>
              There is already {LANGUAGE_LABELS[currentLang]} text in this post.
              Translating from {LANGUAGE_LABELS[sourceLang]} will overwrite the title
              and content you have written.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={runTranslation}>
              Overwrite and translate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}
