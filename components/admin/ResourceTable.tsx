'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Edit, Eye, EyeOff, Plus, Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { DeleteDialog } from './DeleteDialog';
import { toast } from 'sonner';
import { Language, readTranslation } from '@/lib/translations';
import { ResourceConfig, isTranslatable } from '@/lib/admin/resource-config';
import { rowIsTranslated, rowTitle } from '@/lib/admin/resource-service';

type Row = Record<string, any>;

interface ResourceTableProps {
  config: ResourceConfig;
  rows: Row[];
  onDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
  onTogglePublish: (id: string) => Promise<{ success: boolean; error?: string }>;
}

/** EN / FR chips showing which translations a row already has. */
function TranslationBadges({ config, row }: { config: ResourceConfig; row: Row }) {
  const required = config.fields.filter((field) => field.required && isTranslatable(field));

  return (
    <div className="flex items-center gap-1">
      {(['en', 'fr'] as Language[]).map((language) => {
        const complete = required.every(
          (field) => readTranslation(row[field.name])[language].trim().length > 0
        );

        return (
          <span
            key={language}
            title={
              complete
                ? `${language.toUpperCase()} translation complete`
                : `${language.toUpperCase()} translation missing`
            }
            className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
              complete
                ? 'bg-green-100 text-green-700'
                : 'bg-amber-100 text-amber-700 line-through decoration-amber-400'
            }`}
          >
            {language}
          </span>
        );
      })}
    </div>
  );
}

/** First image a row has, for the thumbnail column. */
function rowImage(config: ResourceConfig, row: Row): string | null {
  for (const field of config.fields) {
    if (isTranslatable(field)) continue;
    if (field.type === 'image' && typeof row[field.name] === 'string' && row[field.name]) {
      return row[field.name];
    }
    if (field.type === 'gallery' && Array.isArray(row[field.name]) && row[field.name][0]) {
      return row[field.name][0];
    }
  }
  return null;
}

function rowDate(config: ResourceConfig, row: Row): string {
  const dateField = config.fields.find(
    (field) => !isTranslatable(field) && field.type === 'date'
  );
  const value = dateField ? row[dateField.name] : row.createdAt;
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString();
}

/**
 * The admin list shared by every content type: search, translation status,
 * publish toggle, edit and delete.
 */
export function ResourceTable({
  config,
  rows,
  onDelete,
  onTogglePublish,
}: ResourceTableProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [rowToUnpublish, setRowToUnpublish] = useState<Row | null>(null);

  const filteredRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return rows;

    return rows.filter((row) =>
      config.fields
        .filter(isTranslatable)
        .some((field) => {
          const translation = readTranslation(row[field.name]);
          return (
            translation.en.toLowerCase().includes(query) ||
            translation.fr.toLowerCase().includes(query)
          );
        })
    );
  }, [rows, searchQuery, config]);

  /** A draft can only go live once French is done; unpublishing is always fine. */
  const canTogglePublish = (row: Row) => row.published || rowIsTranslated(config, row);

  const handleDeleteConfirm = async () => {
    if (!rowToDelete) return;

    setIsDeleting(true);
    const result = await onDelete(rowToDelete);

    if (result.success) {
      toast.success(`${config.singular} deleted`);
      setDeleteDialogOpen(false);
      setRowToDelete(null);
      router.refresh();
    } else {
      toast.error(result.error || 'Failed to delete');
    }
    setIsDeleting(false);
  };

  /**
   * Publishing is one click; unpublishing asks first, because it removes
   * something from the live site and is easy to hit by accident right after
   * creating an item.
   */
  const requestTogglePublish = (row: Row) => {
    if (row.published) {
      setRowToUnpublish(row);
      return;
    }
    runTogglePublish(row);
  };

  const runTogglePublish = async (row: Row) => {
    const wasPublished = row.published;

    setRowToUnpublish(null);
    setTogglingId(row.id);

    const result = await onTogglePublish(row.id);

    if (result.success) {
      // Always say what happened — a silent flip is how an item ends up
      // offline without anyone noticing.
      toast.success(
        wasPublished
          ? `Taken offline — "${rowTitle(config, row)}" is now a draft`
          : `Published — "${rowTitle(config, row)}" is now live on the site`
      );
      router.refresh();
    } else {
      toast.error(result.error || 'Failed to update publish status');
    }
    setTogglingId(null);
  };

  const emptyState = (
    <div className="rounded-lg border border-gray-200 bg-white py-12 text-center">
      {searchQuery ? (
        <>
          <Search className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Nothing found</h3>
          <p className="mt-1 text-sm text-gray-500">
            No {config.plural.toLowerCase()} match your search.
          </p>
          <div className="mt-6">
            <Button variant="outline" onClick={() => setSearchQuery('')}>
              Clear search
            </Button>
          </div>
        </>
      ) : (
        <>
          <Plus className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No {config.plural.toLowerCase()} yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first one.
          </p>
          <div className="mt-6">
            <Button asChild>
              <Link href={`${config.adminPath}/create`}>
                <Plus className="mr-2 h-4 w-4" />
                Create {config.singular.toLowerCase()}
              </Link>
            </Button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="w-full pl-10"
          />
        </div>
        {searchQuery && (
          <Button variant="ghost" onClick={() => setSearchQuery('')}>
            Clear
          </Button>
        )}
      </div>

      {filteredRows.length === 0 ? (
        emptyState
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden md:block">
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Image</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Languages</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRows.map((row) => {
                    const image = rowImage(config, row);

                    return (
                      <TableRow key={row.id}>
                        <TableCell>
                          {image ? (
                            <div className="relative h-16 w-16 overflow-hidden rounded">
                              <Image
                                src={image}
                                alt=""
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                          ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded bg-gray-200">
                              <span className="text-xs text-gray-400">No image</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <p className="font-medium text-gray-900">
                            {rowTitle(config, row) || '(untitled)'}
                          </p>
                          {row.slug && (
                            <p className="text-sm text-gray-500">/{row.slug}</p>
                          )}
                        </TableCell>
                        <TableCell>
                          <TranslationBadges config={config} row={row} />
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={row.published ? 'default' : 'secondary'}
                            className={
                              row.published
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : ''
                            }
                          >
                            {row.published ? 'Published' : 'Draft'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {rowDate(config, row)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => requestTogglePublish(row)}
                              disabled={togglingId === row.id || !canTogglePublish(row)}
                              title={
                                !canTogglePublish(row)
                                  ? 'Add the French translation before publishing'
                                  : undefined
                              }
                              className={
                                row.published
                                  ? 'text-gray-600'
                                  : 'border-green-200 text-green-700 hover:bg-green-50'
                              }
                            >
                              {row.published ? (
                                <>
                                  <EyeOff className="mr-1.5 h-3.5 w-3.5" />
                                  Unpublish
                                </>
                              ) : (
                                <>
                                  <Eye className="mr-1.5 h-3.5 w-3.5" />
                                  Publish
                                </>
                              )}
                            </Button>
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={`${config.adminPath}/${row.id}/edit`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setRowToDelete(row.id);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Mobile */}
          <div className="space-y-4 md:hidden">
            {filteredRows.map((row) => {
              const image = rowImage(config, row);

              return (
                <Card key={row.id} className="p-4">
                  <div className="flex space-x-4">
                    {image ? (
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded">
                        <Image
                          src={image}
                          alt=""
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded bg-gray-200">
                        <span className="text-xs text-gray-400">No image</span>
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-medium text-gray-900">
                        {rowTitle(config, row) || '(untitled)'}
                      </h3>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <Badge
                          variant={row.published ? 'default' : 'secondary'}
                          className={
                            row.published ? 'bg-green-100 text-green-700' : ''
                          }
                        >
                          {row.published ? 'Published' : 'Draft'}
                        </Badge>
                        <TranslationBadges config={config} row={row} />
                        <span className="text-xs text-gray-500">
                          {rowDate(config, row)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => requestTogglePublish(row)}
                      disabled={togglingId === row.id || !canTogglePublish(row)}
                      title={
                        !canTogglePublish(row)
                          ? 'Add the French translation before publishing'
                          : undefined
                      }
                    >
                      {row.published ? (
                        <>
                          <EyeOff className="mr-2 h-4 w-4" />
                          Unpublish
                        </>
                      ) : (
                        <>
                          <Eye className="mr-2 h-4 w-4" />
                          Publish
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" asChild className="flex-1">
                      <Link href={`${config.adminPath}/${row.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setRowToDelete(row.id);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title={`Delete this ${config.singular.toLowerCase()}?`}
        description="This permanently removes the item and any images uploaded for it. This action cannot be undone."
        isDeleting={isDeleting}
      />

      <AlertDialog
        open={rowToUnpublish !== null}
        onOpenChange={(open) => !open && setRowToUnpublish(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Take this off the public site?</AlertDialogTitle>
            <AlertDialogDescription>
              {rowToUnpublish
                ? `"${rowTitle(config, rowToUnpublish)}" is currently live. Unpublishing turns it back into a draft, so visitors will no longer see it. You can publish it again at any time.`
                : ''}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it published</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => rowToUnpublish && runTogglePublish(rowToUnpublish)}
            >
              Unpublish
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
