'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { MultiImageUpload } from './MultiImageUpload';
import { MarkdownPreview } from './MarkdownPreview';
import { translateFields } from '@/app/actions/translate';
import { toast } from 'sonner';
import { AlertCircle, Check, Copy, Languages, Loader2, Save } from 'lucide-react';
import { Language, LANGUAGE_LABELS } from '@/lib/translations';
import {
  FormValues,
  ResourceConfig,
  ResourceField,
  TranslatableField,
  asString,
  asStringArray,
  asTranslation,
  isLanguageComplete,
  isTranslatable,
  translatableFields,
} from '@/lib/admin/resource-config';
import {
  describeMissingField,
  emptyValues,
  findMissingField,
} from '@/lib/admin/resource-service';

export interface ResourceActionResult {
  success: boolean;
  error?: string;
}

interface ResourceFormProps {
  config: ResourceConfig;
  /** Existing record's editor values; omit when creating. */
  initialValues?: FormValues;
  recordId?: string;
  isPublished?: boolean;
  /**
   * 'publish' (default) shows Publish + Save as Draft.
   * 'save' shows a single Save button and leaves the published state alone —
   * used by church accounts, which may edit their page but not take it live.
   */
  mode?: 'publish' | 'save';
  /** Server actions, passed straight through from the admin page. */
  onCreate: (values: FormValues, publish: boolean) => Promise<ResourceActionResult>;
  onUpdate: (
    id: string,
    values: FormValues,
    publish: boolean
  ) => Promise<ResourceActionResult>;
}

/**
 * The bilingual editor shared by every content type.
 *
 * Same workflow as the blog: write one language, switch tabs, translate or type
 * the other, publish once both are complete.
 */
