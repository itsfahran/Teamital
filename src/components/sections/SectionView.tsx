import type { SectionBlock } from '@/content/sections';
import { plainText } from '@/lib/content/utils';
import { RichText } from '../RichText';
import { Icon, SmartLink, cx } from '../ui';
import { LeadForm, type LeadFormData } from './LeadForm';

/* ───────────── helpers ───────────── */

type D = Record<string, unknown>;
const s = (v: unknown) => (typeof v === 'string' ? v : '');
const arr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);
const strs = (v: unknown) => arr<unknown>(v).map(s).filter(Boolean);
const o = (v: unknown): D => (v && typeof v === 'object' ? (v as D) : {});

function Img({ src, alt, className }: { src: string; alt?: string; className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img className={className} src={src} alt={alt ?? ''} loading="lazy" />;
}

/** Image from the CMS, or a tidy placeholder card so a page still looks finished without one. */
function Visual({ src, alt, icon = 'insights' }: { src: string; alt?: string; icon?: string }) {
  if (src) return <Img src={src} alt={alt} className="sx-img" />;
  return (
    <div className="sx-ph" aria-hidden="true">
      <span className="sx-ph-glow" />
      <Icon name={icon} size={88} color="#fff" />
    </div>
  );
}

function Head({ eyebrow, title, sub, center = true, light = false }: { eyebrow?: string; title?: string; sub?: string; center?: boolean; light?: boolean }) {
  if (!eyebrow && !title && !sub) return null;
  return (
    <header className={cx('sx-head', center && 'sx-head-center', light && 'sx-head-light')}>
      {eyebrow && <span className="sx-eyebrow">{eyebrow}</span>}
      {title && <h2>{title}</h2>}
      {sub && <RichText value={sub} />}
    </header>
  );
}

function Buttons({ d, a = 'primary', b = 'ghost', pk = 'primary', sk = 'secondary' }: { d: D; a?: string; b?: string; pk?: string; sk?: string }) {
  const pl = s(d[`${pk}Label`]);
  const sl = s(d[`${sk}Label`]);
  if (!pl && !sl) return null;
  return (
    <div className="sx-btns">
      {pl && (
        <SmartLink href={s(d[`${pk}Href`]) || '#'} className={cx('hero-btn', `hero-btn-${a}`)}>
          <span>{pl}</span>
          <Icon name="arrow_forward" size={20} color={a === 'primary' ? '#fff' : '#1A56DB'} className="hero-btn-arrow" />
        </SmartLink>
      )}
      {sl && (
        <SmartLink href={s(d[`${sk}Href`]) || '#'} className={cx('hero-btn', `hero-btn-${b}`)}>
          {sl}
        </SmartLink>
      )}
    </div>
  );
}

const Ticks = ({ items, dark = false }: { items: string[]; dark?: boolean }) =>
  items.length ? (
    <ul className={cx('sx-ticks', dark && 'sx-ticks-dark')}>
      {items.map((t, i) => (
        <li key={i}>
          <Icon name="check_circle" size={18} color={dark ? '#6EE7B7' : '#10B981'} />
          {t}
        </li>
      ))}
    </ul>
  ) : null;

/* ───────────── hero ───────────── */

function Hero({ d, v }: { d: D; v: string }) {
  const stats = arr<D>(d.stats);
  const copy = (light: boolean) => (
    <div className="sx-copy">
      {s(d.eyebrow) && <span className={cx('sx-eyebrow', light && 'sx-eyebrow-light')}>{s(d.eyebrow)}</span>}
      <h1>{s(d.title)}</h1>
      <RichText className="sx-lead" value={s(d.subtitle)} />
      <Buttons d={d} a={light ? 'light' : 'primary'} b={light ? 'glass' : 'ghost'} />
      <Ticks items={strs(d.bullets)} dark={light} />
    </div>
  );
  if (v === 'centered')
    return (
      <section className="sx sx-hero sx-hero-centered">
        <div className="sx-in">
          {copy(false)}
          {(s(d.image) || true) && <div className="sx-hero-media"><Visual src={s(d.image)} alt={s(d.imageAlt)} /></div>}
        </div>
      </section>
    );
  if (v === 'gradient')
    return (
      <section className="sx sx-hero sx-hero-gradient">
        <div className="sx-in sx-two">
          {copy(true)}
          <div className="sx-float-card">
            <Visual src={s(d.image)} alt={s(d.imageAlt)} />
          </div>
        </div>
      </section>
    );
  if (v === 'minimal')
    return (
      <section className="sx sx-hero sx-hero-minimal">
        <div className="sx-in">
          {copy(false)}
          {stats.length > 0 && (
            <div className="sx-stats-row">
              {stats.map((st, i) => (
                <div key={i}>
                  <b>{s(st.value)}</b>
                  <span>{s(st.label)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    );
  return (
    <section className="sx sx-hero sx-hero-split">
      <div className="sx-in sx-two">
        {copy(false)}
        <div className="sx-hero-media">
          <Visual src={s(d.image)} alt={s(d.imageAlt)} />
        </div>
      </div>
    </section>
  );
}

/* ───────────── features ───────────── */

function Features({ d, v }: { d: D; v: string }) {
  const items = arr<D>(d.items);
  const icon = (it: D, big = false) =>
    s(it.image) ? (
      <Img src={s(it.image)} className="sx-feat-img" />
    ) : (
      <span className={cx('sx-tile', big && 'sx-tile-big')}>
        <Icon name={s(it.icon) || 'star'} size={big ? 32 : 24} />
      </span>
    );
  const head = <Head eyebrow={s(d.eyebrow)} title={s(d.title)} sub={s(d.sub)} />;

  if (v === 'list')
    return (
      <section className="sx sx-features sx-features-list sx-tint">
        <div className="sx-in">
          {head}
          <div className="sx-rows">
            {items.map((it, i) => (
              <div className="sx-row" key={i}>
                {icon(it)}
                <div>
                  <h3>{s(it.title)}</h3>
                  <RichText value={s(it.text)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  if (v === 'bento')
    return (
      <section className="sx sx-features">
        <div className="sx-in">
          {head}
          <div className="sx-bento">
            {items.map((it, i) => (
              <div className={cx('sx-bento-card', i === 0 && 'sx-bento-main')} key={i}>
                {icon(it, i === 0)}
                <h3>{s(it.title)}</h3>
                <RichText value={s(it.text)} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  if (v === 'centered')
    return (
      <section className="sx sx-features sx-features-centered">
        <div className="sx-in">
          {head}
          <div className="sx-cols">
            {items.map((it, i) => (
              <div className="sx-col" key={i}>
                {icon(it, true)}
                <h3>{s(it.title)}</h3>
                <RichText value={s(it.text)} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  return (
    <section className="sx sx-features sx-tint">
      <div className="sx-in">
        {head}
        <div className="sx-grid">
          {items.map((it, i) => (
            <div className="sx-card" key={i}>
              {icon(it)}
              <h3>{s(it.title)}</h3>
              <RichText value={s(it.text)} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── content + image ───────────── */

function ContentImage({ d, v }: { d: D; v: string }) {
  const text = (
    <div className="sx-copy">
      {s(d.eyebrow) && <span className="sx-eyebrow">{s(d.eyebrow)}</span>}
      {s(d.title) && <h2>{s(d.title)}</h2>}
      <RichText className="sx-lead" value={s(d.text)} />
      <Ticks items={strs(d.bullets)} />
      {s(d.buttonLabel) && (
        <div className="sx-btns">
          <SmartLink href={s(d.buttonHref) || '#'} className="hero-btn hero-btn-primary">
            <span>{s(d.buttonLabel)}</span>
            <Icon name="arrow_forward" size={20} color="#fff" className="hero-btn-arrow" />
          </SmartLink>
        </div>
      )}
    </div>
  );
  const media = (
    <div className="sx-media">
      <Visual src={s(d.image)} alt={s(d.imageAlt)} icon="photo_library" />
    </div>
  );
  if (v === 'stacked')
    return (
      <section className="sx sx-content sx-content-stacked">
        <div className="sx-in">
          {media}
          {text}
        </div>
      </section>
    );
  if (v === 'overlay')
    return (
      <section className="sx sx-content sx-content-overlay">
        <div className="sx-overlay-bg">
          <Visual src={s(d.image)} alt={s(d.imageAlt)} icon="photo_library" />
        </div>
        <div className="sx-in">
          <div className="sx-overlay-card">{text}</div>
        </div>
      </section>
    );
  return (
    <section className={cx('sx sx-content', v === 'image-left' && 'sx-flip')}>
      <div className="sx-in sx-two">
        {v === 'image-left' ? media : text}
        {v === 'image-left' ? text : media}
      </div>
    </section>
  );
}

/* ───────────── benefits ───────────── */

function Benefits({ d, v }: { d: D; v: string }) {
  const items = arr<D>(d.items);
  const head = (light = false) => <Head eyebrow={s(d.eyebrow)} title={s(d.title)} sub={s(d.sub)} light={light} />;
  if (v === 'checklist')
    return (
      <section className="sx sx-benefits sx-tint">
        <div className="sx-in">
          {head()}
          <div className="sx-check-grid">
            {items.map((it, i) => (
              <div className="sx-check" key={i}>
                <Icon name="check_circle" size={26} color="#10B981" />
                <div>
                  <h3>{s(it.title)}</h3>
                  <RichText value={s(it.text)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  if (v === 'stats')
    return (
      <section className="sx sx-benefits sx-benefits-stats">
        <div className="sx-in">
          {head(true)}
          <div className="sx-bigstats">
            {items.map((it, i) => (
              <div key={i}>
                <b>{s(it.value) || String(i + 1)}</b>
                <h3>{s(it.title)}</h3>
                <span>{plainText(s(it.text))}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  if (v === 'columns')
    return (
      <section className="sx sx-benefits">
        <div className="sx-in">
          {head()}
          <div className="sx-cols">
            {items.map((it, i) => (
              <div className="sx-col" key={i}>
                <span className="sx-tile sx-tile-big">
                  <Icon name={s(it.icon) || 'star'} size={32} />
                </span>
                <h3>{s(it.title)}</h3>
                <RichText value={s(it.text)} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  return (
    <section className="sx sx-benefits">
      <div className="sx-in">
        {head()}
        <div className="sx-grid sx-grid-4">
          {items.map((it, i) => (
            <div className="sx-card sx-card-num" key={i}>
              <span className="sx-num">{String(i + 1).padStart(2, '0')}</span>
              <h3>{s(it.title)}</h3>
              <RichText value={s(it.text)} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── CTA ───────────── */

function Cta({ d, v }: { d: D; v: string }) {
  if (v === 'card')
    return (
      <section className="sx sx-cta">
        <div className="sx-in">
          <div className="sx-cta-card">
            <div>
              <h2>{s(d.title)}</h2>
              <RichText value={s(d.text)} />
            </div>
            <Buttons d={d} />
          </div>
        </div>
      </section>
    );
  if (v === 'split')
    return (
      <section className="sx sx-cta">
        <div className="sx-in sx-two sx-cta-split">
          <div className="sx-copy">
            <h2>{s(d.title)}</h2>
            <RichText className="sx-lead" value={s(d.text)} />
            <Buttons d={d} />
          </div>
          <div className="sx-media">
            <Visual src={s(d.image)} icon="rocket_launch" />
          </div>
        </div>
      </section>
    );
  if (v === 'strip')
    return (
      <section className="sx sx-cta-strip">
        <div className="sx-in sx-strip">
          <div>
            <h2>{s(d.title)}</h2>
            <RichText value={s(d.text)} />
          </div>
          <Buttons d={d} a="light" b="glass" />
        </div>
      </section>
    );
  return (
    <section className="sx sx-cta">
      <div className="sx-in">
        <div className="sx-cta-banner">
          <span className="sx-glow sx-glow-a" />
          <span className="sx-glow sx-glow-b" />
          <h2>{s(d.title)}</h2>
          <RichText value={s(d.text)} />
          <Buttons d={d} a="light" b="glass" />
        </div>
      </div>
    </section>
  );
}

/* ───────────── FAQ ───────────── */

function Faq({ d, v }: { d: D; v: string }) {
  const items = arr<D>(d.items);
  const acc = (it: D, i: number) => (
    <details className="sx-faq-item" key={i}>
      <summary>
        <span>{s(it.q)}</span>
        <span className="sx-faq-plus" aria-hidden="true">
          <Icon name="add" size={22} />
        </span>
      </summary>
      <div className="sx-faq-a">
        <RichText value={s(it.a)} />
      </div>
    </details>
  );
  if (v === 'columns')
    return (
      <section className="sx sx-faq">
        <div className="sx-in sx-faq-cols">
          <Head eyebrow={s(d.eyebrow)} title={s(d.title)} sub={s(d.sub)} center={false} />
          <div className="sx-faq-list">{items.map(acc)}</div>
        </div>
      </section>
    );
  if (v === 'cards')
    return (
      <section className="sx sx-faq sx-tint">
        <div className="sx-in">
          <Head eyebrow={s(d.eyebrow)} title={s(d.title)} sub={s(d.sub)} />
          <div className="sx-grid sx-grid-2">
            {items.map((it, i) => (
              <div className="sx-card" key={i}>
                <h3>{s(it.q)}</h3>
                <RichText value={s(it.a)} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  if (v === 'numbered')
    return (
      <section className="sx sx-faq">
        <div className="sx-in sx-narrow">
          <Head eyebrow={s(d.eyebrow)} title={s(d.title)} sub={s(d.sub)} />
          <ol className="sx-nfaq">
            {items.map((it, i) => (
              <li key={i}>
                <span className="sx-num-dot">{i + 1}</span>
                <div>
                  <h3>{s(it.q)}</h3>
                  <RichText value={s(it.a)} />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  return (
    <section className="sx sx-faq">
      <div className="sx-in sx-narrow">
        <Head eyebrow={s(d.eyebrow)} title={s(d.title)} sub={s(d.sub)} />
        <div className="sx-faq-list">{items.map(acc)}</div>
      </div>
    </section>
  );
}

/* ───────────── testimonials ───────────── */

function Avatar({ it }: { it: D }) {
  if (s(it.avatar)) return <Img src={s(it.avatar)} className="sx-avatar" />;
  return <span className="sx-avatar sx-avatar-ph">{(s(it.name)[0] ?? '?').toUpperCase()}</span>;
}

function Quote({ it, big = false }: { it: D; big?: boolean }) {
  return (
    <figure className={cx('sx-quote', big && 'sx-quote-big')}>
      <span className="sx-quote-mark" aria-hidden="true">
        “
      </span>
      <blockquote>{plainText(s(it.quote))}</blockquote>
      <figcaption>
        <Avatar it={it} />
        <span>
          <b>{s(it.name)}</b>
          <span>{[s(it.role), s(it.company)].filter(Boolean).join(' · ')}</span>
        </span>
      </figcaption>
    </figure>
  );
}

function Testimonials({ d, v }: { d: D; v: string }) {
  const items = arr<D>(d.items);
  const head = <Head eyebrow={s(d.eyebrow)} title={s(d.title)} sub={s(d.sub)} />;
  if (v === 'featured')
    return (
      <section className="sx sx-testi sx-tint">
        <div className="sx-in">
          {head}
          <div className="sx-feat-quotes">
            {items[0] && <Quote it={items[0]} big />}
            <div className="sx-feat-side">
              {items.slice(1).map((it, i) => (
                <Quote it={it} key={i} />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  if (v === 'wall')
    return (
      <section className="sx sx-testi sx-tint">
        <div className="sx-in">
          {head}
          <div className="sx-wall">
            {items.map((it, i) => (
              <Quote it={it} key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  if (v === 'slider')
    return (
      <section className="sx sx-testi">
        <div className="sx-in">{head}</div>
        <div className="sx-slider" tabIndex={0} aria-label="Testimonials">
          {items.map((it, i) => (
            <Quote it={it} key={i} />
          ))}
        </div>
      </section>
    );
  return (
    <section className="sx sx-testi sx-tint">
      <div className="sx-in">
        {head}
        <div className="sx-grid">
          {items.map((it, i) => (
            <Quote it={it} key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── lead form ───────────── */

function Lead({ d, v, pagePath }: { d: D; v: string; pagePath: string }) {
  const data = d as unknown as LeadFormData;
  const pitch = (light: boolean) => (
    <div className="sx-copy">
      {s(d.eyebrow) && <span className={cx('sx-eyebrow', light && 'sx-eyebrow-light')}>{s(d.eyebrow)}</span>}
      <h2>{s(d.title)}</h2>
      <RichText className="sx-lead" value={s(d.text)} />
      <Ticks items={strs(d.bullets)} dark={light} />
    </div>
  );
  if (v === 'centered')
    return (
      <section className="sx sx-lead sx-tint">
        <div className="sx-in sx-narrow">
          <Head eyebrow={s(d.eyebrow)} title={s(d.title)} sub={s(d.text)} />
          <LeadForm data={data} pagePath={pagePath} />
        </div>
      </section>
    );
  if (v === 'dark')
    return (
      <section className="sx sx-lead sx-lead-dark">
        <div className="sx-in sx-two">
          {pitch(true)}
          <LeadForm data={data} pagePath={pagePath} />
        </div>
      </section>
    );
  if (v === 'inline')
    return (
      <section className="sx sx-lead">
        <div className="sx-in">
          <div className="sx-lead-inline">
            <div className="sx-copy">
              <h2>{s(d.title)}</h2>
              <RichText value={s(d.text)} />
            </div>
            <LeadForm data={data} pagePath={pagePath} inline />
          </div>
        </div>
      </section>
    );
  return (
    <section className="sx sx-lead">
      <div className="sx-in sx-two">
        {pitch(false)}
        <LeadForm data={data} pagePath={pagePath} />
      </div>
    </section>
  );
}

/* ───────────── dispatcher ───────────── */

export function SectionView({ section, pagePath }: { section: SectionBlock; pagePath: string }) {
  const d = o(section.data);
  switch (section.type) {
    case 'hero':
      return <Hero d={d} v={section.variant} />;
    case 'features':
      return <Features d={d} v={section.variant} />;
    case 'content':
      return <ContentImage d={d} v={section.variant} />;
    case 'benefits':
      return <Benefits d={d} v={section.variant} />;
    case 'cta':
      return <Cta d={d} v={section.variant} />;
    case 'faq':
      return <Faq d={d} v={section.variant} />;
    case 'testimonials':
      return <Testimonials d={d} v={section.variant} />;
    case 'leadform':
      return <Lead d={d} v={section.variant} pagePath={pagePath} />;
    default:
      return null;
  }
}
