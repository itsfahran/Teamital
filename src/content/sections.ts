/**
 * Page-builder sections. Every section type has 4 design variants; the admin picks one per section
 * and edits the content (the same `data` shape works for every variant of a type).
 */
export type SectionType = 'hero' | 'features' | 'content' | 'benefits' | 'cta' | 'faq' | 'testimonials' | 'leadform';

export type SectionBlock = {
  id: string;
  type: SectionType;
  variant: string;
  data: Record<string, unknown>;
};

/** Wireframe box for the variant picker: [x, y, w, h, kind] in a 100 x 60 box. */
export type ThumbBox = [number, number, number, number, 'text' | 'title' | 'img' | 'btn' | 'card' | 'dark' | 'line'];

export type VariantDef = { id: string; label: string; description: string; thumb: ThumbBox[] };

export type SectionDef = {
  type: SectionType;
  label: string;
  icon: string;
  description: string;
  variants: VariantDef[];
  defaults: () => Record<string, unknown>;
  /** Friendly names for editor fields, keyed by dotted path. */
  labels?: Record<string, string>;
};

const T: ThumbBox = [0, 0, 0, 0, 'text'];
void T;

/* ───────────── default content ───────────── */

const hero = () => ({
  eyebrow: 'Workforce intelligence',
  title: 'Track attendance, GPS and hours in one place',
  subtitle: 'Clock in with GPS and biometrics, manage leave and tasks, and see live workforce insights on every device.',
  primaryLabel: 'Start free trial',
  primaryHref: '/sign-up',
  secondaryLabel: 'Schedule demo',
  secondaryHref: '/book-a-call',
  image: '',
  imageAlt: '',
  bullets: ['No credit card required', '14-day free trial', 'Cancel anytime'],
  stats: [
    { value: '99.9%', label: 'Uptime' },
    { value: '4', label: 'Platforms' },
    { value: '24/7', label: 'Live data' },
  ],
});

const features = () => ({
  eyebrow: 'Features',
  title: 'Everything your team needs',
  sub: 'One product for attendance, tasks, leave and insights.',
  items: [
    { icon: 'fingerprint', title: 'Trusted clock-in', text: 'Face, fingerprint and GPS checks keep attendance honest.', image: '' },
    { icon: 'bar_chart', title: 'Realtime dashboards', text: 'Charts update as your team clocks in and out.', image: '' },
    { icon: 'beach_access', title: 'Leave management', text: 'Requests, balances and approvals in one place.', image: '' },
    { icon: 'task_alt', title: 'Tasks and projects', text: 'Assign work and track progress across teams.', image: '' },
  ],
});

const content = () => ({
  eyebrow: 'About the product',
  title: 'Built for teams that work everywhere',
  text: '<p>Teamital brings attendance, GPS, leave and tasks together so managers see the whole picture without chasing spreadsheets.</p>',
  bullets: ['GPS-verified presence on site', 'Biometric and face checks', 'Reports ready for payroll'],
  image: '',
  imageAlt: '',
  buttonLabel: 'Learn more',
  buttonHref: '/features',
});

const benefits = () => ({
  eyebrow: 'Why Teamital',
  title: 'Clear outcomes for HR and operations',
  sub: 'Less admin, more accurate records and happier teams.',
  items: [
    { icon: 'verified_user', value: '100%', title: 'Honest attendance', text: 'GPS and biometric checks cut buddy punching.' },
    { icon: 'speed', value: '5 min', title: 'Fast setup', text: 'Invite your team and go live the same day.' },
    { icon: 'devices', value: '4', title: 'Every platform', text: 'Web, Android, iOS and desktop share one dataset.' },
    { icon: 'savings', value: '-30%', title: 'Less admin time', text: 'Automatic hours and exports replace manual sheets.' },
  ],
});

