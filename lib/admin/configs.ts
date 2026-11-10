import { ResourceConfig } from './resource-config';
import { BOARD_OFFICES } from '@/lib/board';

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
    {
      kind: 'plain',
      type: 'gallery',
      name: 'images',
      label: 'Photo gallery',
      description: 'Photos from the event, shown under the description. The featured image is not repeated there.',
    },
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

export const newsConfig: ResourceConfig = {
  key: 'news',
  singular: 'News article',
  plural: 'News',
  adminPath: '/admin/news',
  publicPath: '/news',
  slugFrom: 'title',
  titleField: 'title',
  orderBy: { date: 'desc' },
  fields: [
    {
      kind: 'translatable',
      type: 'text',
      name: 'title',
      label: 'Headline',
      required: true,
      placeholder: 'Council opens new theological seminary campus',
    },
    {
      kind: 'translatable',
      type: 'textarea',
      name: 'excerpt',
      label: 'Standfirst',
      required: true,
      description: 'One or two sentences. This is the paragraph on the news card.',
    },
    {
      kind: 'translatable',
      type: 'markdown',
      name: 'body',
      label: 'Article',
      required: true,
      description: 'The full article. Markdown supported.',
    },
    {
      kind: 'translatable',
      type: 'text',
      name: 'category',
      label: 'Category',
      description: 'Optional. Shown as a kicker above the headline, e.g. Assembly, Health, Education.',
    },
    { kind: 'plain', type: 'date', name: 'date', label: 'Publication date', required: true },
    {
      kind: 'plain',
      type: 'image',
      name: 'imageUrl',
      label: 'Featured image',
      description: 'Shown on the card and at the head of the article.',
    },
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
      placeholder: 'Église Anglicane (EA)',
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
      type: 'image',
      name: 'leaderPhoto',
      label: "Leader's photo",
      description:
        "Optional. A portrait of the church's head, shown beside their name on the church page. The face is centred automatically.",
    },
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

/**
 * A council department's profile. Editable by the council, and by the
 * department's own account through /admin/my-department — minus the fields in
 * `COUNCIL_ONLY_DEPARTMENT_FIELDS`.
 *
 * The attributes follow what the departments themselves supplied (the Health
 * Department's profile and roll-up, the DTC/DJ/DFAS attributions, the DIC
 * facilities list, the council presentation), and what a full member-church
 * profile carries: vision, mandate, objectives, services, structures, figures,
 * leadership, needs and contact.
 */
export const departmentConfig: ResourceConfig = {
  key: 'departments',
  singular: 'Department',
  plural: 'Departments',
  adminPath: '/admin/departments',
  publicPath: '/departments',
  slugFrom: 'name',
  titleField: 'name',
  orderBy: { sortOrder: 'asc' },
  fields: [
    {
      kind: 'translatable',
      type: 'text',
      name: 'name',
      label: 'Department name',
      required: true,
      placeholder: 'Department of Health (DS)',
      description: 'The full official name, with the acronym in brackets.',
    },
    {
      kind: 'translatable',
      type: 'text',
      name: 'tagline',
      label: 'Tagline',
      description:
        'Optional. One line under the name at the top of the page, e.g. "Restoring health through faith-based excellence."',
    },
    {
      kind: 'translatable',
      type: 'textarea',
      name: 'summary',
      label: 'Summary',
      required: true,
      description:
        'Two or three sentences on what the department is for. Shown on the departments page and the home page.',
    },
    {
      kind: 'translatable',
      type: 'textarea',
      name: 'vision',
      label: 'Vision',
      description: 'Optional. A short paragraph, set as a quotation on the page.',
    },
    {
      kind: 'translatable',
      type: 'markdown',
      name: 'mission',
      label: 'Mission and mandate',
      description:
        'What the council has charged the department with — its attributions. A bulleted list reads well.',
    },
    {
      kind: 'translatable',
      type: 'markdown',
      name: 'objectives',
      label: 'Objectives',
      description: 'Goals and objectives. Use "### " headings to group them.',
    },
    {
      kind: 'translatable',
      type: 'markdown',
      name: 'services',
      label: 'What we do',
      description: 'Services, programme areas and regular activities.',
    },
    {
      kind: 'translatable',
      type: 'markdown',
      name: 'structures',
      label: 'Structures',
      description:
        'The bodies the department supervises, its components, its facilities or who it is made up of.',
    },
    {
      kind: 'translatable',
      type: 'textarea',
      name: 'keyFigures',
      label: 'Key figures',
      placeholder: '450+ | Hospitals and health centres\n12 | Healthcare training schools',
      description:
        'One figure per line, written as the number, a vertical bar, then what it counts — for example "450+ | Hospitals and health centres". Shown as a band of large figures near the top of the page. Write the labels in each language; lines without a "|" are ignored.',
    },
    {
      kind: 'translatable',
      type: 'markdown',
      name: 'support',
      label: 'Support our work',
      description:
        'Optional. What the department needs and how partners can help. Shown as a call to action near the end of the page.',
    },
    {
      kind: 'translatable',
      type: 'text',
      name: 'coverage',
      label: 'Coverage',
      placeholder: 'All 10 regions of Cameroon',
      description: 'Optional. Where the department works.',
    },
    {
      kind: 'translatable',
      type: 'text',
      name: 'location',
      label: 'Based in',
      placeholder: 'CEPCA headquarters, Yaoundé',
    },
    {
      kind: 'translatable',
      type: 'text',
      name: 'headTitle',
      label: "Head's title",
      placeholder: 'Executive Secretary',
      description: 'Shown under the name of the head of department.',
    },
    {
      kind: 'plain',
      type: 'text',
      name: 'acronym',
      label: 'Acronym',
      required: true,
      placeholder: 'DS',
      description: "The department's short code, shown as its mark.",
    },
    {
      kind: 'plain',
      type: 'text',
      name: 'slug',
      label: 'Page address',
      placeholder: 'health',
      description:
        'The end of the public address — "health" gives /departments/health. Leave blank to build it from the English name.',
    },
    {
      kind: 'plain',
      type: 'number',
      name: 'sortOrder',
      label: 'Position',
      placeholder: '1',
      description: 'Order on the departments page and the home page — 1 comes first.',
    },
    {
      kind: 'plain',
      type: 'image',
      name: 'logo',
      label: 'Logo',
      description: 'Optional. Without one, the acronym is used as the mark.',
    },
    {
      kind: 'plain',
      type: 'image',
      name: 'coverImage',
      label: 'Cover photo',
      description: 'Optional. A wide photograph shown under the title.',
    },
    {
      kind: 'plain',
      type: 'text',
      name: 'headName',
      label: 'Head of department',
      placeholder: 'Rev. Jane Doe',
      description: 'Full name with title. The leadership card only appears once this is filled in.',
    },
    { kind: 'plain', type: 'image', name: 'headPhoto', label: "Head's photo" },
    {
      kind: 'plain',
      type: 'gallery',
      name: 'images',
      label: 'Photo gallery',
      description: 'Photographs of the department at work, shown as a gallery on its page.',
    },
    {
      kind: 'plain',
      type: 'text',
      name: 'phone',
      label: 'Phone',
      placeholder: '+237 6XX XXX XXX',
      description: 'Separate several numbers with " / ".',
    },
    { kind: 'plain', type: 'text', name: 'email', label: 'Email' },
    { kind: 'plain', type: 'text', name: 'address', label: 'Postal address' },
    { kind: 'plain', type: 'url', name: 'website', label: 'Website' },
  ],
};

/**
 * Fields only the council sets: the public address, the mark and the running
 * order. A department account's editor leaves them out, and the server drops
 * them from anything a department account submits.
 */
export const COUNCIL_ONLY_DEPARTMENT_FIELDS = ['slug', 'acronym', 'sortOrder'];

/** The profile editor as a department account sees it. */
export const departmentProfileConfig: ResourceConfig = {
  ...departmentConfig,
  adminPath: '/admin/my-department',
  fields: departmentConfig.fields.filter(
    (field) => !COUNCIL_ONLY_DEPARTMENT_FIELDS.includes(field.name)
  ),
};

export const ACTIVITY_KINDS = [
  { value: 'event', label: 'Event' },
  { value: 'activity', label: 'Activity report' },
  { value: 'project', label: 'Project' },
] as const;

/**
 * An event, activity report or project posted by a department to its own
 * page. `adminPath` differs by who is editing — see `activityConfigFor`.
 */
export const departmentActivityConfig: ResourceConfig = {
  key: 'department-activities',
  singular: 'Activity',
  plural: 'Events & Activities',
  adminPath: '/admin/my-department/activities',
  publicPath: '/departments',
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
      placeholder: 'Regional training for health coordinators',
    },
    {
      kind: 'translatable',
      type: 'textarea',
      name: 'summary',
      label: 'Summary',
      required: true,
      description: 'One or two sentences for the card on the department page.',
    },
    {
      kind: 'translatable',
      type: 'markdown',
      name: 'body',
      label: 'Full account',
      description:
        'Optional. The programme of an event, the report of an activity, or the detail of a project.',
    },
    {
      kind: 'translatable',
      type: 'text',
      name: 'location',
      label: 'Place',
      placeholder: 'Maroua, Far North Region',
    },
    {
      kind: 'plain',
      type: 'select',
      name: 'kind',
      label: 'Type',
      required: true,
      options: ACTIVITY_KINDS.map((kind) => ({ ...kind })),
      description:
        'An event appears under "Upcoming events" until its date has passed, then with the activities. A report is something the department has already done.',
    },
    {
      kind: 'plain',
      type: 'date',
      name: 'date',
      label: 'Date',
      required: true,
      description:
        'The day of the event, the day the activity took place, or the day a project starts.',
    },
    {
      kind: 'plain',
      type: 'date',
      name: 'endDate',
      label: 'End date',
      description: 'Optional. For anything that runs over several days, or a project.',
    },
    { kind: 'plain', type: 'time', name: 'time', label: 'Start time' },
    {
      kind: 'plain',
      type: 'image',
      name: 'imageUrl',
      label: 'Cover image',
      description: 'Shown on the card and at the head of the page.',
    },
    {
      kind: 'plain',
      type: 'gallery',
      name: 'images',
      label: 'Photos',
      description: 'Photographs of the event or activity, shown as a gallery on its page.',
    },
  ],
};

