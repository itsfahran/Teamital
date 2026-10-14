import { CHROME, CHROME_PAGE_KEY } from './chrome';
import { HOME, HOME_PAGE_KEY } from './home';
import { ADMIN_UI, ADMIN_UI_KEY } from './admin-ui';
import { BLOG, BLOG_PAGE_KEY } from './blog';
import { LEAD_SETTINGS, LEAD_SETTINGS_KEY } from './lead-settings';
import { BOOK_CALL, BOOK_CALL_KEY } from './book-call';
import { DELETE_ACCOUNT, DELETE_ACCOUNT_KEY } from './delete-account';
import { GUIDES_DOC, GUIDES_PAGE_KEY } from './guides';
import { ABOUT, CAREERS, CONTACT, FEATURES, HOW_IT_WORKS, PAGE_KEYS, PRICING_PAGE } from './pages';
import { POLICY_DOCS } from './policies-cms';
import { WL, WL_PAGE_KEY } from './white-label';

/** Pages whose content is editable from Admin → Site content. Add a page here after moving its text into a defaults object. */
export type ContentPage = {
  key: string;
  label: string;
  route: string;
  description: string;
  icon: string;
  defaults: unknown;
  /** Friendly names for sections/fields, keyed by dotted path (e.g. "hero.pill"). */
  labels?: Record<string, string>;
};

export const CONTENT_PAGES: ContentPage[] = [
  {
    key: HOME_PAGE_KEY,
    label: "Home",
    route: "/",
    description: "Hero, chat mockup, features, how it works, roles, security, testimonials, FAQ and closing call to action.",
    icon: "home",
    defaults: HOME,
    labels: {
      seo: "SEO: search engine title & description",
      hero: "Hero section",
      "hero.badge": "Badge text",
      "hero.typewriter": "Animated phrases (typewriter)",
      "hero.trust": "Trust points",
      "hero.image": "Hero image (replaces the animated chat mockup)",
      "hero.availableLabel": "Platforms label",
      heroChat: "Hero chat mockup",
      "heroChat.avatar": "Chat avatar image",
      "heroChat.messages": "Chat messages (kind: in, out or card)",
      "heroChat.gps": "Floating GPS card",
      "heroChat.timer": "Floating timer card",
      "heroChat.chart": "Floating chart card",
      features: "Features",
      "features.items": "Feature cards",
      howItWorks: "How it works",
      "howItWorks.steps": "Steps",
      roles: "Roles",
      "roles.items": "Role cards",
      security: "Security",
      "security.points": "Security points",
      testimonials: "Testimonials",
      "testimonials.items": "Quotes",
      whyUs: "Why teams switch",
      "whyUs.items": "Reasons",
      toolkit: "Toolkit",
      "toolkit.chips": "Toolkit chips",
      stats: "Stats band",
      "stats.items": "Stats",
      faq: "FAQ",
      "faq.items": "Questions",
      cta: "Closing call to action",
      variants: "Alternative layouts (used by Custom pages → home and custom pages)",
      "variants.hero": "Alternative hero layouts",
      "variants.dashboardCard": "Dashboard hero card",
      "variants.opsBoard": "Operations board",
      "variants.h2": "Features section (alternative layouts)",
      "variants.h3": "How-it-works section (alternative layouts)",
      "variants.slots": "Section variants (slots 4 to 10)",
    },
  },
  {
    key: WL_PAGE_KEY,
    label: 'White Label Program',
    route: '/white-label-program',
    description: 'Hero, packages, partner portal, solutions, FAQ and every section of the white label page.',
    icon: 'handshake',
    defaults: WL,
    labels: {
      seo: "SEO: search engine title & description",
      hero: "Hero section",
      "hero.pill": "Badge text",
      "hero.image": "Hero image (replaces the animated visual)",
      "hero.trust": "Trust points",
      "hero.primary": "Primary button text",
      "hero.secondary": "Secondary button text",
      visual: "Hero animation texts (browser mockup)",
      "visual.nav": "Mockup menu",
      "visual.stats": "Mockup numbers",
      labels: "Small labels (hover hints)",
      build: "Build your brand",
      "build.pillars": "Three pillars",
      why: "Why choose",
      "why.cards": "Benefit cards",
      portal: "Partner portal",
      "portal.navTitle": "Side list heading",
      "portal.items": "Portal features",
      solutions: "Solutions under your brand",
      "solutions.admin": "Company admin profile",
      "solutions.employee": "Employee profile",
      "solutions.admin.features": "Admin features",
      "solutions.employee.features": "Employee features",
      "solutions.oneTitle": "Banner heading",
      "solutions.onePara": "Banner paragraphs",
      who: "Who can start",
      "who.cards": "Audience cards",
      launch: "How to launch",
      "launch.steps": "Steps",
      faq: "FAQ",
      "faq.items": "Questions",
      packages: "Packages (pricing cards)",
      "packages.monthly": "Monthly packages",
      "packages.yearly": "Yearly packages",
      final: "Final call to action",
    },
  },
];

