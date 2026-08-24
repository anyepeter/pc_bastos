import { ResourceConfig } from './resource-config';

/**
 * Field definitions for every admin-managed content type.
 *
 * Attributes were taken from what the existing public pages already render, so
 * moving a page onto the database does not change what it can display.
 */

export const eventConfig: ResourceConfig = {
  key: 'events',
  singular: 'Event',
  plural: 'Events',
  adminPath: '/admin/events',
  publicPath: '/events',
  slugFrom: 'title',
  titleField: 'title',
  orderBy: { date: 'asc' },
  fields: [
    {
      kind: 'translatable',
      type: 'text',
      name: 'title',
      label: 'Title',
      required: true,
      placeholder: 'Annual General Assembly',
    },
    {
      kind: 'translatable',
      type: 'markdown',
      name: 'description',
      label: 'Description',
      required: true,
      description: 'Shown on the event detail page. Markdown supported.',
    },
    {
      kind: 'translatable',
      type: 'text',
      name: 'location',
      label: 'Location',
      required: true,
      placeholder: 'Yaoundé',
    },
    {
      kind: 'translatable',
      type: 'text',
      name: 'category',
      label: 'Category',
      required: true,
      description: 'Shown as a badge, e.g. Assembly, Conference, Retreat.',
    },
    { kind: 'plain', type: 'date', name: 'date', label: 'Date', required: true },
    {
      kind: 'plain',
      type: 'time',
      name: 'time',
      label: 'Start time',
      description: 'Optional. Displayed next to the date.',
    },
    { kind: 'plain', type: 'image', name: 'imageUrl', label: 'Featured image' },
  ],
};

export const announcementConfig: ResourceConfig = {
  key: 'announcements',
  singular: 'Announcement',
  plural: 'Announcements',
  adminPath: '/admin/announcements',
  publicPath: '/announcements',
  titleField: 'title',
  orderBy: { date: 'desc' },
  fields: [
    {
      kind: 'translatable',
      type: 'text',
      name: 'title',
      label: 'Title',
      required: true,
    },
    {
      kind: 'translatable',
      type: 'textarea',
      name: 'description',
      label: 'Summary',
      required: true,
      description: 'The short version shown in the list before expanding.',
    },
    {
      kind: 'translatable',
      type: 'markdown',
      name: 'fullContent',
      label: 'Full announcement',
      required: true,
      description: 'Shown when the reader expands the announcement.',
    },
    { kind: 'plain', type: 'date', name: 'date', label: 'Date', required: true },
    {
      kind: 'plain',
      type: 'select',
      name: 'priority',
      label: 'Priority',
      required: true,
      options: [
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'low', label: 'Low' },
      ],
    },
    { kind: 'plain', type: 'image', name: 'imageUrl', label: 'Image' },
  ],
};

export const workshopConfig: ResourceConfig = {
  key: 'workshops',
  singular: 'Workshop',
  plural: 'Workshops & Trainings',
  adminPath: '/admin/workshops',
  publicPath: '/workshops',
  slugFrom: 'title',
  titleField: 'title',
  orderBy: { date: 'desc' },
  fields: [
    {
      kind: 'translatable',
      type: 'text',
      name: 'title',
      label: 'Title',
      required: true,
    },
    {
      kind: 'translatable',
      type: 'textarea',
      name: 'description',
      label: 'Short description',
      required: true,
      description: 'One or two lines, shown on the listing and under the title.',
    },
    {
      kind: 'translatable',
      type: 'markdown',
      name: 'fullDescription',
      label: 'Full description',
      required: true,
      description: 'The "About this workshop" section on the detail page.',
    },
    {
      kind: 'translatable',
      type: 'text',
      name: 'location',
      label: 'Location',
      required: true,
      placeholder: 'Douala Conference Center',
    },
    {
      kind: 'translatable',
      type: 'text',
      name: 'duration',
      label: 'Duration',
      placeholder: '3 days',
    },
    {
      kind: 'translatable',
      type: 'text',
      name: 'capacity',
      label: 'Capacity',
      placeholder: '50 participants',
    },
    { kind: 'plain', type: 'date', name: 'date', label: 'Date', required: true },
    {
      kind: 'plain',
      type: 'gallery',
      name: 'images',
      label: 'Photo gallery',
      description: 'Shown as a slider on the workshop page.',
    },
  ],
};

