import type { ReactNode } from 'react';
import type { CmsPageContent } from '@/lib/cms';
import { ROUTES } from '@/lib/config';
import { Aos } from '../Aos';
import { SitePage } from '../SitePage';
import { AvailableFor } from '../AvailableFor';
import { Typewriter } from '../Typewriter';
import { Icon, Pill, SmartLink, cx } from '../ui';
import { HeroVisual } from './HeroVisual';
import {
  CtaSection,
  FaqSection,
  FeaturesSection,
  HowItWorksSection,
  RolesSection,
  SecuritySection,
  StatsSection,
  TestimonialsSection,
  ToolkitSection,
  WhyUsSection,
} from './Sections';
import { HomeSlotView } from './HomeSlots';
import { PrivacyRibbons } from './PrivacyRibbons';

type Cms = CmsPageContent | null;

/** Mirrors _openHref: external/empty hrefs fall back to sign-up / contact. */
function heroHref(href: string | undefined, primary: boolean): string {
  const h = (href ?? '').trim();
  if (!h || /^https?:\/\//i.test(h)) return primary ? ROUTES.signUp : ROUTES.contact;
  return h.startsWith('/') ? h : `/${h}`;
}

const isCustom = (v: string) => v !== '' && v !== 'original';

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h2 className="sec-title">{title}</h2>
      <p className="sec-sub">{subtitle}</p>
    </div>
  );
}

function Wrap({ children }: { children: ReactNode }) {
  return (
    <section className="sec-wrap">
      <div className="sec-wrap-in">{children}</div>
    </section>
  );
}

