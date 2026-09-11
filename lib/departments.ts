import {
  Briefcase,
  Heart,
  GraduationCap,
  Landmark,
  Users,
  MessageCircle,
  Radio,
  Search,
  type LucideIcon,
} from 'lucide-react';

/**
 * The council's eight departments, in the order the secretariat lists them.
 *
 * Departments now live in the database (the `Department` model, edited at
 * /admin/departments and by each department's own login). This list is the
 * fallback the public pages render while that table is empty or unreachable:
 * every string resolves through i18next at
 * `about.departments.<id>.{name,short,location,description}`.
 *
 * It also lends each department its glyph, matched on the acronym. `dfas` and
 * `dj` share one, as they always have; they are told apart by name and number,
 * never by colour.
 */
export const DEPARTMENTS: ReadonlyArray<{
  id: string;
  acronym: string;
  Icon: LucideIcon;
}> = [
  { id: 'saf', acronym: 'SAF', Icon: Briefcase },
  { id: 'ds', acronym: 'DS', Icon: Heart },
  { id: 'oepp', acronym: 'OEPP', Icon: GraduationCap },
  { id: 'dfas', acronym: 'DFAS', Icon: Users },
  { id: 'dtc', acronym: 'DTC', Icon: MessageCircle },
  { id: 'dj', acronym: 'DJ', Icon: Users },
  { id: 'dic', acronym: 'DIC', Icon: Radio },
  { id: 'bured', acronym: 'BURED', Icon: Search },
];

/** The glyph for a department, by acronym; a neutral one for any new department. */
export function departmentIcon(acronym: string | null | undefined): LucideIcon {
  const key = (acronym || '').trim().toUpperCase();
  return DEPARTMENTS.find((department) => department.acronym === key)?.Icon ?? Landmark;
}

/* ------------------------------------------------------------ public data */

/*
 * Plain JSON handed from the server pages to their client components. Bilingual
 * values stay raw (`unknown`) and are resolved with `readTranslation` in the
 * browser, where the visitor's language is known.
 */

export interface PublicDepartmentSummary {
  id: string;
  slug: string;
  acronym: string;
  name: unknown;
  summary: unknown;
  location: unknown;
  logo: string | null;
}

export interface PublicDepartment extends PublicDepartmentSummary {
  tagline: unknown;
  vision: unknown;
  mission: unknown;
  objectives: unknown;
  services: unknown;
  structures: unknown;
  keyFigures: unknown;
  support: unknown;
  coverage: unknown;
  headTitle: unknown;
  headName: string | null;
  headPhoto: string | null;
  coverImage: string | null;
  images: string[];
  phone: string | null;
  email: string | null;
  address: string | null;
  website: string | null;
}

export type ActivityKind = 'event' | 'activity' | 'project';

export interface PublicActivity {
  id: string;
  slug: string;
  kind: ActivityKind;
  title: unknown;
  summary: unknown;
  body: unknown;
  location: unknown;
  /** ISO strings — dates never cross the server/client boundary as Date. */
  date: string;
  endDate: string | null;
  time: string | null;
  imageUrl: string | null;
  images: string[];
}

type Row = Record<string, any>;

const text = (value: unknown): string | null =>
  typeof value === 'string' && value.trim() ? value : null;

export function toPublicDepartmentSummary(row: Row): PublicDepartmentSummary {
  return {
    id: row.id,
    slug: row.slug,
    acronym: row.acronym || '',
    name: row.name,
    summary: row.summary,
    location: row.location ?? null,
    logo: text(row.logo),
  };
}

export function toPublicDepartment(row: Row): PublicDepartment {
  return {
    ...toPublicDepartmentSummary(row),
    tagline: row.tagline ?? null,
    vision: row.vision ?? null,
    mission: row.mission ?? null,
    objectives: row.objectives ?? null,
    services: row.services ?? null,
    structures: row.structures ?? null,
    keyFigures: row.keyFigures ?? null,
    support: row.support ?? null,
    coverage: row.coverage ?? null,
    headTitle: row.headTitle ?? null,
    headName: text(row.headName),
    headPhoto: text(row.headPhoto),
    coverImage: text(row.coverImage),
    images: Array.isArray(row.images) ? row.images.filter(Boolean) : [],
    phone: text(row.phone),
    email: text(row.email),
    address: text(row.address),
    website: text(row.website),
  };
}

export const normalizeKind = (value: unknown): ActivityKind =>
  value === 'event' || value === 'project' ? value : 'activity';

export function toPublicActivity(row: Row): PublicActivity {
  return {
    id: row.id,
    slug: row.slug,
    kind: normalizeKind(row.kind),
    title: row.title,
    summary: row.summary,
    body: row.body ?? null,
    location: row.location ?? null,
    date: new Date(row.date).toISOString(),
    endDate: row.endDate ? new Date(row.endDate).toISOString() : null,
    time: text(row.time),
    imageUrl: text(row.imageUrl),
    images: Array.isArray(row.images) ? row.images.filter(Boolean) : [],
  };
}

/* ------------------------------------------------------------ key figures */

export interface KeyFigure {
  value: string;
  label: string;
}

/**
 * The "Key figures" field is one figure per line, `value | label`. Blank lines
 * and lines without a bar are skipped rather than shown half-formed.
 */
export function parseKeyFigures(source: string): KeyFigure[] {
  return source
    .split(/\r?\n/)
    .map((line) => {
      const bar = line.indexOf('|');
      if (bar === -1) return null;
      const value = line.slice(0, bar).trim();
      const label = line.slice(bar + 1).trim();
      return value && label ? { value, label } : null;
    })
    .filter((figure): figure is KeyFigure => figure !== null);
}

/* ------------------------------------------------------------- activities */

/**
 * Today's date in Cameroon, as YYYY-MM-DD. Dates are entered as plain days, so
 * "upcoming" is decided day by day in the council's own time zone — an event
 * stays upcoming for the whole of its day.
 */
export function councilToday(now: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Douala',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
}

/**
 * Split a department's published activities into the three bands of its page.
 * Projects stand apart whatever their dates; everything else is upcoming until
 * its last day has passed (soonest first), then recent (newest first).
 */
export function splitActivities(activities: PublicActivity[], today = councilToday()) {
  const lastDay = (activity: PublicActivity) =>
    (activity.endDate ?? activity.date).slice(0, 10);

  const projects = activities
    .filter((activity) => activity.kind === 'project')
    .sort((a, b) => b.date.localeCompare(a.date));

  const dated = activities.filter((activity) => activity.kind !== 'project');

  const upcoming = dated
    .filter((activity) => lastDay(activity) >= today)
    .sort((a, b) => a.date.localeCompare(b.date));

  const recent = dated
    .filter((activity) => lastDay(activity) < today)
    .sort((a, b) => b.date.localeCompare(a.date));

  return { upcoming, recent, projects };
}

/** Several numbers in one field, separated by "/" "," or ";". */
export function splitPhoneNumbers(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(/\s*[\/,;]\s*/)
    .map((part) => part.trim())
    .filter(Boolean);
}
