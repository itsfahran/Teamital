/** Public site configuration (no secrets). */
export const SITE = {
  displayName: 'Teamital',
  publicSiteUrl: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '') || 'https://teamital.com',
  appUrl: process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, '') || 'https://app.teamital.com',
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'contact@teamital.com',
  socialLinkedIn: 'https://www.linkedin.com/company/teamital/',
  socialX: 'https://x.com/teamital_',
  socialYouTube: 'https://www.youtube.com/@teamital',
  socialFacebook: 'https://www.facebook.com/teamital',
  socialInstagram: 'https://www.instagram.com/teamital_/',
  socialPinterest: 'https://pinterest.com/teamital_/',
  socialTikTok: 'https://www.tiktok.com/@teamital_',
} as const;

export const STORE_LINKS = {
  microsoftStore: 'https://apps.microsoft.com/detail/9p2170pdcn0j',
  playStore: 'https://play.google.com/store/apps/details?id=com.employeetracking.app',
  appStore: 'https://apps.apple.com/us/app/employee-tracking-app/id6775207232',
} as const;

/** Product app pages (sign-in, sign-up, ...) live on the app subdomain. */
const APP_PATHS = ['/sign-in', '/sign-up', '/forgot-password', '/reset-password', '/confirm-signup'];

export function appAbsolute(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${SITE.appUrl}${p}`;
}

export function isAppPath(path: string): boolean {
  const p = path.split('?')[0].split('#')[0];
  return APP_PATHS.some((a) => p === a || p.startsWith(`${a}/`));
}

/**
 * Resolve an internal route or CMS href to a link target.
 * Auth routes go to the app subdomain; everything else stays on this site.
 */
export function resolveHref(href: string): { href: string; external: boolean } {
  const h = href.trim();
  if (/^https?:\/\//i.test(h)) return { href: h, external: true };
  const path = h.startsWith('/') ? h : `/${h}`;
  if (isAppPath(path)) return { href: appAbsolute(path), external: true };
  return { href: path, external: false };
}

export const ROUTES = {
  home: '/',
  signIn: '/sign-in',
  signUp: '/sign-up',
  pricing: '/pricing',
  contact: '/contact',
  privacyPolicy: '/privacy-policy',
  deleteAccount: '/delete-account',
  about: '/about',
  features: '/features',
  security: '/security-policy',
  terms: '/terms-and-conditions',
  cookies: '/cookie-policy',
  careers: '/careers',
  blog: '/blog',
  howItWorks: '/how-it-works',
  guides: '/guide',
  guideCompanies: '/guide/companies',
  guideEmployees: '/guide/employees',
} as const;

/** Slugs handled by dedicated routes: never served from the CMS. */
export const RESERVED_SLUGS = new Set([
  'sign-in', 'sign-up', 'confirm-signup', 'forgot-password', 'pricing', 'contact',
  'privacy-policy', 'delete-account', 'reset-password', 'about', 'features', 'security',
  'security-policy', 'terms', 'terms-and-conditions', 'cookies', 'cookie-policy', 'careers',
  'blog', 'how-it-works', 'home', 'api', 'assets', 'admin', 'login', 'guide',
]);
