'use client';

import { useState, useEffect } from 'react';
import { Bell, Calendar, Clock, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAppSelector } from '@/store/hooks';
import { Language, getTranslatedText } from '@/lib/translations';
import { formatLongDate } from '@/lib/format';

export interface PublicAnnouncement {
  id: string;
  title: unknown;
  description: unknown;
  fullContent: unknown;
  date: string;
  priority: string;
  imageUrl: string | null;
}

/** Relative age of an announcement, in the reader's language. */
function timeAgo(dateString: string, language: Language): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';

  const days = Math.max(
    1,
    Math.ceil(Math.abs(Date.now() - date.getTime()) / (1000 * 60 * 60 * 24))
  );

  if (language === 'fr') {
    if (days === 1) return 'il y a 1 jour';
    if (days < 7) return `il y a ${days} jours`;
    if (days < 30) return `il y a ${Math.floor(days / 7)} semaines`;
    return `il y a ${Math.floor(days / 30)} mois`;
  }

  if (days === 1) return '1 day ago';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}

const PRIORITY_STYLES: Record<string, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-gray-100 text-gray-600',
};

const PRIORITY_LABELS: Record<string, { en: string; fr: string }> = {
  high: { en: 'Important', fr: 'Important' },
  medium: { en: 'Update', fr: 'Mise à jour' },
  low: { en: 'Notice', fr: 'Information' },
};

export default function AnnouncementsClient({
  announcements,
}: {
  announcements: PublicAnnouncement[];
}) {
  const [selected, setSelected] = useState<PublicAnnouncement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const language = useAppSelector((state) => state.blog.language);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = selected ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selected]);

  const renderCard = (announcement: PublicAnnouncement, index: number, desktop: boolean) => {
    const title = getTranslatedText(announcement.title as any, language);
    const description = getTranslatedText(announcement.description as any, language);
    const priorityLabel =
      PRIORITY_LABELS[announcement.priority] || PRIORITY_LABELS.medium;

    return (
      <div
        key={announcement.id}
        className={`bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg transition-all duration-500 cursor-pointer transform ${
          desktop
            ? 'rounded-2xl hover:shadow-2xl hover:scale-[1.02] group'
            : 'hover:shadow-xl'
        } ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
        style={{ transitionDelay: `${index * (desktop ? 150 : 100)}ms` }}
        onClick={() => setSelected(announcement)}
      >
        <div
          className={`relative h-48 overflow-hidden ${desktop ? 'rounded-t-2xl' : ''}`}
        >
          {announcement.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={announcement.imageUrl}
              alt={title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-purple-400 to-indigo-500" />
          )}
          <span
            className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-medium ${
              PRIORITY_STYLES[announcement.priority] || PRIORITY_STYLES.medium
            }`}
          >
            {priorityLabel[language]}
          </span>
        </div>

        <div className="p-6">
          <h3
            className={`font-bold font-playfair text-gray-900 mb-2 leading-tight ${
              desktop
                ? 'text-xl mb-3 group-hover:text-purple-700 transition-colors duration-300'
                : 'text-lg'
            }`}
          >
            {title}
          </h3>

          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
            <Calendar className="w-4 h-4 text-purple-500" />
            <span>{formatLongDate(announcement.date, language)}</span>
            <span className="text-gray-400">•</span>
            <Clock className="w-4 h-4" />
            <span>{timeAgo(announcement.date, language)}</span>
          </div>

          <p
            className={`text-gray-700 text-sm leading-relaxed ${
              desktop ? 'line-clamp-4' : 'line-clamp-3'
            }`}
          >
            {description}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100">
      <div className="text-white relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=600&fit=crop&auto=format")',
          }}
        />
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-10 md:pb-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold font-playfair mb-4 bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
              {language === 'fr' ? 'Annonces' : 'Announcements'}
            </h1>
            <p className="text-xl text-purple-100 font-inter max-w-3xl mx-auto leading-relaxed">
              {language === 'fr'
                ? 'Informations et nouvelles importantes du Conseil des Églises Protestantes'
                : 'Important updates and news from the Council of Protestant Churches'}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {announcements.length === 0 ? (
          <div className="rounded-2xl border border-white/50 bg-white/80 py-16 text-center">
            <Bell className="mx-auto h-12 w-12 text-purple-300" />
            <p className="mt-4 text-lg text-gray-700">
              {language === 'fr'
                ? "Aucune annonce pour l'instant."
                : 'No announcements yet.'}
            </p>
          </div>
        ) : (
          <>
            <div className="block lg:hidden space-y-6">
              {announcements.map((announcement, index) =>
                renderCard(announcement, index, false)
              )}
            </div>

            <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {announcements.map((announcement, index) =>
                renderCard(announcement, index, true)
              )}
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="relative h-64">
              {selected.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selected.imageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-purple-400 to-indigo-500" />
              )}
              <button
                onClick={() => setSelected(null)}
                aria-label={language === 'fr' ? 'Fermer' : 'Close'}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto max-h-[calc(90vh-16rem)]">
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                <Bell className="w-4 h-4 text-purple-500" />
                <span>{language === 'fr' ? 'Annonce' : 'Announcement'}</span>
                <span className="text-gray-400">•</span>
                <Calendar className="w-4 h-4 text-purple-500" />
                <span>{formatLongDate(selected.date, language)}</span>
              </div>

              <h2 className="text-2xl font-bold font-playfair text-gray-900 mb-6 leading-tight">
                {getTranslatedText(selected.title as any, language)}
              </h2>

              <div className="prose prose-gray max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {getTranslatedText(selected.fullContent as any, language)}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
