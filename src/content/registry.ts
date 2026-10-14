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

export const getContentPage = (key: string) => CONTENT_PAGES.find((p) => p.key === key);