export function ResourceForm({
  config,
  initialValues,
  recordId,
  isPublished = false,
  mode = 'publish',
  onCreate,
  onUpdate,
}: ResourceFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<FormValues>(
    initialValues ?? emptyValues(config)
  );
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [isSaving, setIsSaving] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [overwritePromptOpen, setOverwritePromptOpen] = useState(false);

  const isEditing = Boolean(recordId);
  const sourceLang: Language = currentLang === 'en' ? 'fr' : 'en';
  const bilingualFields = useMemo(() => translatableFields(config), [config]);

  const status = useMemo(
    () => ({
      en: isLanguageComplete(config, values, 'en'),
      fr: isLanguageComplete(config, values, 'fr'),
    }),
    [config, values]
  );

  const canPublish = status.en && status.fr;

  const languageHasText = (language: Language) =>
    bilingualFields.some(
      (field) => asTranslation(values[field.name])[language].trim().length > 0
    );

  const setField = (name: string, value: FormValues[string]) =>
    setValues((previous) => ({ ...previous, [name]: value }));

  const setTranslatedField = (name: string, language: Language, text: string) =>
    setValues((previous) => ({
      ...previous,
      [name]: { ...asTranslation(previous[name]), [language]: text },
    }));

  /** Fill the language being edited from the other one. Result is a draft. */
  const runTranslation = async () => {
    setOverwritePromptOpen(false);
    setIsTranslating(true);

    try {
      const texts: Record<string, string> = {};
      for (const field of bilingualFields) {
        texts[field.name] = asTranslation(values[field.name])[sourceLang];
      }

      const result = await translateFields({ texts, from: sourceLang, to: currentLang });

      if (!result.success || !result.data) {
        toast.error(result.error || 'Automatic translation failed');
        return;
      }

      const translated = result.data;
      setValues((previous) => {
        const next = { ...previous };
        for (const [name, text] of Object.entries(translated)) {
          next[name] = { ...asTranslation(previous[name]), [currentLang]: text };
        }
        return next;
      });

      toast.success(
        `Translated into ${LANGUAGE_LABELS[currentLang]} — please review before publishing`
      );
    } finally {
      setIsTranslating(false);
    }
  };

  const handleTranslateClick = () => {
    if (languageHasText(currentLang)) {
      setOverwritePromptOpen(true);
      return;
    }
    runTranslation();
  };

  const copyAcross = (field: TranslatableField) => {
    const source = asTranslation(values[field.name])[sourceLang];
    setTranslatedField(field.name, currentLang, source);
  };

  const handleSubmit = async (publish: boolean) => {
    const missing = findMissingField(config, values, publish);

    if (missing) {
      if (missing.language) setCurrentLang(missing.language);
      toast.error(describeMissingField(missing, publish));
      return;
    }

    setIsSaving(true);

    try {
      const result = recordId
        ? await onUpdate(recordId, values, publish)
        : await onCreate(values, publish);

      if (result.success) {
        toast.success(
          isEditing
            ? `${config.singular} updated successfully`
            : `${config.singular} created successfully`
        );
        router.push(config.adminPath);
        router.refresh();
      } else {
        toast.error(result.error || `Failed to save ${config.singular.toLowerCase()}`);
      }
    } catch (error) {
      toast.error('An error occurred while saving');
    } finally {
      setIsSaving(false);
    }
  };

  const renderTabLabel = (language: Language) => (
    <span className="flex items-center justify-center gap-2">
      {LANGUAGE_LABELS[language]}
      {status[language] ? (
        <Check className="h-3.5 w-3.5 text-green-600" />
      ) : (
        <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
      )}
    </span>
  );

  const renderTranslatableField = (field: TranslatableField) => {
    const text = asTranslation(values[field.name])[currentLang];
    const onChange = (next: string) => setTranslatedField(field.name, currentLang, next);

    if (field.type === 'markdown') {
      return (
        <Tabs defaultValue="edit" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="edit" className="mt-4">
            <Textarea
              value={text}
              placeholder={field.placeholder}
              onChange={(event) => onChange(event.target.value)}
              className="min-h-[240px] font-mono text-sm"
            />
            <p className="mt-2 text-xs text-gray-500">
              Supports Markdown: **bold**, *italic*, [links](url), headings, lists.
            </p>
          </TabsContent>
          <TabsContent value="preview" className="mt-4">
            <MarkdownPreview content={text} />
          </TabsContent>
        </Tabs>
      );
    }

    if (field.type === 'textarea') {
      return (
        <Textarea
          value={text}
          placeholder={field.placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="min-h-[120px]"
        />
      );
    }

    return (
      <Input
        type="text"
        value={text}
        placeholder={field.placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  };

  const renderPlainField = (field: ResourceField) => {
    if (isTranslatable(field)) return null;
    const value = asString(values[field.name]);

    switch (field.type) {
      case 'image':
        return (
          <ImageUpload
            value={value || undefined}
            onChange={(url) => setField(field.name, url)}
            onRemove={() => setField(field.name, '')}
            disabled={isSaving}
            folder={config.key}
          />
        );
      case 'gallery':
        return (
          <MultiImageUpload
            value={asStringArray(values[field.name])}
            onChange={(urls) => setField(field.name, urls)}
            disabled={isSaving}
            folder={config.key}
          />
        );
      case 'select':
        return (
          <Select
            value={value}
            onValueChange={(next) => setField(field.name, next)}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {(field.options || []).map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'date':
      case 'time':
        return (
          <Input
            type={field.type}
            value={value}
            onChange={(event) => setField(field.name, event.target.value)}
            className="max-w-xs"
          />
        );
      default:
        return (
          <Input
            type={field.type === 'url' ? 'url' : 'text'}
            value={value}
            placeholder={field.placeholder}
            onChange={(event) => setField(field.name, event.target.value)}
          />
        );
    }
  };

  const sourceHasText = languageHasText(sourceLang);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main content */}
      <div className="lg:col-span-2 space-y-6">
        {/* Language switcher */}
        <Card>
          <CardHeader>
            <CardTitle>Language</CardTitle>
            <CardDescription>
              This {config.singular.toLowerCase()} is stored in both languages. Write
              one, then switch tabs to add the other — it can only be published once
              both are complete.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={currentLang}
              onValueChange={(next) => setCurrentLang(next as Language)}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="en">{renderTabLabel('en')}</TabsTrigger>
                <TabsTrigger value="fr">{renderTabLabel('fr')}</TabsTrigger>
              </TabsList>
            </Tabs>

            {sourceHasText && (
              <div className="mt-4 rounded-md border border-purple-200 bg-purple-50/60 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm text-gray-700">
                    Fill the {LANGUAGE_LABELS[currentLang]} version from the{' '}
                    {LANGUAGE_LABELS[sourceLang]} one.
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleTranslateClick}
                    disabled={isTranslating || isSaving}
                  >
                    {isTranslating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Translating...
                      </>
                    ) : (
                      <>
                        <Languages className="mr-2 h-4 w-4" />
                        Translate all to {currentLang.toUpperCase()}
                      </>
                    )}
                  </Button>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Machine translation is a starting point — read it through before
                  publishing.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bilingual fields */}
        {bilingualFields.map((field) => {
          const filled = asTranslation(values[field.name])[currentLang].trim().length > 0;
          const sourceText = asTranslation(values[field.name])[sourceLang];

          return (
            <Card key={field.name}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-base">
                      {field.label} ({LANGUAGE_LABELS[currentLang]})
                      {field.required && !filled && (
                        <span className="text-xs font-normal text-amber-600">
                          Required
                        </span>
                      )}
                    </CardTitle>
                    {field.description && (
                      <CardDescription>{field.description}</CardDescription>
                    )}
                  </div>
                  {sourceText.trim() && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-7 shrink-0 px-2 text-xs"
                      onClick={() => copyAcross(field)}
                    >
                      <Copy className="mr-1 h-3 w-3" />
                      Copy across
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {renderTranslatableField(field)}

                {sourceText.trim() && (
                  <details className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
                    <summary className="cursor-pointer text-xs font-medium text-gray-600">
                      {LANGUAGE_LABELS[sourceLang]} source
                    </summary>
                    <pre className="mt-2 max-h-48 overflow-y-auto whitespace-pre-wrap font-mono text-xs text-gray-700">
                      {sourceText}
                    </pre>
                  </details>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* Translation status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Languages className="h-4 w-4" />
              Translations
            </CardTitle>
            <CardDescription>Both languages are required to publish</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {(['en', 'fr'] as Language[]).map((language) => {
              const missing = bilingualFields
                .filter(
                  (field) =>
                    field.required &&
                    !asTranslation(values[field.name])[language].trim()
                )
                .map((field) => field.label.toLowerCase());

              return (
                <button
                  key={language}
                  type="button"
                  onClick={() => setCurrentLang(language)}
                  className={`w-full rounded-md border px-3 py-2 text-left transition-colors ${
                    status[language]
                      ? 'border-green-200 bg-green-50 hover:bg-green-100'
                      : 'border-amber-200 bg-amber-50 hover:bg-amber-100'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-gray-900">
                      {LANGUAGE_LABELS[language]}
                    </p>
                    {status[language] ? (
                      <Check className="h-4 w-4 shrink-0 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-gray-600">
                    {status[language] ? 'All fields ready' : `Missing ${missing.join(', ')}`}
                  </p>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Plain fields */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Details</CardTitle>
            <CardDescription>Shared by both languages</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {config.fields.filter((field) => !isTranslatable(field)).map((field) => (
              <div key={field.name} className="space-y-2">
                <Label className="flex items-center gap-2">
                  {field.label}
                  {field.required && (
                    <span className="text-xs font-normal text-amber-600">Required</span>
                  )}
                </Label>
                {field.description && (
                  <p className="text-xs text-gray-500">{field.description}</p>
                )}
                {renderPlainField(field)}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Publish */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Publish</CardTitle>
            <CardDescription>Control the visibility of this item</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-md bg-gray-50 px-3 py-2">
              <span className="text-sm text-gray-600">Current status</span>
              <span
                className={`text-sm font-medium ${
                  isPublished ? 'text-green-700' : 'text-gray-700'
                }`}
              >
                {isPublished ? 'Published' : 'Draft'}
              </span>
            </div>

            {mode === 'save' ? (
              /* Church accounts: save edits, publish state untouched. */
              <div className="space-y-2 border-t pt-4">
                <Button
                  type="button"
                  className="w-full"
                  disabled={isSaving || isTranslating}
                  onClick={() => handleSubmit(isPublished)}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save changes
                    </>
                  )}
                </Button>
                {!canPublish && (
                  <p className="text-xs text-amber-700">
                    Fill in both languages so your page reads correctly for every
                    visitor.
                  </p>
                )}
              </div>
            ) : (
            <div className="space-y-2 border-t pt-4">
              <Button
                type="button"
                className="w-full"
                disabled={isSaving || isTranslating || !canPublish}
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
                  Add the {status.en ? LANGUAGE_LABELS.fr : LANGUAGE_LABELS.en} version
                  to enable publishing. You can save a draft in the meantime.
                </p>
              )}

              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={isSaving || isTranslating}
                onClick={() => handleSubmit(false)}
              >
                Save as Draft
              </Button>

              {isEditing && isPublished && (
                <p className="text-xs text-gray-500">
                  Saving as a draft takes this off the public site until you publish it
                  again.
                </p>
              )}
            </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={overwritePromptOpen} onOpenChange={setOverwritePromptOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Replace the {LANGUAGE_LABELS[currentLang]} version?
            </AlertDialogTitle>
            <AlertDialogDescription>
              There is already {LANGUAGE_LABELS[currentLang]} text here. Translating
              from {LANGUAGE_LABELS[sourceLang]} will overwrite every bilingual field.
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
    </div>
  );
}
