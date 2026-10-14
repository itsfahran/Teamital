/** Client-safe helpers for the site-content CMS: merge defaults with overrides, and diff edits back to overrides. */

type Obj = Record<string, unknown>;
export const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);

/**
 * Overlay `override` (what the admin saved) on `defaults` (what ships in code).
 * - objects merge key by key (keys that only exist in the override are ignored)
 * - arrays are replaced by the override; each item is merged with the default item at the same index
 *   (or the last default item, as a template for items the admin added)
 * - values must keep the type of the default
 */
export function mergeContent<T>(defaults: T, override: unknown): T {
  if (override === undefined || override === null) return defaults;
  if (Array.isArray(defaults)) {
    if (!Array.isArray(override)) return defaults;
    const tpl = defaults[defaults.length - 1];
    return override.map((o, i) => {
      const d = i < defaults.length ? defaults[i] : tpl;
      return d === undefined ? o : mergeContent(d, o);
    }) as T;
  }
  if (isObj(defaults)) {
    if (!isObj(override)) return defaults;
    const out: Obj = {};
    for (const k of Object.keys(defaults)) out[k] = k in override ? mergeContent(defaults[k], override[k]) : defaults[k];
    return out as T;
  }
  return typeof override === typeof defaults ? (override as T) : defaults;
}

export const sameValue = (a: unknown, b: unknown): boolean => JSON.stringify(a) === JSON.stringify(b);

/** The smallest override that turns `defaults` into `edited` (undefined when nothing changed). */
export function diffContent(defaults: unknown, edited: unknown): unknown {
  if (sameValue(defaults, edited)) return undefined;
  if (isObj(defaults) && isObj(edited)) {
    const out: Obj = {};
    for (const k of Object.keys(defaults)) {
      const d = diffContent(defaults[k], edited[k]);
      if (d !== undefined) out[k] = d;
    }
    return Object.keys(out).length ? out : undefined;
  }
  return edited;
}

/** True when a string holds HTML produced by the rich-text editor. */
export const looksLikeHtml = (s: string) => /<\/?[a-z][\s\S]*>/i.test(s);

/** Text-only version of a CMS field, for places that cannot hold block HTML (buttons, chips, titles). */
export const plainText = (s: string) =>
  s
    .replace(/<\/(p|div|h[1-6]|li|blockquote)>/gi, ' ')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