/** The activity editor, pointed at the list it belongs to. */
export function activityConfigFor(adminPath: string): ResourceConfig {
  return { ...departmentActivityConfig, adminPath };
}

/**
 * The board of CEPCA, drawn as the organogram on /board. `office` decides the
 * row; `sortOrder` the place within it. The General Secretary's photo and name
 * also head /about/general-secretariat.
 */
export const boardMemberConfig: ResourceConfig = {
  key: 'board',
  singular: 'Board member',
  plural: 'Board of CEPCA',
  adminPath: '/admin/board',
  publicPath: '/board',
  titleField: 'name',
  orderBy: { sortOrder: 'asc' },
  alsoRevalidate: ['/about/general-secretariat'],
  fields: [
    {
      kind: 'plain',
      type: 'text',
      name: 'name',
      label: 'Full name',
      required: true,
      placeholder: 'Rev Sokeng Alain Clément',
      description: 'With the title they use, exactly as it should appear on the site.',
    },
    {
      kind: 'plain',
      type: 'select',
      name: 'office',
      label: 'Place in the organogram',
      required: true,
      options: BOARD_OFFICES.map(({ value, label }) => ({ value, label })),
      description:
        'Which row of the chart the box sits in. The departments always hang below the General Secretary.',
    },
    {
      kind: 'translatable',
      type: 'text',
      name: 'title',
      label: 'Title',
      required: true,
      placeholder: 'Second Vice-President',
      description: 'The office as written on the box, e.g. President of CEPCA.',
    },
    {
      kind: 'translatable',
      type: 'text',
      name: 'detail',
      label: 'Other office',
      placeholder: 'General Superintendent, Full Gospel Mission (MPE)',
      description: 'Optional. A second line under the name, such as the church they lead.',
    },
    {
      kind: 'plain',
      type: 'image',
      name: 'photo',
      label: 'Photo',
      description:
        'Optional. A clear portrait; the chart centres it on the face automatically. Without one, the box shows an icon.',
    },
    {
      kind: 'plain',
      type: 'text',
      name: 'link',
      label: 'Link',
      format: 'link',
      placeholder: '/members/mpe',
      description:
        'Optional. The page the box opens: a page on this site such as /members/mpe, or a full https:// address.',
    },
    {
      kind: 'plain',
      type: 'number',
      name: 'sortOrder',
      label: 'Order in the row',
      placeholder: '1',
      description: 'Left to right within the same row — 1 comes first.',
    },
  ],
};

export const RESOURCE_CONFIGS: ResourceConfig[] = [
  eventConfig,
  announcementConfig,
  workshopConfig,
  charityConfig,
  sermonConfig,
  boardMemberConfig,
];
