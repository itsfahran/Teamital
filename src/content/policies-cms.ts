import { COOKIE_POLICY, POLICY_LAST_UPDATED, PRIVACY_POLICY, SECURITY_POLICY, TERMS_AND_CONDITIONS, type PolicyBlock } from './policies';

/** CMS documents for the four legal pages (Admin → Site content → Privacy Policy, Terms, Cookies, Security). */
export type PolicyCmsBlock = { type: 'heading' | 'paragraph' | 'list'; text: string; items: string[] };

const toBlock = (b: PolicyBlock): PolicyCmsBlock =>
  b.t === 'h' ? { type: 'heading', text: b.text, items: [] } : b.t === 'p' ? { type: 'paragraph', text: b.text, items: [] } : { type: 'list', text: '', items: b.items };

const doc = (title: string, description: string, subtitle: string, chips: [string, string], blocks: PolicyBlock[]) => ({
  seo: { title: `${title} | Teamital`, description },
  title,
  subtitle,
  lastUpdated: POLICY_LAST_UPDATED,
  chipA: chips[0],
  chipB: chips[1],
  labels: {
    pill: 'Legal',
    lastUpdated: 'Last updated',
    sections: 'sections',
    minRead: 'min read',
    contactTitle: 'Questions about this policy?',
    contactText: 'Our team is happy to help. Reach us at contact@teamital.com.',
    contactButton: 'Contact us',
    moreTitle: 'More from Teamital Legal',
  },
  blocks: blocks.map(toBlock),
});

export const POLICY_DOCS = {
  'privacy-policy': doc('Privacy Policy', 'How Teamital handles personal data under GDPR.', 'How Teamital collects, uses, stores and protects personal data, and the rights you have over it.', ['Your data', 'Your rights'], PRIVACY_POLICY),
  'terms-and-conditions': doc('Terms & Conditions', 'Terms for using Teamital.', 'The rules for using the Teamital website, apps and services.', ['Clear terms', 'Fair use'], TERMS_AND_CONDITIONS),
  'cookie-policy': doc('Cookie Policy', 'How Teamital uses cookies and similar technologies.', 'How and why we use cookies and similar technologies.', ['Transparent', 'Your choices'], COOKIE_POLICY),
  'security-policy': doc('Security Policy', 'How Teamital protects customer and workforce data.', 'The technical and organisational measures that protect your data.', ['Protection', 'Access control'], SECURITY_POLICY),
};

export type PolicyDocKey = keyof typeof POLICY_DOCS;
export type PolicyDoc = (typeof POLICY_DOCS)[PolicyDocKey];
