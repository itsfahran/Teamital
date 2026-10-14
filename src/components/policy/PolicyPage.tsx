import Link from 'next/link';
import type { PolicyCmsBlock as PolicyBlock, PolicyDoc } from '@/content/policies-cms';
import { plainText } from '@/lib/content/utils';
import { RichText } from '../RichText';
import { Aos } from '../Aos';
import { SitePage } from '../SitePage';
import { Icon, SmartLink, cx } from '../ui';
import { PolicyNav, type TocItem } from './PolicyNav';

export type PolicyKey = 'privacy' | 'terms' | 'cookies' | 'security';

export const POLICY_META: Record<PolicyKey, { title: string; short: string; path: string; icon: string; tone: 'blue' | 'violet' | 'amber' | 'green'; subtitle: string; chips: [[string, string], [string, string]] }> = {
  privacy: {
    title: 'Privacy Policy',
    short: 'Privacy',
    path: '/privacy-policy',
    icon: 'privacy_tip',
    tone: 'blue',
    subtitle: 'How Teamital collects, uses, stores and protects personal data, and the rights you have over it.',
    chips: [['Your data', 'lock'], ['Your rights', 'how_to_reg']],
  },
  terms: {
    title: 'Terms & Conditions',
    short: 'Terms',
    path: '/terms-and-conditions',
    icon: 'gavel',
    tone: 'violet',
    subtitle: 'The rules for using the Teamital website, apps and services.',
    chips: [['Clear terms', 'description'], ['Fair use', 'balance']],
  },
  cookies: {
    title: 'Cookie Policy',
    short: 'Cookies',
    path: '/cookie-policy',
    icon: 'cookie',
    tone: 'amber',
    subtitle: 'How and why we use cookies and similar technologies.',
    chips: [['Transparent', 'visibility'], ['Your choices', 'toggle_on']],
  },
  security: {
    title: 'Security Policy',
    short: 'Security',
    path: '/security-policy',
    icon: 'shield',
    tone: 'green',
    subtitle: 'The technical and organisational measures that protect your data.',
    chips: [['Protection', 'shield'], ['Access control', 'admin_panel_settings']],
  },
};

type Section = { id: string; num: string; title: string; blocks: PolicyBlock[] };

/** Group blocks into numbered sections ("1. Introduction"); other headings become sub-headings. */
function toSections(blocks: PolicyBlock[]): { intro: PolicyBlock[]; sections: Section[] } {
  const numbered = /^(\d+)\.\s*(.*)$/;
  const hasNumbered = blocks.some((b) => b.type === 'heading' && numbered.test(plainText(b.text)));
  const intro: PolicyBlock[] = [];
  const sections: Section[] = [];
  let cur: Section | null = null;
  for (const b of blocks) {
    const isSection = b.type === 'heading' && (hasNumbered ? numbered.test(plainText(b.text)) : true);
    if (isSection && b.type === 'heading') {
      const m = numbered.exec(plainText(b.text));
      cur = {
        id: `sec-${sections.length + 1}`,
        num: m ? m[1] : String(sections.length + 1),
        title: m ? m[2] : plainText(b.text),
        blocks: [],
      };
      sections.push(cur);
    } else if (cur) {
      cur.blocks.push(b);
    } else {
      intro.push(b);
    }
  }
  return { intro, sections };
}

function words(blocks: PolicyBlock[]): number {
  return blocks.reduce((n, b) => n + (b.type === 'list' ? b.items.join(' ') : plainText(b.text)).split(/\s+/).length, 0);
}

function Blocks({ blocks }: { blocks: PolicyBlock[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.type === 'heading') return <h3 className="pg-sub" key={i}>{plainText(b.text)}</h3>;
        if (b.type === 'paragraph') return <RichText className="pg-p" value={b.text} key={i} />;
        return (
          <ul className="pg-ul" key={i}>
            {b.items.map((it, j) => (
              <li key={j}>
                <span className="pg-dot" />
                <span>{it}</span>
              </li>
            ))}
          </ul>
        );
      })}
    </>
  );
}

