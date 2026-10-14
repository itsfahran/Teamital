import { CHROME, CHROME_PAGE_KEY } from './chrome';
import { HOME, HOME_PAGE_KEY } from './home';
import { ABOUT, CAREERS, CONTACT, FEATURES, HOW_IT_WORKS, PAGE_KEYS, PRICING_PAGE } from './pages';
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
      "header.scheduleLabel": "Schedule demo button",
      "header.scheduleShortLabel": "Schedule demo button (small screens)",
      "header.trialLabel": "Free trial button",
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

export const getContentPage = (key: string) => CONTENT_PAGES.find((p) => p.key === key);
