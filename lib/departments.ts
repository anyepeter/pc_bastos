import {
  Briefcase,
  Heart,
  GraduationCap,
  Users,
  MessageCircle,
  Radio,
  Search,
  type LucideIcon,
} from 'lucide-react';

/**
 * The council's eight departments, in the order the secretariat lists them.
 *
 * Only the id and the glyph live here — every string is resolved through
 * i18next at `about.departments.<id>.{name,short,location,description}` so the
 * landing section and `/departments` cannot drift apart. `dfas` and `dj` share
 * a glyph, as they always have; they are told apart by name and number, never
 * by colour.
 */
export const DEPARTMENTS: ReadonlyArray<{ id: string; Icon: LucideIcon }> = [
  { id: 'saf', Icon: Briefcase },
  { id: 'ds', Icon: Heart },
  { id: 'oepp', Icon: GraduationCap },
  { id: 'dfas', Icon: Users },
  { id: 'dtc', Icon: MessageCircle },
  { id: 'dj', Icon: Users },
  { id: 'dic', Icon: Radio },
  { id: 'bured', Icon: Search },
];