const cta = () => ({
  title: 'Ready to track your workforce?',
  text: 'Create your company account in minutes. No credit card required.',
  primaryLabel: 'Start free trial',
  primaryHref: '/sign-up',
  secondaryLabel: 'Talk to our team',
  secondaryHref: '/contact',
  image: '',
});

const faq = () => ({
  eyebrow: 'FAQ',
  title: 'Frequently asked questions',
  sub: 'Everything you need to know to get started.',
  items: [
    { q: 'Does it work on mobile and web?', a: 'Yes. Android, iOS, web and desktop share the same Teamital experience.' },
    { q: 'Can employees clock in with GPS?', a: 'Yes. Admins can require GPS and biometric or face checks for clock-in and clock-out.' },
    { q: 'Is there a company admin dashboard?', a: 'Company admins manage employees, attendance, leave, tasks and reports from the web.' },
    { q: 'Is there a free trial?', a: 'Yes. Every plan starts with a 14-day free trial and no credit card.' },
  ],
});

const testimonials = () => ({
  eyebrow: 'Testimonials',
  title: 'Loved by growing teams',
  sub: 'Simple words from teams who track attendance every day.',
  items: [
    { quote: 'Clock-in finally works for our field team.', name: 'Sara Malik', role: 'Ops Manager', company: 'BuildRight Ltd', avatar: '' },
    { quote: 'Web dashboards help us spot late days early.', name: 'Daniel Byrne', role: 'HR Lead', company: 'Northline', avatar: '' },
    { quote: 'Employees love the leave and chat flow.', name: 'Aisha Khan', role: 'Company Admin', company: 'Brightpath', avatar: '' },
  ],
});

const leadform = () => ({
  eyebrow: 'Get in touch',
  title: 'See Teamital in action',
  text: 'Leave your details and our team will get back to you within one business day.',
  bullets: ['Personal product walkthrough', 'Pricing tailored to your team', 'No obligation'],
  formName: 'Landing page lead form',
  nameLabel: 'Full name',
  emailLabel: 'Work email',
  phoneLabel: 'Phone number',
  companyLabel: 'Company name',
  messageLabel: 'How can we help?',
  showPhone: true,
  showCompany: true,
  showMessage: true,
  submitLabel: 'Request a call back',
  successTitle: 'Thank you!',
  successText: 'We received your details and will be in touch shortly.',
  privacyNote: 'We only use your details to contact you about Teamital.',
});

/* ───────────── wireframes ───────────── */

const split = (flip = false): ThumbBox[] => [
  [flip ? 54 : 6, 14, 40, 5, 'title'],
  [flip ? 54 : 6, 24, 36, 3, 'text'],
  [flip ? 54 : 6, 30, 30, 3, 'text'],
  [flip ? 54 : 6, 40, 14, 6, 'btn'],
  [flip ? 6 : 52, 8, 42, 44, 'img'],
];

