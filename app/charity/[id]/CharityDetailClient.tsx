'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, HeartHandshake, MapPin, Users } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ImageSlider from './ImageSlider';
import { useAppSelector } from '@/store/hooks';
import { getTranslatedText } from '@/lib/translations';
import { formatLongDate } from '@/lib/format';

export interface PublicCharityDetail {
  id: string;
  slug: string;
  title: unknown;
  description: unknown;
  fullDescription: unknown;
  impact: unknown;
  beneficiaries: unknown;
  location: unknown;
  date: string | null;
  images: string[];
}

export default function CharityDetailClient({
  charity,
}: {
  charity: PublicCharityDetail;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const language = useAppSelector((state) => state.blog.language);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const title = getTranslatedText(charity.title as any, language);
  const description = getTranslatedText(charity.description as any, language);
  const fullDescription = getTranslatedText(charity.fullDescription as any, language);
  const impact = getTranslatedText(charity.impact as any, language);
  const beneficiaries = getTranslatedText(charity.beneficiaries as any, language);
  const location = getTranslatedText(charity.location as any, language);
  const cover = charity.images[0];
  const gallery = charity.images.slice(1);

  const copy =
    language === 'fr'
      ? {
          back: 'Tous les programmes',
          about: 'À propos du programme',
          started: 'Depuis',
          where: 'Lieu',
          who: 'Bénéficiaires',
          gallery: 'En images',
          ctaTitle: 'Faites la différence',
          ctaBody:
            'Votre soutien permet à ce programme de toucher davantage de familles dans nos communautés.',
          ctaButton: 'Soutenir ce programme',
        }
      : {
          back: 'All programs',
          about: 'About this program',
          started: 'Since',
          where: 'Location',
          who: 'Beneficiaries',
          gallery: 'In pictures',
          ctaTitle: 'Make a difference',
          ctaBody:
            'Your support lets this program reach more families across our communities.',
          ctaButton: 'Support this program',
        };

  const facts = [
    charity.date && {
      icon: Calendar,
      label: copy.started,
      value: formatLongDate(charity.date, language),
    },
    location && { icon: MapPin, label: copy.where, value: location },
    beneficiaries && { icon: Users, label: copy.who, value: beneficiaries },
  ].filter(Boolean) as { icon: typeof Calendar; label: string; value: string }[];

  return (
    <div className="min-h-screen bg-[#fbfbfa]">
      {/* Hero */}
      <div className="relative overflow-hidden text-white">
        {cover ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-black/85" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-teal-700 via-cyan-700 to-emerald-700" />
        )}

        <div className="relative mx-auto max-w-5xl px-4 pb-16 pt-28 sm:px-6 md:pb-20 md:pt-36 lg:px-8">
          <Link
            href="/charity"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            {copy.back}
          </Link>

          <div
            className={`mt-8 transform transition-all duration-1000 ease-out ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
          >
            {impact && (
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-200">
                {impact}
              </p>
            )}

            <h1 className="mt-4 max-w-3xl font-playfair text-4xl font-bold leading-[1.08] sm:text-5xl md:text-6xl">
              {title}
            </h1>

            {description && (
              <p className="mt-6 max-w-2xl font-inter text-lg leading-relaxed text-gray-200">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Facts strip */}
      {facts.length > 0 && (
        <div className="border-b border-gray-200 bg-white">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-px px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="flex items-center gap-3 py-5 sm:justify-center sm:py-6"
              >
                <fact.icon className="h-5 w-5 shrink-0 text-teal-600" />
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                    {fact.label}
                  </p>
                  <p className="truncate font-inter font-semibold text-gray-900">
                    {fact.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Body */}
      <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="font-playfair text-3xl font-bold text-gray-900">
              {copy.about}
            </h2>
            <div className="prose prose-lg mt-6 max-w-none font-inter text-gray-700 prose-headings:font-playfair prose-headings:text-gray-900 prose-a:text-teal-700">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{fullDescription}</ReactMarkdown>
            </div>

            {gallery.length > 0 && (
              <div className="mt-14">
                <h2 className="mb-6 font-playfair text-2xl font-bold text-gray-900">
                  {copy.gallery}
                </h2>
                <ImageSlider images={gallery} alt={title} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-28">
              <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 to-emerald-600 p-7 text-white shadow-lg">
                <HeartHandshake className="h-8 w-8 text-teal-100" />
                <h3 className="mt-4 font-playfair text-2xl font-bold">{copy.ctaTitle}</h3>
                <p className="mt-3 font-inter text-sm leading-relaxed text-teal-50">
                  {copy.ctaBody}
                </p>
                <Link
                  href="/give"
                  className="mt-6 block w-full rounded-xl bg-white px-6 py-3 text-center font-semibold text-teal-700 transition-colors hover:bg-teal-50"
                >
                  {copy.ctaButton}
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
