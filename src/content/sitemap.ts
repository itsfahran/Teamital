export const SITEMAP_KEY = 'sitemap';

export type SitemapUrl = { url: string; enabled: boolean; changefreq: string; priority: string; lastmod: string };

const u = (url: string, priority = '0.8', changefreq = 'monthly'): SitemapUrl => ({ url, enabled: true, changefreq, priority, lastmod: '' });

/**
 * sitemap.xml managed from the CMS (Admin → Site content → Sitemap).
 * Add a URL under a group and it is published in /sitemap.xml right away.
 */
export const SITEMAP = {
  settings: {
    includeMainPages: true,
    includeBlogPosts: true,
    includeCustomPages: true,
  },
  groups: [
    {
      name: 'Service Pages',
      urls: [u('/features', '0.9', 'weekly'), u('/how-it-works'), u('/pricing', '0.9', 'weekly'), u('/white-label-program', '0.8'), u('/book-a-call', '0.7')],
    },
    {
      name: 'Blog Pages',
      urls: [u('/blog', '0.8', 'weekly')],
    },
  ],
};

export type SitemapContent = typeof SITEMAP;