export const SECTION_DEFS: SectionDef[] = [
  {
    type: 'hero',
    label: 'Hero',
    icon: 'web_asset',
    description: 'The big opening block with the main headline and buttons.',
    defaults: hero,
    labels: { bullets: 'Trust points', stats: 'Numbers (shown by the Minimal layout)', primaryLabel: 'Primary button text', primaryHref: 'Primary button link', secondaryLabel: 'Secondary button text', secondaryHref: 'Secondary button link', image: 'Image' },
    variants: [
      { id: 'split', label: 'Split with image', description: 'Text on the left, image on the right.', thumb: split() },
      { id: 'centered', label: 'Centered', description: 'Centered headline with the image below.', thumb: [[22, 6, 56, 5, 'title'], [28, 16, 44, 3, 'text'], [38, 23, 24, 6, 'btn'], [18, 33, 64, 22, 'img']] },
      { id: 'gradient', label: 'Gradient banner', description: 'Bold gradient background with a floating image card.', thumb: [[0, 0, 100, 60, 'dark'], [6, 14, 40, 5, 'title'], [6, 24, 34, 3, 'text'], [6, 38, 14, 6, 'btn'], [56, 12, 38, 36, 'card']] },
      { id: 'minimal', label: 'Minimal with numbers', description: 'Text-focused with a row of key numbers.', thumb: [[6, 8, 56, 6, 'title'], [6, 20, 44, 3, 'text'], [6, 27, 14, 6, 'btn'], [6, 42, 20, 10, 'card'], [30, 42, 20, 10, 'card'], [54, 42, 20, 10, 'card']] },
    ],
  },
  {
    type: 'features',
    label: 'Features',
    icon: 'grid_view',
    description: 'A set of feature cards with icons.',
    defaults: features,
    labels: { items: 'Features' },
    variants: [
      { id: 'grid', label: 'Card grid', description: 'Cards in a responsive grid.', thumb: [[30, 4, 40, 4, 'title'], [6, 18, 27, 34, 'card'], [37, 18, 27, 34, 'card'], [68, 18, 27, 34, 'card']] },
      { id: 'list', label: 'Icon list', description: 'Icon rows in two columns.', thumb: [[30, 4, 40, 4, 'title'], [6, 16, 42, 10, 'card'], [52, 16, 42, 10, 'card'], [6, 30, 42, 10, 'card'], [52, 30, 42, 10, 'card']] },
      { id: 'bento', label: 'Bento', description: 'One large feature beside smaller ones.', thumb: [[6, 6, 40, 4, 'title'], [6, 16, 44, 38, 'card'], [54, 16, 40, 11, 'card'], [54, 30, 40, 11, 'card'], [54, 44, 40, 11, 'card']] },
      { id: 'centered', label: 'Centered icons', description: 'Icons and text centered in columns.', thumb: [[30, 4, 40, 4, 'title'], [8, 18, 20, 6, 'img'], [40, 18, 20, 6, 'img'], [72, 18, 20, 6, 'img'], [8, 30, 22, 3, 'text'], [40, 30, 22, 3, 'text'], [72, 30, 22, 3, 'text']] },
    ],
  },
  {
    type: 'content',
    label: 'Content + image',
    icon: 'view_agenda',
    description: 'A text block with an image, bullets and a button.',
    defaults: content,
    labels: { text: 'Description', bullets: 'Bullet points', buttonLabel: 'Button text', buttonHref: 'Button link' },
    variants: [
      { id: 'image-right', label: 'Image right', description: 'Text left, image right.', thumb: split() },
      { id: 'image-left', label: 'Image left', description: 'Image left, text right.', thumb: split(true) },
      { id: 'stacked', label: 'Wide image on top', description: 'Large image above the text.', thumb: [[6, 4, 88, 26, 'img'], [6, 36, 40, 5, 'title'], [6, 46, 60, 3, 'text'], [6, 52, 50, 3, 'text']] },
      { id: 'overlay', label: 'Text over image', description: 'A text card sitting on top of the image.', thumb: [[0, 0, 100, 60, 'img'], [8, 12, 42, 36, 'card'], [12, 18, 30, 4, 'title'], [12, 28, 28, 3, 'text']] },
    ],
  },
  {
    type: 'benefits',
    label: 'Benefits',
    icon: 'workspace_premium',
    description: 'Why customers choose you: outcomes, numbers and advantages.',
    defaults: benefits,
    labels: { items: 'Benefits', value: 'Number (shown by the Stats layout)' },
    variants: [
      { id: 'numbered', label: 'Numbered cards', description: 'Cards with big numbers 01, 02, 03.', thumb: [[30, 4, 40, 4, 'title'], [6, 16, 20, 36, 'card'], [30, 16, 20, 36, 'card'], [54, 16, 20, 36, 'card'], [78, 16, 16, 36, 'card']] },
      { id: 'checklist', label: 'Checklist', description: 'Tick-list in two columns.', thumb: [[6, 6, 40, 4, 'title'], [6, 18, 40, 4, 'line'], [6, 26, 40, 4, 'line'], [54, 18, 40, 4, 'line'], [54, 26, 40, 4, 'line'], [6, 38, 40, 4, 'line'], [54, 38, 40, 4, 'line']] },
      { id: 'stats', label: 'Stats band', description: 'Large numbers on a coloured band.', thumb: [[0, 12, 100, 36, 'dark'], [8, 20, 18, 8, 'title'], [32, 20, 18, 8, 'title'], [56, 20, 18, 8, 'title'], [80, 20, 14, 8, 'title']] },
      { id: 'columns', label: 'Icon columns', description: 'Icon above each benefit.', thumb: [[30, 4, 40, 4, 'title'], [10, 18, 14, 14, 'card'], [38, 18, 14, 14, 'card'], [66, 18, 14, 14, 'card'], [8, 38, 22, 3, 'text'], [36, 38, 22, 3, 'text'], [64, 38, 22, 3, 'text']] },
    ],
  },
  {
    type: 'cta',
    label: 'Call to action',
    icon: 'ads_click',
    description: 'A closing banner that pushes visitors to act.',
    defaults: cta,
    labels: { primaryLabel: 'Primary button text', primaryHref: 'Primary button link', secondaryLabel: 'Secondary button text', secondaryHref: 'Secondary button link', image: 'Image (used by the Split layout)' },
    variants: [
      { id: 'banner', label: 'Gradient banner', description: 'Rounded gradient banner, centered.', thumb: [[6, 8, 88, 44, 'dark'], [26, 18, 48, 5, 'title'], [32, 28, 36, 3, 'text'], [34, 38, 14, 6, 'btn'], [52, 38, 14, 6, 'btn']] },
      { id: 'card', label: 'Light card', description: 'Soft card with buttons on the right.', thumb: [[6, 12, 88, 36, 'card'], [12, 22, 40, 5, 'title'], [12, 32, 34, 3, 'text'], [66, 26, 22, 8, 'btn']] },
      { id: 'split', label: 'Split with image', description: 'Message on one side, image on the other.', thumb: split(true) },
      { id: 'strip', label: 'Compact strip', description: 'A slim full-width strip.', thumb: [[0, 20, 100, 20, 'dark'], [8, 26, 40, 4, 'title'], [70, 26, 22, 8, 'btn']] },
    ],
  },
  {
    type: 'faq',
    label: 'FAQ',
    icon: 'help',
    description: 'Questions and answers.',
    defaults: faq,
    labels: { items: 'Questions' },
    variants: [
      { id: 'accordion', label: 'Accordion', description: 'Centered expandable list.', thumb: [[26, 4, 48, 5, 'title'], [20, 18, 60, 8, 'card'], [20, 30, 60, 8, 'card'], [20, 42, 60, 8, 'card']] },
      { id: 'columns', label: 'Title left, list right', description: 'Heading on the left, questions on the right.', thumb: [[6, 10, 28, 6, 'title'], [6, 22, 26, 3, 'text'], [42, 8, 52, 10, 'card'], [42, 22, 52, 10, 'card'], [42, 36, 52, 10, 'card']] },
      { id: 'cards', label: 'Answer cards', description: 'Every answer visible in a card.', thumb: [[30, 4, 40, 4, 'title'], [6, 16, 42, 16, 'card'], [52, 16, 42, 16, 'card'], [6, 36, 42, 16, 'card'], [52, 36, 42, 16, 'card']] },
      { id: 'numbered', label: 'Numbered list', description: 'Numbered questions with open answers.', thumb: [[6, 6, 40, 5, 'title'], [6, 18, 8, 8, 'btn'], [20, 18, 70, 4, 'line'], [6, 32, 8, 8, 'btn'], [20, 32, 70, 4, 'line'], [6, 46, 8, 8, 'btn'], [20, 46, 70, 4, 'line']] },
    ],
  },
  {
    type: 'testimonials',
    label: 'Testimonials',
    icon: 'format_quote',
    description: 'Customer quotes.',
    defaults: testimonials,
    labels: { items: 'Testimonials', avatar: 'Photo' },
    variants: [
      { id: 'cards', label: 'Quote cards', description: 'Three cards side by side.', thumb: [[30, 4, 40, 4, 'title'], [6, 16, 27, 34, 'card'], [37, 16, 27, 34, 'card'], [68, 16, 27, 34, 'card']] },
      { id: 'featured', label: 'Featured quote', description: 'One large quote with the others beside it.', thumb: [[6, 8, 54, 44, 'card'], [66, 8, 28, 20, 'card'], [66, 32, 28, 20, 'card']] },
      { id: 'wall', label: 'Quote wall', description: 'Masonry-style wall of quotes.', thumb: [[6, 6, 27, 24, 'card'], [37, 6, 27, 34, 'card'], [68, 6, 27, 20, 'card'], [6, 34, 27, 20, 'card'], [37, 44, 27, 12, 'card'], [68, 30, 27, 26, 'card']] },
      { id: 'slider', label: 'Slider', description: 'Swipeable row of quotes.', thumb: [[4, 14, 30, 36, 'card'], [38, 14, 30, 36, 'card'], [72, 14, 30, 36, 'card'], [40, 54, 20, 3, 'line']] },
    ],
  },
  {
    type: 'leadform',
    label: 'Lead form',
    icon: 'contact_mail',
    description: 'A contact form. Submissions are emailed to you and saved under Leads.',
    defaults: leadform,
    labels: { formName: 'Form name (shown in the Leads list)', showPhone: 'Ask for phone number', showCompany: 'Ask for company name', showMessage: 'Ask for a message' },
    variants: [
      { id: 'card', label: 'Text + form card', description: 'Pitch on the left, form card on the right.', thumb: [[6, 10, 40, 5, 'title'], [6, 20, 34, 3, 'text'], [6, 27, 30, 3, 'text'], [54, 6, 40, 48, 'card'], [58, 14, 32, 5, 'line'], [58, 24, 32, 5, 'line'], [58, 40, 32, 7, 'btn']] },
      { id: 'centered', label: 'Centered', description: 'Heading above a centered form.', thumb: [[26, 4, 48, 5, 'title'], [34, 12, 32, 3, 'text'], [24, 20, 52, 34, 'card'], [30, 26, 40, 5, 'line'], [30, 36, 40, 5, 'line']] },
      { id: 'dark', label: 'Dark panel', description: 'Dark panel with a light form.', thumb: [[0, 0, 100, 60, 'dark'], [6, 14, 36, 5, 'title'], [6, 24, 30, 3, 'text'], [54, 8, 40, 44, 'card']] },
      { id: 'inline', label: 'Inline bar', description: 'Fields in one horizontal row.', thumb: [[6, 8, 40, 5, 'title'], [6, 18, 50, 3, 'text'], [6, 30, 18, 8, 'line'], [27, 30, 18, 8, 'line'], [48, 30, 18, 8, 'line'], [69, 30, 24, 8, 'btn']] },
    ],
  },
];

export const SECTION_BY_TYPE = Object.fromEntries(SECTION_DEFS.map((d) => [d.type, d])) as Record<SectionType, SectionDef>;

export const newSection = (type: SectionType, variant?: string): SectionBlock => {
  const def = SECTION_BY_TYPE[type];
  return {
    id: `s_${Math.random().toString(36).slice(2, 10)}`,
    type,
    variant: variant && def.variants.some((v) => v.id === variant) ? variant : def.variants[0].id,
    data: JSON.parse(JSON.stringify(def.defaults())) as Record<string, unknown>,
  };
};

/** True when a cms_pages.content array uses the page-builder format. */
export const isBuilderContent = (content: unknown): content is SectionBlock[] =>
  Array.isArray(content) && content.length > 0 && content.every((b) => b && typeof b === 'object' && 'data' in (b as object) && 'type' in (b as object));