function CardGrid({ items }: { items: Array<[string, string, string]> }) {
  return (
    <div className="cg-wrap">
      <div className="cg">
        {items.map(([icon, title, body]) => (
          <div className="cg-card" key={title}>
            <div className="cg-ico">
              <Icon name={icon} size={22} color="#fff" />
            </div>
            <div className="cg-title">{title}</div>
            <div className="cg-body">{body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Bullet({ children }: { children: ReactNode }) {
  return (
    <div className="sec-bullet">
      <Icon name="check_circle" size={20} color="#10B981" />
      <span>{children}</span>
    </div>
  );
}

function Svg({ name, height, fill = false }: { name: string; height: number; fill?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`/assets/${name}`} alt="" className={cx('svg-art', fill && 'svg-art-fill')} style={{ height }} />
  );
}

/* ───────────────────────── Heroes ───────────────────────── */

function HeroCopy({ cms }: { cms: Cms }) {
  const h1 = cms?.h1.trim();
  const body = cms?.body.trim();
  const primary = cms?.buttonLabel.trim() ? cms.buttonLabel : 'Get started free';
  const secondary = cms?.button2Label.trim() ? cms.button2Label : 'Sign in';
  return (
    <div className="hc">
      <div className="hc-brand">
        <span className="hc-brand-dot" />
        Teamital · Workforce intelligence
      </div>
      <div className="hc-h1">{h1 || 'Workforce tools that'}</div>
      <Typewriter fontSize={40} />
      <p className="hc-body">
        {body ||
          'Clock in with GPS and biometrics, manage leave and tasks, and see live workforce insights — on every device.'}
      </p>
      <div className="hc-btns">
        <SmartLink href={ROUTES.signUp} className="hero-btn hero-btn-primary">
          <span>{primary}</span>
          <Icon name="arrow_forward" size={20} color="#fff" className="hero-btn-arrow" />
        </SmartLink>
        <SmartLink href={ROUTES.signIn} className="hero-btn hero-btn-ghost">
          <Icon name="login" size={20} color="#1A56DB" />
          <span>{secondary}</span>
        </SmartLink>
      </div>
      <ul className="hc-trust">
        <li>
          <Icon name="check_circle" size={18} color="#10B981" />
          No credit card required
        </li>
        <li>
          <Icon name="check_circle" size={18} color="#10B981" />
          14-day free trial
        </li>
        <li>
          <Icon name="check_circle" size={18} color="#10B981" />
          Cancel anytime
        </li>
      </ul>
      <div className="hc-avail">
        <AvailableFor label="Available on:" align="left" />
      </div>
    </div>
  );
}

function HeroMockup() {
  return (
    <Aos fromRight>
      <HeroVisual />
    </Aos>
  );
}

function HeroDashboardCard() {
  const stat = (v: string, l: string) => (
    <div className="hd-stat">
      <div className="hd-stat-v">{v}</div>
      <div className="hd-stat-l">{l}</div>
    </div>
  );
  return (
    <div className="hd-card">
      <div className="hd-title">Live attendance</div>
      <div className="hd-stats">
        {stat('96%', 'Present')}
        {stat('12', 'Late')}
        {stat('4', 'Leave')}
      </div>
      {['William · 8h 12m', 'Sara · 7h 40m', 'Ali · On site'].map((l) => (
        <div className="hd-line" key={l}>
          {l}
        </div>
      ))}
    </div>
  );
}

function PillBtns({ a, b, aDefault, bDefault, aHref, bHref }: {
  a: string; b: string; aDefault: string; bDefault: string; aHref: string; bHref: string;
}) {
  return (
    <div className="hp-btns">
      <Pill filled label={a || aDefault} href={aHref} />
      <Pill filled={false} label={b || bDefault} href={bHref} />
    </div>
  );
}

function titleFor(cms: Cms, variant: string): string {
  const h = cms?.h1.trim() ?? '';
  if (h) return h;
  if (variant === 'split-map') return 'Track, manage, and optimize your workforce';
  if (variant === 'ops-dashboard') return 'See how your team spends the day';
  return 'Automatic time tracking built for privacy';
}

function blurbFor(cms: Cms, variant: string): string {
  const b = cms?.body.trim() ?? '';
  if (b) return b;
  if (variant === 'split-map') return 'Keep tabs on your team while they are clocked in, with live location.';
  if (variant === 'ops-dashboard') return 'Live attendance, breaks, and hours in one view, so you know who is on site.';
  return 'See the day as it happens, and keep activity data private.';
}

const FLOAT_ICONS_L: Array<[string, string]> = [
  ['assignment', '#7C3AED'],
  ['schedule', '#7C3AED'],
  ['location_on', '#16A34A'],
  ['mail_outline', '#DB2777'],
  ['forum', '#F59E0B'],
];
const FLOAT_ICONS_R: Array<[string, string]> = [
  ['public', '#7C3AED'],
  ['devices', '#DB2777'],
  ['bar_chart', '#F59E0B'],
  ['security', '#2563EB'],
  ['fingerprint', '#16A34A'],
];
const FLOAT_X = [28, 108, 20, 120, 48];
const FLOAT_Y = [0.08, 0.26, 0.46, 0.66, 0.84];

function FloatIcon({ name, color }: { name: string; color: string }) {
  return (
    <div className="float-ico">
      <Icon name={name} size={26} color={color} />
    </div>
  );
}

function HeroPrivacy({ cms, variant }: { cms: Cms; variant: string }) {
  return (
    <div className="hp">
      <PrivacyRibbons />
      <div className="hp-edge">
        {FLOAT_ICONS_L.map(([n, c], i) => (
          <div key={'l' + i} className="hp-pos" style={{ left: FLOAT_X[i], top: `calc(var(--hp-h) * ${FLOAT_Y[i]})` }}>
            <FloatIcon name={n} color={c} />
          </div>
        ))}
        {FLOAT_ICONS_R.map(([n, c], i) => (
          <div key={'r' + i} className="hp-pos" style={{ right: FLOAT_X[i], top: `calc(var(--hp-h) * ${FLOAT_Y[i]})` }}>
            <FloatIcon name={n} color={c} />
          </div>
        ))}
      </div>
      <div className="hp-center">
        <div className="hp-in">
          <h1 className="hp-title">{titleFor(cms, variant)}</h1>
          <p className="hp-blurb">{blurbFor(cms, variant)}</p>
          <div className="hp-cta">
            <Pill
              label={cms?.buttonLabel.trim() ? cms.buttonLabel : 'Start free 14-day trial'}
              filled
              large
              href={heroHref(cms?.buttonHref, true)}
            />
          </div>
          <div className="hp-note">No credit card required</div>
          <div className="hp-icons-narrow">
            {[
              ['assignment', '#7C3AED'],
              ['schedule', '#7C3AED'],
              ['location_on', '#16A34A'],
              ['mail_outline', '#DB2777'],
              ['forum', '#F59E0B'],
              ['public', '#7C3AED'],
              ['bar_chart', '#F59E0B'],
              ['fingerprint', '#16A34A'],
            ].map(([n, c]) => (
              <FloatIcon key={n} name={n} color={c} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroWorkforce({ cms, variant }: { cms: Cms; variant: string }) {
  return (
    <div className="hw">
      <div className="hw-in">
        <div className="hw-copy">
          <h1 className="hw-title">{titleFor(cms, variant)}</h1>
          <p className="hw-blurb">{blurbFor(cms, variant)}</p>
          <PillBtns
            a={cms?.buttonLabel.trim() ? cms.buttonLabel : ''}
            b={cms?.button2Label.trim() ? cms.button2Label : ''}
            aDefault="Create a free account"
            bDefault="Request a free demo"
            aHref={heroHref(cms?.buttonHref, true)}
            bHref={heroHref(cms?.button2Href, false)}
          />
        </div>
        <div className="hw-art">
          <div className="signin-art">
            <div className="signin-art-bg" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/screen-signin.webp" alt="" className="signin-art-img" />
          </div>
        </div>
      </div>
    </div>
  );
}

function OpsBoard() {
  const row = (name: string, pct: string, pctColor: string, bar: number) => (
    <div className="ob-row" key={name}>
      <div className="ob-avatar">{name[0]}</div>
      <div className="ob-name">{name}</div>
      <div className="ob-pct" style={{ color: pctColor }}>
        {pct}
      </div>
      <div className="ob-bar">
        <div style={{ width: `${bar * 100}%` }} />
      </div>
    </div>
  );
  return (
    <div className="ob">
      <div className="ob-card1">
        <div className="ob-t">Activities</div>
        <div className="ob-s">On site  ·  Break  ·  Late</div>
        {row('Ayesha', '92%', '#16A34A', 0.86)}
        {row('Hamza', '34%', '#EF4444', 0.34)}
        {row('Sara', '76%', '#1A56DB', 0.7)}
      </div>
      <div className="ob-card2">
        <div className="ob-c2-l">Work time</div>
        <div className="ob-c2-v">02:43:02</div>
        <div className="ob-c2-s">On site · 92%</div>
      </div>
      <div className="ob-card3">
        <div className="ob-c3-t">Team hours</div>
        <div className="ob-c3-bars">
          {[36, 58, 44, 72, 50, 66].map((h, i) => (
            <div key={i} className="ob-c3-col">
              <div style={{ height: h, background: h > 60 ? '#1A56DB' : '#93C5FD' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HeroOps({ cms, variant }: { cms: Cms; variant: string }) {
  return (
    <div className="ho">
      <div className="ho-in">
        <div className="ho-copy">
          <h1 className="ho-title">{titleFor(cms, variant)}</h1>
          <p className="ho-blurb">{blurbFor(cms, variant)}</p>
          <PillBtns
            a={cms?.buttonLabel.trim() ? cms.buttonLabel : ''}
            b={cms?.button2Label.trim() ? cms.button2Label : ''}
            aDefault="Book a demo"
            bDefault="Start free trial"
            aHref={heroHref(cms?.buttonHref || '/contact', false)}
            bHref={heroHref(cms?.button2Href || '/sign-up', true)}
          />
          <div className="ho-note">No credit card required</div>
        </div>
        <div className="ho-board">
          <OpsBoard />
        </div>
      </div>
    </div>
  );
}

function Hero({ cms }: { cms: Cms }) {
  const variant = cms?.heroVariant.trim() || 'split-product';
  if (variant === 'center-icons') return <HeroPrivacy cms={cms} variant={variant} />;
  if (variant === 'split-map') return <HeroWorkforce cms={cms} variant={variant} />;
  if (variant === 'ops-dashboard') return <HeroOps cms={cms} variant={variant} />;
  return (
    <div className="hero">
      <div className="hero-in">
        <div className="hero-copy">
          <HeroCopy cms={cms} />
        </div>
        <div className="hero-vis">{variant === 'split-dashboard' ? <HeroDashboardCard /> : <HeroMockup />}</div>
      </div>
    </div>
  );
}

/* ───────────────────────── Sections ───────────────────────── */

const HERO_WITH_OWN_ROW = (cms: Cms) => {
  const v = cms?.heroVariant.trim() || 'split-product';
  return !['center-icons', 'split-map', 'ops-dashboard'].includes(v);
};

function Platforms() {
  return (
    <div className="plat">
      <AvailableFor label="Available on:" />
    </div>
  );
}

/* ───────────────────────── Custom H2 / H3 ───────────────────────── */

function H2Section({ cms }: { cms: Cms }) {
  const variant = cms?.h2Variant.trim() ?? '';
  const title =
    cms?.h2Heading.trim() || (variant === 'security-card' ? 'See who is on site, on every device' : 'Workforce tools built for every team');
  const blurb =
    cms?.h2Body.trim() ||
    (variant === 'security-card'
      ? 'Attendance checks GPS, face, and fingerprint, then shows a clear pass or fail for the team.'
      : 'Track attendance, tasks, and hours in real time, by person, shift, and site.');
  const lines = cms && cms.h2Items.length
    ? cms.h2Items
    : variant === 'security-card'
      ? ['GPS check', 'Face check', 'Fingerprint', '- Outside the site', '- Missing photo']
      : [
          'Clock-in with GPS, face, and fingerprint',
          'Leave, shifts, and task tracking',
          'Live dashboards for managers',
          'Reports your payroll team can use',
          'Works on mobile, desktop, and web',
        ];
  const clean = (l: string) => l.replace(/^[+-]\s*/, '');

  if (variant === 'security-card') {
    return (
      <div className="h2s-wrap">
        <div className="h2s-in">
          <div className="h2s-box">
            <div className="h2s-copy">
              <h2 className="h2s-title">{title}</h2>
              <p className="h2s-blurb">{blurb}</p>
              <Pill filled label={cms?.h2Button.trim() ? cms.h2Button : 'Explore attendance checks'} href={ROUTES.signUp} />
            </div>
            <div className="h2s-card">
              <div className="h2s-card-head">
                <Icon name="laptop_mac" size={24} color="#2563EB" />
                <span>Team devices</span>
              </div>
              <div className="h2s-card-sub">Checks  ·  Needs review</div>
              {lines.map((l, i) => {
                const bad = l.trimStart().startsWith('-');
                return (
                  <div className="h2s-line" key={i}>
                    <Icon name={bad ? 'cancel' : 'check_circle'} size={18} color={bad ? '#EF4444' : '#16A34A'} />
                    <span>{clean(l)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="sec-white h2d">
      <div className="h2d-in">
        <div className="h2d-art">
          <div className="h2a">
            <div className="h2a-panel">
              <div className="h2a-bars">
                {[70, 110, 86, 130].map((h) => (
                  <div className="h2a-bar" key={h}>
                    <div style={{ height: h, background: h > 100 ? '#60A5FA' : '#C4B5FD' }} />
                  </div>
                ))}
              </div>
            </div>
            <div className="h2a-today">
              <div className="h2a-today-t">Today</div>
              <div className="h2a-stats">
                {[['95%', 'On time'], ['76%', 'On site'], ['73%', 'Active']].map(([v, l]) => (
                  <div className="h2a-stat" key={l}>
                    <div className="h2a-stat-v">{v}</div>
                    <div className="h2a-stat-l">{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="h2a-hours">
              <div className="h2a-hours-t">Hours</div>
              <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
                <circle cx="32" cy="32" r="28" fill="none" stroke="#E5E7EB" strokeWidth="8" />
                <circle
                  cx="32" cy="32" r="28" fill="none" stroke="#22C55E" strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 28 * 0.72} ${2 * Math.PI * 28}`}
                  transform="rotate(-90 32 32)"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="h2d-copy">
          <h2 className="h2d-title">{title}</h2>
          <p className="h2d-blurb">{blurb}</p>
          {lines.map((l, i) => (
            <div className="h2d-line" key={i}>
              <span className="h2d-dot" />
              <span>{clean(l)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function H3Why({ cms }: { cms: Cms }) {
  const title = cms?.h3Heading.trim() || 'Why time tracking matters';
  const lines =
    cms && cms.h3Items.length
      ? cms.h3Items
      : [
          'See hours clearly across every team.',
          'Build a record your managers can trust.',
          'Give clients a work log they can check.',
          'Keep attendance ready for review.',
        ];
  return (
    <section className="sec-white h3w">
      <div className="h3w-in">
        <div className="h3w-copy">
          <h2 className="h3w-title">{title}</h2>
          <div className="gap-18" />
          {lines.map((l, i) => (
            <div className="h3w-line" key={i}>
              <span className="h3w-dot" />
              <span>{l}</span>
            </div>
          ))}
          <div className="gap-16" />
          <Pill filled label={cms?.h3Button.trim() ? cms.h3Button : 'Get started'} href={ROUTES.signUp} />
        </div>
        <div className="h3w-vis">
          <div className="h3w-vis-bg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/screen-signin.webp" alt="" />
          </div>
          <div className="h3w-float">
            <div className="h3w-float-t">00:21:25</div>
            <div className="h3w-float-s">On site today</div>
            <div className="h3w-prog">
              <div style={{ width: '55%' }} />
            </div>
            <div className="h3w-float-c">55% core work</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function H3Section({ cms }: { cms: Cms }) {
  if (cms?.h3Variant.trim() === 'why-matters') return <H3Why cms={cms} />;
  const title = cms?.h3Heading.trim() || 'Employee tracking on every device';
  const blurb =
    cms?.h3Body.trim() ||
    'Clock in from Windows, Mac, and the web. Attendance, GPS, and live status stay in one place.';
  const os = (label: string, sel: boolean) => (
    <div className="os-tab" key={label}>
      <div className={cx('os-tab-t', sel && 'os-tab-on')}>{label}</div>
      <div className={cx('os-tab-bar', sel && 'os-tab-bar-on')} />
    </div>
  );
  return (
    <section className="sec-white h3d">
      <div className="h3d-in">
        <div className="h3d-dash">
          <div className="h3d-dash-bg">
            <div className="h3d-card">
              <div className="h3d-card-top">
                <span className="h3d-card-t">Tracked hours</span>
                <span className="h3d-card-v">05:57</span>
              </div>
              <div className="h3d-card-on">On site · clocked in</div>
              <div className="h3d-mini-row">
                {[['95%', 'On time'], ['76%', 'On site']].map(([v, l]) => (
                  <div className="h3d-mini" key={l}>
                    <div className="h3d-mini-v">{v}</div>
                    <div className="h3d-mini-l">{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="h3d-backdrop">
          <div className="h3d-copy">
            <h2 className="h3d-title">{title}</h2>
            <p className="h3d-blurb">{blurb}</p>
            <div className="os-tabs">
              {os('Desktop', true)}
              {os('Mobile', false)}
              {os('Web', false)}
            </div>
            <div className="os-pills">
              {[['desktop_windows', 'Windows'], ['laptop_mac', 'macOS'], ['public', 'Web']].map(([i, l]) => (
                <div className="os-pill" key={l}>
                  <Icon name={i} size={18} color="#fff" />
                  <span>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Page ───────────────────────── */

export function HomePage({ cms }: { cms: Cms }) {
  const slotOr = (n: number, original: ReactNode) => {
    const slot = cms?.slots[n];
    if (!slot || !isCustom(slot.variant)) return original;
    const demoFirst = slot.variant === 'ops-board' || slot.variant === 'ask-banner';
    return (
      <HomeSlotView
        slot={slot}
        primaryHref={demoFirst ? ROUTES.contact : ROUTES.signUp}
        secondaryHref={demoFirst ? ROUTES.signUp : ROUTES.contact}
      />
    );
  };

  return (
    <SitePage compactBelow={980} overlayHeader>
      <Aos>
        <Hero cms={cms} />
      </Aos>
      {!HERO_WITH_OWN_ROW(cms) && (
        <Aos delay={80}>
          <Platforms />
        </Aos>
      )}
      <Aos>{isCustom(cms?.h2Variant.trim() ?? '') ? <H2Section cms={cms} /> : <FeaturesSection />}</Aos>
      <Aos>{isCustom(cms?.h3Variant.trim() ?? '') ? <H3Section cms={cms} /> : <HowItWorksSection />}</Aos>
      <Aos>{slotOr(4, <RolesSection />)}</Aos>
      <Aos>{slotOr(5, <SecuritySection />)}</Aos>
      <Aos>{slotOr(6, <TestimonialsSection />)}</Aos>
      <Aos>{slotOr(7, <WhyUsSection />)}</Aos>
      <Aos>{slotOr(8, <ToolkitSection />)}</Aos>
      <Aos>{slotOr(9, <StatsSection />)}</Aos>
      <Aos>
        <FaqSection />
      </Aos>
      <Aos>{slotOr(10, <CtaSection />)}</Aos>
    </SitePage>
  );
}
