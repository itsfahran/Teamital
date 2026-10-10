import { createPublicSupabase, isSupabaseConfigured } from './supabase/server';

export type CmsBlock = {
  type: string;
  variant: string;
  slot: number | null;
  heading: string;
  body: string;
  buttonLabel: string;
  buttonHref: string;
  button2Label: string;
  button2Href: string;
  imageUrl: string;
  items: string[];
};

export type HomeSlot = {
  slot: number;
  variant: string;
  heading: string;
  body: string;
  button: string;
  button2: string;
  items: string[];
};

export type CmsPageContent = {
  id: string;
  title: string;
  slug: string;
  h1: string;
  body: string;
  metaTitle: string;
  metaDescription: string;
  heroVariant: string;
  buttonLabel: string;
  buttonHref: string;
  button2Label: string;
  button2Href: string;
  h2Variant: string;
  h2Heading: string;
  h2Body: string;
  h2Button: string;
  h2Items: string[];
  h3Variant: string;
  h3Heading: string;
  h3Body: string;
  h3Button: string;
  h3Items: string[];
  slots: Record<number, HomeSlot>;
  blocks: CmsBlock[];
};

type Obj = Record<string, unknown>;
const str = (v: unknown): string => (v == null ? '' : String(v));
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v);

export function blockFromMap(block: Obj): CmsBlock {
  const rawItems = block.items ?? block.faqs;
  const items: string[] = [];
  if (Array.isArray(rawItems)) {
    for (const e of rawItems) {
      if (typeof e === 'string') {
        const t = e.trim();
        if (t) items.push(t);
      } else if (isObj(e)) {
        const title = str(e.title ?? e.q ?? e.name ?? e.label ?? '').trim();
        const text = str(e.text ?? e.a ?? e.quote ?? e.body ?? '').trim();
        if (!title && !text) continue;
        items.push(!text ? title : !title ? text : `${title}|${text}`);
      }
    }
  }
  const slotN = parseInt(str(block.slot), 10);
  return {
    type: str(block.type),
    variant: str(block.variant),
    slot: Number.isNaN(slotN) ? null : slotN,
    heading: str(block.heading ?? block.headline ?? block.label ?? ''),
    body: str(block.body ?? block.subheadline ?? block.description ?? ''),
    buttonLabel: str(block.buttonLabel),
    buttonHref: str(block.buttonHref ?? block.href ?? ''),
    button2Label: str(block.button2Label),
    button2Href: str(block.button2Href),
    imageUrl: str(block.imageUrl ?? block.image_url ?? ''),
    items,
  };
}

export function blockToSlot(b: CmsBlock): HomeSlot {
  return {
    slot: b.slot ?? 4,
    variant: b.variant,
    heading: b.heading,
    body: b.body,
    button: b.buttonLabel,
    button2: b.button2Label,
    items: b.items,
  };
}

function itemList(raw: unknown, objectKeys: boolean): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((e) => {
      if (typeof e === 'string') return e.trim();
      if (objectKeys && isObj(e)) return str(e.title ?? e.text ?? '').trim();
      return '';
    })
    .filter(Boolean);
}

export function pageFromRow(row: Obj, seo: Obj | null): CmsPageContent {
  const content = row.content;
  let body = '';
  let heroVariant = 'split-product';
  let buttonLabel = '', buttonHref = '', button2Label = '', button2Href = '';
  let h2Variant = '', h2Heading = '', h2Body = '', h2Button = '';
  let h2Items: string[] = [];
  let h3Variant = '', h3Heading = '', h3Body = '', h3Button = '';
  let h3Items: string[] = [];
  const slots: Record<number, HomeSlot> = {};
  const blocks: CmsBlock[] = [];

  if (Array.isArray(content) && content.length > 0) {
    let hero: Obj | null = null;
    let h2: Obj | null = null;
    let h3: Obj | null = null;
    for (const block of content) {
      if (!isObj(block)) continue;
      const b = blockFromMap(block);
      if (b.type) blocks.push(b);
      if (block.type === 'hero' && !hero) hero = block;
      if (block.type === 'h2' && !h2) h2 = block;
      if (block.type === 'h3' && !h3) h3 = block;
      if (block.type === 'slot') {
        const n = parseInt(str(block.slot), 10) || 0;
        if (n >= 4 && n <= 10) slots[n] = blockToSlot(b);
      }
    }
    if (!hero && isObj(content[0])) hero = content[0];
    if (hero) {
      body = str(hero.subheadline ?? hero.body ?? hero.headline ?? '');
      const v = str(hero.variant).trim();
      if (v) heroVariant = v;
      buttonLabel = str(hero.buttonLabel);
      buttonHref = str(hero.buttonHref);
      button2Label = str(hero.button2Label);
      button2Href = str(hero.button2Href);
    }
    if (h2) {
      h2Variant = str(h2.variant).trim();
      h2Heading = str(h2.heading ?? h2.headline ?? '');
      h2Body = str(h2.body ?? h2.subheadline ?? '');
      h2Button = str(h2.buttonLabel);
      h2Items = itemList(h2.items, true);
    }
    if (h3) {
      h3Variant = str(h3.variant).trim();
      h3Heading = str(h3.heading ?? h3.headline ?? '');
      h3Body = str(h3.body ?? h3.subheadline ?? '');
      h3Button = str(h3.buttonLabel);
      h3Items = itemList(h3.items, false);
    }
  }

  return {
    id: str(row.id),
    title: str(row.title),
    slug: str(row.slug),
    h1: typeof row.h1 === 'string' ? row.h1 : str(row.title),
    body,
    metaTitle: str(seo?.meta_title),
    metaDescription: str(seo?.meta_description),
    heroVariant,
    buttonLabel, buttonHref, button2Label, button2Href,
    h2Variant, h2Heading, h2Body, h2Button, h2Items,
    h3Variant, h3Heading, h3Body, h3Button, h3Items,
    slots,
    blocks,
  };
}

/** Published CMS page by slug (cached by the route's `revalidate`). Null if absent or Supabase is unconfigured. */
export async function getCmsPage(slug: string): Promise<CmsPageContent | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const db = createPublicSupabase();
    const { data, error } = await db
      .from('cms_pages')
      .select('*, cms_seo(*)')
      .eq('status', 'published')
      .eq('slug', slug)
      .limit(1);
    if (error || !data || data.length === 0) return null;
    const r = data[0] as Obj;
    let seo: Obj | null = null;
    const seoRaw = r.cms_seo;
    if (Array.isArray(seoRaw) && seoRaw.length > 0 && isObj(seoRaw[0])) seo = seoRaw[0];
    else if (isObj(seoRaw)) seo = seoRaw;
    return pageFromRow(r, seo);
  } catch {
    return null;
  }
}

export type SubscriptionPlan = Record<string, unknown>;

export async function getPlans(): Promise<SubscriptionPlan[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const db = createPublicSupabase();
    let res = await db.from('subscription_plans').select('*').eq('is_active', true).order('price');
    if (res.error) res = await db.from('subscription_plans').select('*').order('price');
    return (res.data as SubscriptionPlan[] | null) ?? [];
  } catch {
    return [];
  }
}
