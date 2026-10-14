/** Default copy for the smaller marketing pages. Each page is one document in Admin → Site content. */
import { STATIC_PAGES } from './static-pages';

const staticPage = (key: 'about' | 'features' | 'careers', seoTitle: string, seoDescription: string) => ({
  seo: { title: seoTitle, description: seoDescription },
  title: STATIC_PAGES[key].title,
  subtitle: STATIC_PAGES[key].subtitle,
  image: '',
  paragraphs: STATIC_PAGES[key].paragraphs,
});

export const ABOUT = staticPage('about', 'About | Teamital', 'About Teamital workforce intelligence.');
export const FEATURES = staticPage('features', 'Features | Teamital', 'Teamital attendance, GPS, leave and task features.');
export const CAREERS = staticPage('careers', 'Careers | Teamital', 'Careers at Teamital.');
export type StaticPageContent = typeof ABOUT;

export const HOW_IT_WORKS = {
  seo: { title: 'How it works | Teamital', description: 'How Teamital workforce tracking works.' },
  title: 'How It Works',
  subtitle: 'The complete Teamital workflow — from signup to reports.',
  steps: [
    { icon: 'apartment', title: 'Create your company account', text: 'Sign up, name your workspace, and invite the first admin.' },
    { icon: 'group_add', title: 'Add employees', text: 'Invite people by email or add them from the company dashboard.' },
    { icon: 'location_on', title: 'Set attendance rules and locations', text: 'Choose clock-in methods, GPS geofences, and working hours.' },
    { icon: 'fingerprint', title: 'Employees clock in and out', text: 'Teams punch with GPS, face, or biometrics on web and mobile.' },
    { icon: 'insights', title: 'Track attendance and workforce activity', text: 'See who is present, late, or on site from live dashboards.' },
    { icon: 'assignment', title: 'Manage projects and leave', text: 'Assign work, approve time off, and keep one source of truth.' },
    { icon: 'bar_chart', title: 'Generate reports', text: 'Export hours, overtime, and attendance summaries for payroll.' },
  ],
  buttonLabel: 'Create your company account',
};
export type HowItWorksContent = typeof HOW_IT_WORKS;

export const CONTACT = {
  seo: { title: 'Contact | Teamital', description: 'Talk to the Teamital team.' },
  badge: 'Mail us',
  title: 'Contact us',
  text: 'Questions about plans, demos, or onboarding? Send a message — we will reply shortly.',
  emailLabel: 'Email',
  image: '/assets/undraw_questions_52ic.svg',
  form: {
    title: 'Send a message',
    subtitle: 'We typically respond within one business day.',
    nameLabel: 'Your name',
    emailLabel: 'Work email',
    companyLabel: 'Company',
    messageLabel: 'Message',
    submitLabel: 'Submit message',
    successMessage: 'Message sent — we will reply soon.',
    fallbackMessage: 'Opening your email app — send to finish.',
    nameRequired: 'Name is required',
    emailRequired: 'Email is required',
    emailInvalid: 'Enter a valid email',
    messageShort: 'Please write a short message',
  },
};
export type ContactContent = typeof CONTACT;

export const PRICING_PAGE = {
  seo: { title: 'Pricing | Teamital', description: 'Teamital plans for teams of every size.' },
  title: 'Pricing',
  subtitle: 'Same subscription plans as the mobile app — pick Monthly or Yearly.',
  emptyText: 'No plans available right now.',
  ctaTitle: 'Ready to activate a plan?',
  ctaText: 'Sign up, then choose your plan from the company subscription screen.',
  ctaButton: 'Get started',
  planButton: 'Choose plan',
  contactSalesButton: 'Contact sales',
  monthlyTab: 'Monthly',
  yearlyTab: '1 Year',
  popularLabel: 'Popular',
};
export type PricingPageContent = typeof PRICING_PAGE;

export const PAGE_KEYS = {
  about: 'about',
  features: 'features',
  careers: 'careers',
  howItWorks: 'how-it-works',
  contact: 'contact',
  pricing: 'pricing',
} as const;
