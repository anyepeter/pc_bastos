/**
 * The board of CEPCA: shared by the admin config, the server actions and the
 * public pages (/board and /about/general-secretariat). Pure data and
 * helpers — safe to import from client and server alike.
 */

import { safeLink } from '@/lib/safe-link';
import { cloudinaryVariant, faceAvatar } from '@/lib/cloudinary-image';

/** Where a member sits in the organogram, top to bottom. */
export const BOARD_OFFICES = [
  { value: 'president', label: 'President (top of the chart)', short: 'President' },
  { value: 'vice_president', label: 'Vice-President (second row)', short: 'Vice-President' },
  { value: 'member', label: 'Other board officer (third row)', short: 'Other officer' },
  {
    value: 'general_secretary',
    label: 'General Secretary (above the departments)',
    short: 'General Secretary',
  },
] as const;

export type BoardOffice = (typeof BOARD_OFFICES)[number]['value'];

export const officeLabel = (office: string) =>
  BOARD_OFFICES.find((entry) => entry.value === office)?.short ?? office;

/** A published board member, as the public pages receive it. */
export interface PublicBoardMember {
  id: string;
  name: string;
  office: string;
  title: unknown;
  detail: unknown;
  photo: string | null;
  link: string | null;
}

export function toPublicBoardMember(row: Record<string, any>): PublicBoardMember {
  return {
    id: row.id,
    name: typeof row.name === 'string' ? row.name.trim() : '',
    office: row.office,
    title: row.title,
    detail: row.detail ?? null,
    photo: typeof row.photo === 'string' && row.photo ? row.photo : null,
    link: safeLink(row.link),
  };
}

/** Square face crop for the organogram (Cloudinary URLs only; R2 photos are cropped by CSS). */
export const boardAvatar = faceAvatar;

/** 4:5 face crop for the General Secretariat page (Cloudinary URLs only; R2 photos are cropped by CSS). */
export const boardPortrait = (url: string) =>
  cloudinaryVariant(url, 'c_thumb,g_face,z_0.5,w_800,h_1000,q_auto,f_auto');