export function PolicyPage({ kind, doc }: { kind: PolicyKey; doc: PolicyDoc }) {
  const meta = POLICY_META[kind];
  const blocks = doc.blocks;
  const L = doc.labels;
  const { intro, sections } = toSections(blocks);
  const toc: TocItem[] = sections.map((s) => ({ id: s.id, num: s.num, title: s.title }));
  const mins = Math.max(2, Math.round(words(blocks) / 220));
  const others = (Object.keys(POLICY_META) as PolicyKey[]).filter((k) => k !== kind);

  return (
    <SitePage compactBelow={980} overlayHeader background="#fff">
      <section className={cx('pg-hero', `tone-${meta.tone}`)}>
        <div className="pg-hero-in">
          <div className="pg-hero-copy">
            <span className="pg-pill">
              <Icon name="verified_user" size={16} />
              {L.pill}
            </span>
            <h1>{doc.title}</h1>
            <RichText value={doc.subtitle} />
            <div className="pg-chips">
              <span>
                <Icon name="event" size={18} />
                {L.lastUpdated} {doc.lastUpdated}
              </span>
              <span>
                <Icon name="format_list_numbered" size={18} />
                {sections.length} {L.sections}
              </span>
              <span>
                <Icon name="schedule" size={18} />
                {mins} {L.minRead}
              </span>
            </div>
          </div>
          <div className="pg-art" aria-hidden="true">
            <span className="pg-orbit pg-orbit-a" />
            <span className="pg-orbit pg-orbit-b" />
            <span className="pg-art-card">
              <Icon name={meta.icon} size={72} color="#fff" />
            </span>
            <span className="pg-art-chip pg-art-chip-a">
              <Icon name={meta.chips[0][1]} size={16} />
              {meta.chips[0][0]}
            </span>
            <span className="pg-art-chip pg-art-chip-b">
              <Icon name={meta.chips[1][1]} size={16} />
              {meta.chips[1][0]}
            </span>
          </div>
        </div>
      </section>

      <div className="pg-body">
        <div className="pg-layout">
          <PolicyNav items={toc} />

          <article className="pg-article" id="pg-article">
            {intro.length > 0 && (
              <Aos>
                <div className="pg-intro">
                  <Blocks blocks={intro} />
                </div>
              </Aos>
            )}

            {sections.map((s) => (
              <Aos key={s.id}>
                <section className="pg-sec" id={s.id}>
                  <header className="pg-sec-head">
                    <span className={cx('pg-num', `tone-${meta.tone}`)}>{s.num}</span>
                    <h2>{s.title}</h2>
                  </header>
                  <div className="pg-sec-body">
                    <Blocks blocks={s.blocks} />
                  </div>
                </section>
              </Aos>
            ))}

            <Aos>
              <div className="pg-contact">
                <span className="pg-contact-ico">
                  <Icon name="mail" size={26} color="#fff" />
                </span>
                <div>
                  <h3>{L.contactTitle}</h3>
                  <p>{plainText(L.contactText)}</p>
                </div>
                <SmartLink href="/contact" className="hero-btn hero-btn-primary">
                  <span>{L.contactButton}</span>
                  <Icon name="arrow_forward" size={20} color="#fff" className="hero-btn-arrow" />
                </SmartLink>
              </div>
            </Aos>
          </article>
        </div>

        <div className="pg-more">
          <h2>{L.moreTitle}</h2>
          <div className="pg-more-grid">
            {others.map((k) => {
              const m = POLICY_META[k];
              return (
                <Link href={m.path} className={cx('pg-more-card', `tone-${m.tone}`)} key={k}>
                  <span className="pg-more-ico">
                    <Icon name={m.icon} size={24} />
                  </span>
                  <span className="pg-more-txt">
                    <b>{m.title}</b>
                    <span>{m.subtitle}</span>
                  </span>
                  <Icon name="arrow_forward" size={20} className="pg-more-arrow" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </SitePage>
  );
}
