'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChevronDown, ChevronUp, Copy, Languages, Loader2 } from 'lucide-react';
import { Language, LANGUAGE_LABELS } from '@/lib/translations';

interface TranslationSourcePanelProps {
  sourceLang: Language;
  targetLang: Language;
  sourceTitle: string;
  sourceDescription: string;
  isTranslating: boolean;
  onTranslate: () => void;
  onCopyTitle: () => void;
  onCopyDescription: () => void;
}

/**
 * Reference panel shown while editing one language: it keeps the other
 * language's text on screen so the editor can translate from it, either by
 * hand (copy) or with one click (machine translation, reviewed afterwards).
 */
export function TranslationSourcePanel({
  sourceLang,
  targetLang,
  sourceTitle,
  sourceDescription,
  isTranslating,
  onTranslate,
  onCopyTitle,
  onCopyDescription,
}: TranslationSourcePanelProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <Card className="border-purple-200 bg-purple-50/50">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Languages className="h-4 w-4 text-purple-700" />
              {LANGUAGE_LABELS[sourceLang]} source
            </CardTitle>
            <CardDescription>
              Translate this into {LANGUAGE_LABELS[targetLang]}
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              onClick={onTranslate}
              disabled={isTranslating}
            >
              {isTranslating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Translating...
                </>
              ) : (
                <>
                  <Languages className="mr-2 h-4 w-4" />
                  Translate to {targetLang.toUpperCase()}
                </>
              )}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setExpanded((value) => !value)}
              aria-label={expanded ? 'Hide source text' : 'Show source text'}
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Title
              </p>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-7 px-2 text-xs"
                onClick={onCopyTitle}
                disabled={!sourceTitle.trim()}
              >
                <Copy className="mr-1 h-3 w-3" />
                Copy across
              </Button>
            </div>
            <p className="rounded-md border border-purple-200 bg-white px-3 py-2 text-sm text-gray-800">
              {sourceTitle.trim() || (
                <span className="text-gray-400">
                  No {LANGUAGE_LABELS[sourceLang]} title yet
                </span>
              )}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                Content
              </p>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-7 px-2 text-xs"
                onClick={onCopyDescription}
                disabled={!sourceDescription.trim()}
              >
                <Copy className="mr-1 h-3 w-3" />
                Copy across
              </Button>
            </div>
            <div className="max-h-64 overflow-y-auto rounded-md border border-purple-200 bg-white px-3 py-2">
              {sourceDescription.trim() ? (
                <pre className="whitespace-pre-wrap font-mono text-xs text-gray-800">
                  {sourceDescription}
                </pre>
              ) : (
                <span className="text-sm text-gray-400">
                  No {LANGUAGE_LABELS[sourceLang]} content yet
                </span>
              )}
            </div>
          </div>

          <p className="text-xs text-gray-500">
            Machine translation is a starting point — read it through and fix the
            wording before publishing.
          </p>
        </CardContent>
      )}
    </Card>
  );
}
