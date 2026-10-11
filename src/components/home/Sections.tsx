import type { ReactNode } from 'react';
import { ROUTES } from '@/lib/config';
import { Icon, SmartLink, cx } from '../ui';
import { CountUp } from './CountUp';

type Tone = 'blue' | 'violet' | 'green' | 'amber' | 'rose' | 'sky';

function Head({ eyebrow, title, sub, light = false }: { eyebrow: string; title: string; sub?: string; light?: boolean }) {
  return (
    <div className={cx('hs-head', light && 'hs-head-light')}>
      <span className="hs-eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {sub && <p>{sub}</p>}
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

/* ───────── Features: bento ───────── */
export function FeaturesSection() {
  const items: Array<[string, string, string, Tone]> = [
    ['fingerprint', 'Trusted clock-in', 'Face, fingerprint and GPS checks keep attendance honest.', 'blue'],
    ['bar_chart', 'Realtime charts', 'Web dashboards update as your team clocks in and out.', 'green'],
    ['forum', 'HR chat', 'Employees reach HR without leaving the app.', 'violet'],
  ];
  return (
    <Section>
      <Head eyebrow="Features" title="Built for modern teams" sub="One product for attendance, tasks, leave and insights." />
      <div className="hs-bento">
        <div className="hs-bento-art">
          <div className="hs-bento-glow" aria-hidden="true" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/undraw_engineering-team_13ax.svg" alt="" />
          <div className="hs-bento-cap">
            <b>Everything your team needs</b>
            <span>Attendance, tasks, leave and insights, in one place.</span>
          </div>
        </div>
        <div className="hs-bento-list">
          {items.map(([icon, title, text, tone]) => (
            <div className={cx('hs-feat', `tone-${tone}`)} key={title}>
              <span className="tile hs-tile">
                <Icon name={icon} size={26} />
              </span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
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
export function HowItWorksSection() {
  const steps: Array<[string, string, string, string]> = [
    ['1', 'apartment', 'Create company', 'Sign up and invite your workforce in minutes.'],
    ['2', 'fingerprint', 'Clock with confidence', 'Employees punch in with GPS, face or biometric checks.'],
    ['3', 'insights', 'See live insights', 'Managers track hours, leave and tasks from the web dashboard.'],
  ];
  return (
    <Section tint>
      <Head eyebrow="How it works" title="How it works" sub="Three steps from signup to live ops." />
      <ol className="hs-steps">
        {steps.map(([n, icon, title, text]) => (
          <li className="hs-step" key={n}>
            <span className="hs-step-n">{n}</span>
            <div className="hs-step-card">
              <span className="hs-step-ico">
                <Icon name={icon} size={26} />
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="hs-steps-art" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/undraw_working-together_r43a.svg" alt="" />
      </div>
    </Section>
  );
}

/* ───────── Roles ───────── */
export function RolesSection() {
  const roles: Array<[string, string, string, string, Tone, string]> = [
    ['business', 'Company admins', 'Departments, employees, attendance maps and exports.', ROUTES.guideCompanies, 'blue', 'Admin guide'],
    ['badge', 'Employees', 'Clock in/out, tasks, leave requests and HR chat.', ROUTES.guideEmployees, 'green', 'Employee guide'],
    ['hub', 'White-label partners', 'Resell with your brand and manage tenant companies.', ROUTES.whiteLabel, 'violet', 'Partner program'],
  ];
  return (
    <Section>
      <Head eyebrow="Roles" title="Built for every role" sub="The right tools for admins, staff and partners." />
      <div className="hs-roles">
        {roles.map(([icon, title, text, href, tone, cta]) => (
          <SmartLink href={href} className={cx('hs-role', `tone-${tone}`)} key={title}>
            <span className="hs-role-top">
              <span className="hs-role-ico">
                <Icon name={icon} size={30} color="#fff" />
              </span>
              <span className="hs-role-shape" aria-hidden="true" />
            </span>
            <h3>{title}</h3>
            <p>{text}</p>
            <span className="hs-role-link">
              {cta}
              <Icon name="arrow_forward" size={18} />
            </span>
          </SmartLink>
        ))}
      </div>
    </Section>
  );
}

/* ───────── Security: dark panel ───────── */
export function SecuritySection() {
  const points = [
    ['lock', 'Encrypted auth sessions via Supabase'],
    ['admin_panel_settings', 'Role gates for admin, employee & partners'],
    ['fingerprint', 'GPS / biometric verification options'],
    ['history', 'Attendance history ready for exports'],
  ];
  return (
    <section className="hs hs-dark-wrap">
      <div className="hs-in">
        <div className="hs-dark">
          <span className="hs-dark-glow hs-dark-glow-a" aria-hidden="true" />
          <span className="hs-dark-glow hs-dark-glow-b" aria-hidden="true" />
          <div className="hs-dark-copy">
            <span className="hs-eyebrow hs-eyebrow-dark">Security</span>
            <h2>Security you can trust</h2>
            <p>Role-based access, secure auth and audit-friendly records.</p>
            <ul>
              {points.map(([icon, text]) => (
                <li key={text}>
                  <span className="hs-dark-ico">
                    <Icon name={icon} size={20} color="#fff" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
            <SmartLink href={ROUTES.security} className="hs-dark-link">
              Read our security policy
              <Icon name="arrow_forward" size={18} />
            </SmartLink>
          </div>
          <div className="hs-dark-art">
            <div className="hs-dark-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/undraw_device-sync_d9ei.svg" alt="" />
            </div>
            <span className="hs-dark-chip hs-dark-chip-a">
              <Icon name="verified_user" size={18} color="#34D399" />
              Access controlled
            </span>
            <span className="hs-dark-chip hs-dark-chip-b">
              <Icon name="fact_check" size={18} color="#60A5FA" />
              Audit ready
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── Testimonials ───────── */
export function TestimonialsSection() {
  const quotes: Array<[string, string, Tone]> = [
    ['Clock-in finally works for our field team.', 'Ops Manager', 'blue'],
    ['Web dashboards help us spot late days early.', 'HR Lead', 'violet'],
    ['Employees love the leave + chat flow.', 'Company Admin', 'green'],
  ];
  return (
    <Section tint>
      <Head eyebrow="Testimonials" title="Loved by growing teams" sub="Simple words from teams who track attendance every day." />
      <div className="hs-quotes">
        {quotes.map(([q, role, tone]) => (
          <figure className={cx('hs-quote', `tone-${tone}`)} key={role}>
            <span className="hs-quote-mark" aria-hidden="true">
              “
            </span>
            <blockquote>{q}</blockquote>
            <figcaption>
              <span className="hs-avatar">
                <Icon name="person" size={22} color="#fff" />
              </span>
              <span>
                <b>{role}</b>
                <span>Teamital customer</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}

/* ───────── Why us ───────── */
export function WhyUsSection() {
  const items: Array<[string, string, string, Tone]> = [
    ['verified_user', 'Honest attendance', 'GPS and biometric checks cut buddy punching and fake punches.', 'blue'],
    ['speed', 'Live ops view', 'Managers see who is in, late, or on leave without spreadsheet chase.', 'amber'],
    ['devices', 'One stack everywhere', 'Web, Android, iOS and desktop share the same workforce data.', 'violet'],
  ];
  return (
    <Section>
      <Head eyebrow="Why Teamital" title="Why teams switch to us" sub="Clear outcomes for HR, ops and field supervisors." />
      <div className="hs-why">
        {items.map(([icon, title, text, tone], i) => (
          <div className={cx('hs-why-card', `tone-${tone}`)} key={title}>
            <span className="hs-why-num">0{i + 1}</span>
            <span className="tile hs-tile">
              <Icon name={icon} size={26} />
            </span>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ───────── Toolkit ───────── */
export function ToolkitSection() {
  const chips: Array<[string, string, Tone]> = [
    ['GPS', 'location_on', 'blue'],
    ['Face ID', 'face_retouching_natural', 'violet'],
    ['Fingerprint', 'fingerprint', 'green'],
    ['Leave', 'beach_access', 'amber'],
    ['Tasks', 'task_alt', 'sky'],
    ['Reports', 'ios_share', 'rose'],
  ];
  return (
    <Section tint>
      <Head
        eyebrow="Toolkit"
        title="Built-in workforce toolkit"
        sub="No patchwork of apps — attendance, leave, tasks and chat together."
      />
      <div className="hs-toolkit">
        {chips.map(([label, icon, tone]) => (
          <div className={cx('hs-tool', `tone-${tone}`)} key={label}>
            <span className="tile hs-tile">
              <Icon name={icon} size={26} />
            </span>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ───────── Stats ───────── */
export function StatsSection() {
  const stats = [
    ['99.9%', 'Uptime focus', 'cloud_done'],
    ['4', 'Platforms', 'devices'],
    ['1', 'Source of truth', 'database'],
    ['24/7', 'Live clock data', 'schedule'],
  ];
  return (
    <section className="hs hs-stats-wrap">
      <div className="hs-in">
        <div className="hs-stats">
          <span className="hs-dark-glow hs-dark-glow-a" aria-hidden="true" />
          {stats.map(([v, l, icon]) => (
            <div className="hs-stat" key={l}>
              <span className="hs-stat-ico">
                <Icon name={icon} size={22} color="#fff" />
              </span>
              <div className="hs-stat-v">
                <CountUp value={v} />
              </div>
              <div className="hs-stat-l">{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────── FAQ ───────── */
export function FaqSection() {
  const faqs: Array<[string, string]> = [
    ['Does it work on mobile and web?', 'Yes — Android, iOS, web and desktop share the same Teamital experience.'],
    ['Can employees clock in with GPS?', 'Yes. Admins can require GPS (and biometric/face) for clock-in and clock-out.'],
    ['Is there a company admin dashboard?', 'Company admins manage employees, attendance, leave, tasks and reports from the web.'],
  ];
  return (
    <Section>
      <div className="hs-faq">
        <div className="hs-faq-side">
          <span className="hs-eyebrow">FAQ</span>
          <h2>Quick answers before you sign up</h2>
          <p>Everything you need to know to get started with Teamital.</p>
          <div className="hs-faq-art" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/undraw_questions_52ic.svg" alt="" />
          </div>
          <SmartLink href={ROUTES.contact} className="hs-faq-link">
            <Icon name="mail_outline" size={18} />
            Still have questions? Contact us
          </SmartLink>
        </div>
        <div className="hs-faq-list">
          {faqs.map(([q, a]) => (
            <details className="hs-faq-item" key={q}>
              <summary>
                <span>{q}</span>
                <span className="hs-faq-plus" aria-hidden="true">
                  <Icon name="add" size={22} />
                </span>
              </summary>
              <div className="hs-faq-a">{a}</div>
            </details>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ───────── Closing CTA ───────── */
export function CtaSection() {
  return (
    <section className="hs hs-cta-wrap">
      <div className="hs-in">
        <div className="hs-cta">
          <span className="hs-dark-glow hs-dark-glow-a" aria-hidden="true" />
          <span className="hs-dark-glow hs-dark-glow-b" aria-hidden="true" />
          <h2>Ready to track your workforce?</h2>
          <p>Create your company account in minutes.</p>
          <div className="hs-cta-btns">
            <SmartLink href={ROUTES.signUp} className="hero-btn hero-btn-light">
              <span>Sign up now</span>
              <Icon name="arrow_forward" size={20} color="#1A56DB" />
            </SmartLink>
            <SmartLink href={ROUTES.contact} className="hero-btn hero-btn-glass">
              Talk to our team
            </SmartLink>
          </div>
        </div>
      </div>
    </section>
  );
}
