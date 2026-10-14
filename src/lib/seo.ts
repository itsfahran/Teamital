import type { Metadata } from 'next';
import { getCmsPage, type CmsPageContent } from './cms';
import { SITE } from './config';

const BRAND = 'Teamital';
const DEFAULT_DESCRIPTION =
  'Complete workforce intelligence in one place — attendance, GPS, leave, tasks and live insights.';

/** Static per-route defaults (port of WebSeo._defaults). */
const DEFAULTS: Record<string, [string, string]> = {
  '/': [`${BRAND} — Complete Workforce Intelligence in One Place`, DEFAULT_DESCRIPTION],
  '/pricing': [`Pricing | ${BRAND}`, 'Teamital plans for teams of every size.'],
  '/contact': [`Contact | ${BRAND}`, 'Talk to the Teamital team.'],
  '/privacy-policy': [`Privacy Policy | ${BRAND}`, 'How Teamital handles personal data under GDPR.'],
  '/delete-account': [`Delete account | ${BRAND}`, 'How to request deletion of your Teamital account.'],
  '/about': [`About | ${BRAND}`, 'About Teamital workforce intelligence.'],
  '/features': [`Features | ${BRAND}`, 'Teamital attendance, GPS, leave and task features.'],
  '/security-policy': [`Security Policy | ${BRAND}`, 'How Teamital protects customer and workforce data.'],
  '/terms-and-conditions': [`Terms & Conditions | ${BRAND}`, 'Terms for using Teamital.'],
  '/cookie-policy': [`Cookie Policy | ${BRAND}`, 'How Teamital uses cookies and similar technologies.'],
  '/careers': [`Careers | ${BRAND}`, 'Careers at Teamital.'],
  '/blog': [`Blog | ${BRAND}`, 'Guides on attendance, GPS and HR ops.'],
  '/how-it-works': [`How it works | ${BRAND}`, 'How Teamital workforce tracking works.'],
  '/white-label-program': [`White Label Workforce Management Software | ${BRAND}`, 'Launch your own SaaS business with Teamital white label workforce management software: your brand, your pricing, your customers.'],
  '/book-a-call': [`Book a free 1:1 call | ${BRAND}`, 'Book a free 30-minute call with the Teamital team: product walkthrough, pricing and onboarding questions.'],
  '/guide': [`Guides | ${BRAND}`, 'Step-by-step guides for companies and employees using Teamital.'],
  '/guide/companies': [`Guide for Companies | ${BRAND}`, 'How to set up Teamital for your company: employees, attendance rules, shifts, leave and reports.'],
  '/guide/employees': [`Guide for Employees | ${BRAND}`, 'How employees use Teamital: clock in and out, hours, leave, tasks and chat.'],
};

function fromCms(page: CmsPageContent): [string, string] {
  const title = page.metaTitle.trim()
    ? page.metaTitle.trim()
    : page.title.trim()
      ? `${page.title.trim()} | ${BRAND}`
      : `${BRAND} — Workforce Intelligence`;
  const desc = page.metaDescription.trim()
    ? page.metaDescription.trim()
    : page.h1.trim()
      ? page.h1.trim()
      : DEFAULT_DESCRIPTION;
  return [title, desc];
}

function build(path: string, title: string, description: string): Metadata {
  const url = path === '/' ? SITE.publicSiteUrl : `${SITE.publicSiteUrl}${path}`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: 'website' },
  };
}

/** Metadata for a route; CMS SEO (when a published page exists) wins over the static defaults. */
export async function metadataFor(path: string, cmsSlug?: string, seo?: { title?: string; description?: string }): Promise<Metadata> {
  if (cmsSlug) {
    const page = await getCmsPage(cmsSlug);
    if (page) {
      const [t, d] = fromCms(page);
      return build(path, t, d);
    }
  }
  const [t, d] = DEFAULTS[path] ?? [`${SITE.displayName} — Workforce Intelligence`, DEFAULT_DESCRIPTION];
  return build(path, seo?.title?.trim() || t, seo?.description?.trim() || d);
}
