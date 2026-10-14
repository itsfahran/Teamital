import type { ReactNode } from 'react';
import type { HomeContent } from '@/content/home';
import { plainText } from '@/lib/content/utils';
import { RichText } from '../RichText';
import { SmartLink, cx } from '../ui';
import { FaIcon as Icon } from '../FaIcon';
import { CountUp } from './CountUp';

type HeadProps = { eyebrow: string; title: string; sub?: string; light?: boolean };

function Head({ eyebrow, title, sub, light = false }: HeadProps) {
  return (
    <div className={cx('hs-head', light && 'hs-head-light')}>
      <span className="hs-eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {sub && <RichText value={sub} />}
    </div>
  );
}

function Section({ children, tint = false, id }: { children: ReactNode; tint?: boolean; id?: string }) {
  return (
    <section className={cx('hs', tint && 'hs-tint')} id={id}>
      <div className="hs-in">{children}</div>
    </section>
  );
}

/** Decorative/illustration image: shown when the CMS holds a URL. */
function Art({ src }: { src: string }) {
  if (!src) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" />;
}

/* ───────── Features: bento ───────── */
export function FeaturesSection({ c }: { c: HomeContent['features'] }) {
  return (
    <Section>
      <Head eyebrow={c.eyebrow} title={c.title} sub={c.sub} />
      <div className="hs-bento">
        <div className="hs-bento-art">
          <div className="hs-bento-glow" aria-hidden="true" />
          <Art src={c.image} />
          <div className="hs-bento-cap">
            <b>{c.captionTitle}</b>
            <span>{plainText(c.captionText)}</span>
          </div>
        </div>
        <div className="hs-bento-list">
          {c.items.map((it, i) => (
            <div className={cx('hs-feat', `tone-${it.tone}`)} key={i}>
              <span className="tile hs-tile">
                <Icon name={it.icon} size={26} />
              </span>
              <div>
                <h3>{it.title}</h3>
                <RichText value={it.text} />
              </div>
              <Icon name="arrow_forward" size={20} className="hs-feat-arrow" />
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ───────── How it works: stepper ───────── */
export function HowItWorksSection({ c }: { c: HomeContent['howItWorks'] }) {
  return (
    <Section tint>
      <Head eyebrow={c.eyebrow} title={c.title} sub={c.sub} />
      <ol className="hs-steps">
        {c.steps.map((s, i) => (
          <li className="hs-step" key={i}>
            <span className="hs-step-n">{i + 1}</span>
            <div className="hs-step-card">
              <span className="hs-step-ico">
                <Icon name={s.icon} size={26} />
              </span>
              <h3>{s.title}</h3>
              <RichText value={s.text} />
            </div>
          </li>
        ))}
      </ol>
      {c.image && (
        <div className="hs-steps-art" aria-hidden="true">
          <Art src={c.image} />
        </div>
      )}
    </Section>
  );
}

/* ───────── Roles ───────── */
export function RolesSection({ c }: { c: HomeContent['roles'] }) {
  return (
    <Section>
      <Head eyebrow={c.eyebrow} title={c.title} sub={c.sub} />
      <div className="hs-roles">
        {c.items.map((r, i) => (
          <SmartLink href={r.href} className={cx('hs-role', `tone-${r.tone}`)} key={i}>
            <span className="hs-role-top">
              <span className="hs-role-ico">
                <Icon name={r.icon} size={30} color="#fff" />
              </span>
              <span className="hs-role-shape" aria-hidden="true" />
            </span>
            <h3>{r.title}</h3>
            <p>{plainText(r.text)}</p>
            <span className="hs-role-link">
              {r.cta}
              <Icon name="arrow_forward" size={18} />
            </span>
          </SmartLink>
        ))}
      </div>
    </Section>
  );
}

/* ───────── Security: dark panel ───────── */
export function SecuritySection({ c }: { c: HomeContent['security'] }) {
  return (
    <section className="hs hs-dark-wrap">
      <div className="hs-in">
        <div className="hs-dark">
          <span className="hs-dark-glow hs-dark-glow-a" aria-hidden="true" />
          <span className="hs-dark-glow hs-dark-glow-b" aria-hidden="true" />
          <div className="hs-dark-copy">
            <span className="hs-eyebrow hs-eyebrow-dark">{c.eyebrow}</span>
            <h2>{c.title}</h2>
            <RichText value={c.text} />
            <ul>
              {c.points.map((p, i) => (
                <li key={i}>
                  <span className="hs-dark-ico">
                    <Icon name={p.icon} size={20} color="#fff" />
                  </span>
                  {plainText(p.text)}
                </li>
              ))}
            </ul>
            <SmartLink href={c.linkHref} className="hs-dark-link">
              {c.linkLabel}
              <Icon name="arrow_forward" size={18} />
            </SmartLink>
          </div>
          <div className="hs-dark-art">
            <div className="hs-dark-card">
              <Art src={c.image} />
            </div>
            <span className="hs-dark-chip hs-dark-chip-a">
              <Icon name="verified_user" size={18} color="#34D399" />
              {c.chipA}
            </span>
            <span className="hs-dark-chip hs-dark-chip-b">
              <Icon name="fact_check" size={18} color="#60A5FA" />
              {c.chipB}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── Testimonials ───────── */
export function TestimonialsSection({ c }: { c: HomeContent['testimonials'] }) {
  return (
    <Section tint>
      <Head eyebrow={c.eyebrow} title={c.title} sub={c.sub} />
      <div className="hs-quotes">
        {c.items.map((q, i) => (
          <figure className={cx('hs-quote', `tone-${q.tone}`)} key={i}>
            <span className="hs-quote-mark" aria-hidden="true">
              “
            </span>
            <blockquote>{plainText(q.quote)}</blockquote>
            <figcaption>
              <span className="hs-avatar">
                <Icon name="person" size={22} color="#fff" />
              </span>
              <span>
                <b>{q.role}</b>
                <span>{q.caption}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}

/* ───────── Why us ───────── */
export function WhyUsSection({ c }: { c: HomeContent['whyUs'] }) {
  return (
    <Section>
      <Head eyebrow={c.eyebrow} title={c.title} sub={c.sub} />
      <div className="hs-why">
        {c.items.map((it, i) => (
          <div className={cx('hs-why-card', `tone-${it.tone}`)} key={i}>
            <span className="hs-why-num">0{i + 1}</span>
            <span className="tile hs-tile">
              <Icon name={it.icon} size={26} />
            </span>
            <h3>{it.title}</h3>
            <RichText value={it.text} />
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ───────── Toolkit ───────── */
export function ToolkitSection({ c }: { c: HomeContent['toolkit'] }) {
  return (
    <Section tint>
      <Head eyebrow={c.eyebrow} title={c.title} sub={c.sub} />
      <div className="hs-toolkit">
        {c.chips.map((ch, i) => (
          <div className={cx('hs-tool', `tone-${ch.tone}`)} key={i}>
            <span className="tile hs-tile">
              <Icon name={ch.icon} size={26} />
            </span>
            <span>{ch.label}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ───────── Stats ───────── */
export function StatsSection({ c }: { c: HomeContent['stats'] }) {
  return (
    <section className="hs hs-stats-wrap">
      <div className="hs-in">
        <div className="hs-stats">
          <span className="hs-dark-glow hs-dark-glow-a" aria-hidden="true" />
          {c.items.map((s, i) => (
            <div className="hs-stat" key={i}>
              <span className="hs-stat-ico">
                <Icon name={s.icon} size={22} color="#fff" />
              </span>
              <div className="hs-stat-v">
                <CountUp value={s.value} />
              </div>
              <div className="hs-stat-l">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── FAQ ───────── */
export function FaqSection({ c }: { c: HomeContent['faq'] }) {
  return (
    <Section>
      <div className="hs-faq">
        <div className="hs-faq-side">
          <span className="hs-eyebrow">{c.eyebrow}</span>
          <h2>{c.title}</h2>
          <RichText value={c.text} />
          {c.image && (
            <div className="hs-faq-art" aria-hidden="true">
              <Art src={c.image} />
            </div>
          )}
          <SmartLink href="/contact" className="hs-faq-link">
            <Icon name="mail_outline" size={18} />
            {c.contactLabel}
          </SmartLink>
        </div>
        <div className="hs-faq-list">
          {c.items.map((f, i) => (
            <details className="hs-faq-item" key={i}>
              <summary>
                <span>{f.q}</span>
                <span className="hs-faq-plus" aria-hidden="true">
                  <Icon name="add" size={22} />
                </span>
              </summary>
              <div className="hs-faq-a">
                <RichText value={f.a} />
              </div>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ───────── Closing CTA ───────── */
export function CtaSection({ c, signUpHref, contactHref }: { c: HomeContent['cta']; signUpHref: string; contactHref: string }) {
  return (
    <section className="hs hs-cta-wrap">
      <div className="hs-in">
        <div className="hs-cta">
          <span className="hs-dark-glow hs-dark-glow-a" aria-hidden="true" />
          <span className="hs-dark-glow hs-dark-glow-b" aria-hidden="true" />
          <h2>{c.title}</h2>
          <RichText value={c.text} />
          <div className="hs-cta-btns">
            <SmartLink href={signUpHref} className="hero-btn hero-btn-light">
              <span>{c.primary}</span>
              <Icon name="arrow_forward" size={20} color="#1A56DB" />
            </SmartLink>
            <SmartLink href={contactHref} className="hero-btn hero-btn-glass">
              {c.secondary}
            </SmartLink>
          </div>
        </div>
      </div>
    </section>
  );
}
