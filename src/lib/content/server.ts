import { unstable_cache } from 'next/cache';
import sanitizeHtml from 'sanitize-html';
import { createPublicSupabase, isSupabaseConfigured } from '../supabase/server';
import { isObj, looksLikeHtml, mergeContent } from './utils';

export const CONTENT_TAG = 'site-content';

const SANITIZE: sanitizeHtml.IOptions = {
  allowedTags: ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'a', 'ul', 'ol', 'li', 'h2', 'h3', 'h4', 'blockquote', 'hr', 'img', 'span', 'mark', 'code', 'pre', 'sub', 'sup'],
  allowedAttributes: {
    a: ['href', 'target', 'rel', 'title'],
    img: ['src', 'alt', 'width', 'height', 'title'],
    '*': ['style'],
  },
  allowedStyles: {
    '*': {
      color: [/^#[0-9a-f]{3,8}$/i, /^rgba?\([\d\s.,%]+\)$/i],
      'background-color': [/^#[0-9a-f]{3,8}$/i, /^rgba?\([\d\s.,%]+\)$/i],
      'text-align': [/^(left|right|center|justify)$/],
    },
  },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  transformTags: { a: (tag, attribs) => ({ tagName: tag, attribs: { ...attribs, ...(attribs.target === '_blank' ? { rel: 'noopener noreferrer' } : {}) } }) },
};

/** Cleans every HTML string in the tree (rich-text fields); plain strings pass through untouched. */
export function sanitizeTree<T>(v: T): T {
  if (typeof v === 'string') return (looksLikeHtml(v) ? sanitizeHtml(v, SANITIZE) : v) as T;
  if (Array.isArray(v)) return v.map(sanitizeTree) as T;
  if (isObj(v)) return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, sanitizeTree(x)])) as T;
  return v;
}

const fetchRow = unstable_cache(
  async (pageKey: string): Promise<unknown> => {
    const { data } = await createPublicSupabase().from('site_content').select('data').eq('page_key', pageKey).maybeSingle();
    return data?.data ?? null;
  },
  ['site-content-row'],
  { tags: [CONTENT_TAG], revalidate: 60 },
);

/** The page's content: code defaults overlaid with whatever the admin saved (sanitised). */
export async function getSiteContent<T>(pageKey: string, defaults: T): Promise<T> {
  if (!isSupabaseConfigured()) return defaults;
  try {
    const override = await fetchRow(pageKey);
    return override ? sanitizeTree(mergeContent(defaults, override)) : defaults;
  } catch {
    return defaults;
  }
}

/** Same as getSiteContent but never cached (admin editor, previews). */
export async function getSiteContentFresh<T>(pageKey: string, defaults: T): Promise<{ content: T; override: unknown }> {
  if (!isSupabaseConfigured()) return { content: defaults, override: null };
  const { data } = await createPublicSupabase().from('site_content').select('data').eq('page_key', pageKey).maybeSingle();
  const override = data?.data ?? null;
  return { content: override ? mergeContent(defaults, override) : defaults, override };
}