export const charityConfig: ResourceConfig = {
  key: 'charity',
  singular: 'Charity program',
  plural: 'Charity Programs',
  adminPath: '/admin/charity',
  publicPath: '/charity',
  slugFrom: 'title',
  titleField: 'title',
  orderBy: { createdAt: 'desc' },
  fields: [
    {
      kind: 'translatable',
      type: 'text',
      name: 'title',
      label: 'Program name',
      required: true,
      placeholder: 'Education Support Program',
    },
    {
      kind: 'translatable',
      type: 'textarea',
      name: 'description',
      label: 'Short description',
      required: true,
      description: 'One or two lines, shown on the listing page.',
    },
    {
      kind: 'translatable',
      type: 'markdown',
      name: 'fullDescription',
      label: 'Full description',
      required: true,
      description: 'The "About this program" section on the detail page.',
    },
    {
      kind: 'translatable',
      type: 'text',
      name: 'beneficiaries',
      label: 'Beneficiaries',
      required: true,
      placeholder: '120 students',
    },
    {
      kind: 'translatable',
      type: 'text',
      name: 'impact',
      label: 'Impact headline',
      description: 'One line shown under the title, e.g. "Transforming lives through education".',
    },
    {
      kind: 'translatable',
      type: 'text',
      name: 'location',
      label: 'Location',
    },
    { kind: 'plain', type: 'date', name: 'date', label: 'Start date' },
    // `amountUsed` / `totalGoal` still exist as columns but are deliberately not
    // edited or displayed — the public pages show the story, not a fundraising
    // meter. Re-add them here if that ever changes.
    {
      kind: 'plain',
      type: 'gallery',
      name: 'images',
      label: 'Photos',
      description: 'The first photo is used as the cover on the listing page.',
    },
  ],
};

export const sermonConfig: ResourceConfig = {
  key: 'sermons',
  singular: 'Sermon',
  plural: 'Sermons',
  adminPath: '/admin/sermons',
  publicPath: '/sermons',
  titleField: 'title',
  orderBy: { date: 'desc' },
  fields: [
    {
      kind: 'translatable',
      type: 'text',
      name: 'title',
      label: 'Title',
      required: true,
    },
    {
      kind: 'translatable',
      type: 'markdown',
      name: 'description',
      label: 'Description',
      required: true,
    },
    {
      kind: 'translatable',
      type: 'text',
      name: 'location',
      label: 'Location',
      required: true,
      placeholder: 'Simbock Yaoundé',
    },
    { kind: 'plain', type: 'date', name: 'date', label: 'Date preached', required: true },
    {
      kind: 'plain',
      type: 'text',
      name: 'duration',
      label: 'Duration',
      placeholder: '42 min',
    },
    {
      kind: 'plain',
      type: 'url',
      name: 'videoUrl',
      label: 'Video URL',
      description: 'Paste a direct link to the video file or stream.',
    },
    {
      kind: 'plain',
      type: 'url',
      name: 'audioUrl',
      label: 'Audio URL',
      description: 'Paste a direct link to the audio file.',
    },
    { kind: 'plain', type: 'image', name: 'thumbnail', label: 'Thumbnail' },
  ],
};

/**
 * Member church profile. Editable by the council and — uniquely — by the
 * church's own account through /admin/my-church.
 */
export const memberChurchConfig: ResourceConfig = {
  key: 'churches',
  singular: 'Member church',
  plural: 'Member Churches',
  adminPath: '/admin/churches',
  publicPath: '/members',
  slugFrom: 'denomination',
  titleField: 'denomination',
  orderBy: { createdAt: 'asc' },
  fields: [
    {
      kind: 'translatable',
      type: 'text',
      name: 'denomination',
      label: 'Church name',
      required: true,
      placeholder: 'Eglise Anglicane (EA)',
    },
    {
      kind: 'translatable',
      type: 'text',
      name: 'leader',
      label: 'Leader',
      required: true,
      description: 'Include the title, e.g. "Bishop" / "Évêque".',
    },
    {
      kind: 'translatable',
      type: 'text',
      name: 'location',
      label: 'City',
      required: true,
      placeholder: 'Douala',
    },
    {
      kind: 'translatable',
      type: 'markdown',
      name: 'history',
      label: 'History',
      required: true,
      description: 'Shown on the church detail page. Markdown supported.',
    },
    {
      kind: 'plain',
      type: 'text',
      name: 'founded',
      label: 'Founded',
      placeholder: '1922',
    },
    { kind: 'plain', type: 'image', name: 'logo', label: 'Logo' },
    {
      kind: 'plain',
      type: 'gallery',
      name: 'images',
      label: 'Photos',
      description: 'Shown as a slider on the church page.',
    },
    { kind: 'plain', type: 'text', name: 'phone', label: 'Phone' },
    { kind: 'plain', type: 'text', name: 'email', label: 'Email' },
    { kind: 'plain', type: 'text', name: 'address', label: 'Postal address' },
    { kind: 'plain', type: 'url', name: 'website', label: 'Website' },
  ],
};

export const RESOURCE_CONFIGS: ResourceConfig[] = [
  eventConfig,
  announcementConfig,
  workshopConfig,
  charityConfig,
  sermonConfig,
];