const SEO = 'SEO: search engine title & description';
const STATIC_LABELS = { seo: SEO, image: 'Image (optional, shown above the text)', paragraphs: 'Paragraphs' };

CONTENT_PAGES.push(
  {
    key: CHROME_PAGE_KEY,
    label: "Header & footer",
    route: "/",
    description: "Navbar menus and buttons, footer text, link columns, social links and copyright. Shown on every page.",
    icon: "web",
    defaults: CHROME,
    labels: {
      header: "Header (navbar)",
      "header.menus": "Dropdown menus",
      booking: "Booking pop-up texts (calendar, form, confirmation, manage page)",
      "booking.steps": "Step names",
      "booking.topics": "Call topics (dropdown)",
      "booking.teamSizes": "Team sizes (dropdown)",
      notFound: "404 page",
      "header.buttons": "Header buttons (show/hide, label and link)",
      "header.buttons.signIn": "Sign In",
      "header.buttons.signUp": "Sign Up",
      "header.buttons.trial": "14-Day Free Trial",
      "header.buttons.demo": "Schedule Demo (opens the booking pop-up when the link is /book-a-call)",
      footer: "Footer",
      "footer.columns": "Link columns",
      "footer.bottomLinks": "Bottom bar links",
      "footer.social": "Social links (name: linkedin, x, youtube, facebook, instagram, pinterest, tiktok)",
    },
  },
  { key: PAGE_KEYS.howItWorks, label: 'How It Works', route: '/how-it-works', description: 'Page title and the numbered steps.', icon: 'timeline', defaults: HOW_IT_WORKS, labels: { seo: SEO, steps: 'Steps' } },
  { key: PAGE_KEYS.pricing, label: 'Pricing page text', route: '/pricing', description: 'Headings and call-to-action text (plans and prices are managed under Pricing plans).', icon: 'sell', defaults: PRICING_PAGE, labels: { seo: SEO } },
  { key: PAGE_KEYS.contact, label: 'Contact', route: '/contact', description: 'Heading, intro text, image and the contact form labels.', icon: 'mail', defaults: CONTACT, labels: { seo: SEO, form: 'Contact form labels' } },
  { key: PAGE_KEYS.about, label: 'About us', route: '/about', description: 'Title, introduction and paragraphs.', icon: 'info', defaults: ABOUT, labels: STATIC_LABELS },
  { key: PAGE_KEYS.features, label: 'Features', route: '/features', description: 'Title, introduction and feature paragraphs.', icon: 'star', defaults: FEATURES, labels: STATIC_LABELS },
  { key: PAGE_KEYS.careers, label: 'Careers', route: '/careers', description: 'Title, introduction and paragraphs.', icon: 'work', defaults: CAREERS, labels: STATIC_LABELS },
);

