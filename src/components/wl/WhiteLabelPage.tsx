import { WL, type Tone } from '@/content/white-label';
import { ROUTES } from '@/lib/config';
import { Aos } from '../Aos';
import { SitePage } from '../SitePage';
import { Icon, SmartLink, cx } from '../ui';
import { BuildShowcase } from './BuildShowcase';
import { PartnerVisual } from './PartnerVisual';
import { ProfilesShowcase } from './ProfilesShowcase';

const CONTACT = ROUTES.contact;
const LAUNCH_ICONS = ['event', 'handshake', 'palette', 'sell', 'group_add', 'rocket_launch'];

function SectionHead({ title, intro, center = true }: { title: string; intro?: string; center?: boolean }) {
  return (
    <div className={cx('wl-head', center && 'wl-head-center')}>
      <h2>{title}</h2>
      {intro && <p>{intro}</p>}
    </div>
  );
}

function Tile({ icon, tone }: { icon: string; tone: Tone }) {
  return (
    <span className={cx('tile', `tone-${tone}`)}>
      <Icon name={icon} size={24} />
    </span>
  );
}

export function WhiteLabelPage() {
  const tones: Tone[] = ['blue', 'violet', 'green', 'amber', 'rose', 'sky'];
  return (
    <SitePage compactBelow={980} overlayHeader background="#fff">
      {/* Hero */}
      <section className="wl-hero">
        <div className="wl-hero-in">
          <div className="wl-hero-copy">
            <span className="bhero-pill">
              <span className="bhero-dot" />
              White Label Program
            </span>
            <h1>{WL.hero.title}</h1>
            <p className="wl-tagline">{WL.hero.tagline}</p>
            <p className="wl-hero-text">{WL.hero.text}</p>
            <div className="wl-btns">
              <SmartLink href={CONTACT} className="hero-btn hero-btn-primary">
                <span>{WL.hero.primary}</span>
                <Icon name="arrow_forward" size={20} color="#fff" className="hero-btn-arrow" />
              </SmartLink>
              <SmartLink href={CONTACT} className="hero-btn hero-btn-ghost">
                <Icon name="event" size={20} color="#1A56DB" />
                <span>{WL.hero.secondary}</span>
              </SmartLink>
            </div>
            <ul className="hc-trust">
              <li><Icon name="check_circle" size={18} color="#10B981" />Your name, logo and domain</li>
              <li><Icon name="check_circle" size={18} color="#10B981" />Your own pricing</li>
              <li><Icon name="check_circle" size={18} color="#10B981" />24/7 technical support</li>
            </ul>
          </div>
          <Aos fromRight>
            <PartnerVisual />
          </Aos>
        </div>
      </section>

      {/* Build your own software brand */}
      <section className="wl-sec">
        <div className="wl-in">
          <div className="wl-build">
            <h2 className="wl-build-title">{WL.build.title}</h2>
            <div className="wl-build-copy">
              {WL.build.paragraphs.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <BuildShowcase items={WL.build.pillars} />
          </div>
        </div>
      </section>

      {/* Why choose */}
      <section className="wl-sec wl-sec-tint">
        <div className="wl-in">
          <SectionHead title={WL.why.title} intro={WL.why.intro} />
          <BuildShowcase items={WL.why.cards} compact />
          <div className="wl-center">
            <SmartLink href={CONTACT} className="hero-btn hero-btn-primary">
              <span>{WL.why.cta}</span>
              <Icon name="arrow_forward" size={20} color="#fff" className="hero-btn-arrow" />
            </SmartLink>
          </div>
        </div>
      </section>

      {/* Partner portal: sticky contents list + numbered timeline (same pattern as the guides) */}
      <section className="wl-sec">
        <div className="wl-in">
          <SectionHead title={WL.portal.title} intro={WL.portal.intro} />
          <div className="guide-in wl-portal">
            <aside className="gtoc" aria-label="Partner portal sections">
              <div className="gtoc-t">In this portal</div>
              <ol>
                {WL.portal.items.map((c, i) => (
                  <li key={c.title}>
                    <a href={`#portal-${i + 1}`}>
                      <span className="gtoc-n">{i + 1}</span>
                      {c.title}
                    </a>
                  </li>
                ))}
              </ol>
            </aside>
            <ol className="gsteps">
              {WL.portal.items.map((c, i) => (
                <li className="gstep" id={`portal-${i + 1}`} key={c.title}>
                  <div className="gstep-rail">
                    <span className="gstep-n tone-blue">{i + 1}</span>
                  </div>
                  <div className="gstep-card">
                    <div className="gstep-head">
                      <span className="tile tone-blue">
                        <Icon name={c.icon} size={22} />
                      </span>
                      <h3>{c.title}</h3>
                    </div>
                    <p>{c.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Solutions under your brand */}
      <section className="wl-sec wl-sec-tint">
        <div className="wl-in">
          <SectionHead title={WL.solutions.title} intro={WL.solutions.intro} />
          <ProfilesShowcase
            profiles={[
              { ...WL.solutions.admin, icon: 'admin_panel_settings', tone: 'blue' },
              { ...WL.solutions.employee, icon: 'badge', tone: 'green' },
            ]}
          />

          <Aos>
            <div className="wl-one">
              <div>
                <h3>{WL.solutions.oneTitle}</h3>
                {WL.solutions.onePara.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
              <div className="wl-btns wl-btns-col">
                <SmartLink href={CONTACT} className="hero-btn hero-btn-light">
                  {WL.hero.primary}
                </SmartLink>
                <SmartLink href={CONTACT} className="hero-btn hero-btn-glass">
                  {WL.hero.secondary}
                </SmartLink>
              </div>
            </div>
          </Aos>
        </div>
      </section>

      {/* Who can start */}
      <section className="wl-sec">
        <div className="wl-in">
          <SectionHead title={WL.who.title} intro={WL.who.intro} />
          <div className="wl-grid wl-grid-3">
            {WL.who.cards.map((c, i) => (
              <Aos key={c.title} delay={(i % 3) * 60}>
                <div className="wl-card wl-card-who">
                  <Tile icon={c.icon} tone={c.tone ?? 'blue'} />
                  <h3>{c.title}</h3>
                  <p>{c.text}</p>
                </div>
              </Aos>
            ))}
          </div>
        </div>
      </section>

      {/* How to launch */}
      <section className="wl-sec wl-sec-tint">
        <div className="wl-in">
          <SectionHead title={WL.launch.title} intro={WL.launch.intro} />
          <ol className="lt">
            {WL.launch.steps.map(([title, text], i) => {
              const [, name] = title.split(/:\s*/);
              const side = i % 2 === 0 ? 'lt-left' : 'lt-right';
              const icon = LAUNCH_ICONS[i] ?? 'flag';
              return (
                <li className={cx('lt-item', side)} key={title}>
                  <Aos fromLeft={i % 2 === 0} fromRight={i % 2 === 1} delay={40}>
                    <div className={cx('lt-card', `tone-${tones[i % tones.length]}`)}>
                      <div className="lt-card-top">
                        <span className="lt-ico">
                          <Icon name={icon} size={24} />
                        </span>
                        <span className="lt-chip">Step {i + 1}</span>
                      </div>
                      <h3>{name ?? title}</h3>
                      <p>{text}</p>
                    </div>
                  </Aos>
                  <span className="lt-node" aria-hidden="true">
                    {i + 1}
                  </span>
                </li>
              );
            })}
          </ol>
          <div className="wl-center">
            <SmartLink href={CONTACT} className="hero-btn hero-btn-primary">
              <span>{WL.launch.cta}</span>
              <Icon name="arrow_forward" size={20} color="#fff" className="hero-btn-arrow" />
            </SmartLink>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="wl-sec">
        <div className="wl-in wl-in-narrow">
          <SectionHead title={WL.faq.title} />
          <div className="gfaq">
            {WL.faq.items.map(([q, a]) => (
              <details className="faq-item" key={q}>
                <summary>
                  <span>{q}</span>
                  <Icon name="expand_more" size={24} color="#45464F" className="faq-chev" />
                </summary>
                <div className="faq-a">{a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="wl-final">
        <div className="wl-final-in">
          <h2>Our Platform. Your Brand. Your Business.</h2>
          <p>Talk to our team and see the White Label Partner Portal in action.</p>
          <div className="wl-btns wl-btns-center">
            <SmartLink href={CONTACT} className="hero-btn hero-btn-light">
              {WL.hero.primary}
            </SmartLink>
            <SmartLink href={CONTACT} className="hero-btn hero-btn-glass">
              {WL.hero.secondary}
            </SmartLink>
          </div>
        </div>
      </section>
    </SitePage>
  );
}