const POLICY_LABELS = { seo: SEO, labels: 'Page labels', blocks: 'Content (headings, paragraphs and lists, in order). Numbered headings like "1. Introduction" become the sections.' };

CONTENT_PAGES.push(
  {
    key: BLOG_PAGE_KEY,
    label: 'Blog',
    route: '/blog',
    description: 'Blog page text and every article: title, excerpt, category, date, cover image, key takeaways and the full article body.',
    icon: 'article',
    defaults: BLOG,
    labels: { seo: SEO, hero: 'Blog page header', cta: 'Bottom banner (blog page)', postCta: 'Bottom banner (articles)', posts: 'Articles (slug must be unique and URL-friendly)', 'posts.body': 'Article body' },
  },
  {
    key: GUIDES_PAGE_KEY,
    label: 'Guides',
    route: '/guide',
    description: 'Guides hub, the Company and Employee guides: steps, tips and FAQs.',
    icon: 'menu_book',
    defaults: GUIDES_DOC,
    labels: { seo: SEO, hub: 'Guides hub header', labels: 'Shared labels', cta: 'Bottom banner', companies: 'Guide for Companies', employees: 'Guide for Employees', 'companies.steps': 'Steps', 'employees.steps': 'Steps', 'companies.faqs': 'FAQs', 'employees.faqs': 'FAQs', 'companies.tips': 'Pro tips', 'employees.tips': 'Pro tips' },
  },
  { key: 'privacy-policy', label: 'Privacy Policy', route: '/privacy-policy', description: 'Full legal text, last-updated date and page labels.', icon: 'privacy_tip', defaults: POLICY_DOCS['privacy-policy'], labels: POLICY_LABELS },
  { key: 'terms-and-conditions', label: 'Terms & Conditions', route: '/terms-and-conditions', description: 'Full legal text, last-updated date and page labels.', icon: 'gavel', defaults: POLICY_DOCS['terms-and-conditions'], labels: POLICY_LABELS },
  { key: 'cookie-policy', label: 'Cookie Policy', route: '/cookie-policy', description: 'Full legal text, last-updated date and page labels.', icon: 'cookie', defaults: POLICY_DOCS['cookie-policy'], labels: POLICY_LABELS },
  { key: LEAD_SETTINGS_KEY, label: 'Lead notifications', route: '/admin/leads', description: 'Which email address receives lead-form submissions.', icon: 'forward_to_inbox', defaults: LEAD_SETTINGS, labels: { notifyEmail: 'Send leads to this email (falls back to the booking notification email, then contact@teamital.com)', extraRecipients: 'Extra recipients (also receive every lead)', subjectPrefix: 'Email subject prefix' } },
  { key: ADMIN_UI_KEY, label: 'Admin panel labels', route: '/admin', description: 'Sidebar menu names, dashboard texts and the headings of the admin pages.', icon: 'admin_panel_settings', defaults: ADMIN_UI, labels: { nav: 'Sidebar menu', dashboard: 'Dashboard', pages: 'Page headings' } },
  { key: BOOK_CALL_KEY, label: 'Book a call', route: '/book-a-call', description: 'Text beside the booking calendar (the calendar itself is configured under Availability).', icon: 'event', defaults: BOOK_CALL, labels: { seo: SEO, meta: 'Info chips', points: 'Benefit points' } },
  { key: DELETE_ACCOUNT_KEY, label: 'Delete account', route: '/delete-account', description: 'Account deletion instructions page.', icon: 'person_remove', defaults: DELETE_ACCOUNT, labels: { seo: SEO, blocks: 'Content (headings, paragraphs and lists, in order)', mailAfterBlock: 'Show the email box after block number', mailSubject: 'Email subject line' } },
  { key: 'security-policy', label: 'Security Policy', route: '/security-policy', description: 'Full legal text, last-updated date and page labels.', icon: 'shield', defaults: POLICY_DOCS['security-policy'], labels: POLICY_LABELS },
);

export const getContentPage = (key: string) => CONTENT_PAGES.find((p) => p.key === key);
