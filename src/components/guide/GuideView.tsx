import Link from 'next/link';
import { GUIDES, type Guide } from '@/content/guides';
import { ROUTES } from '@/lib/config';
import { SitePage } from '../SitePage';
import { Icon, SmartLink, cx } from '../ui';

export function GuideView({ guide }: { guide: Guide }) {
  const other = GUIDES.find((g) => g.slug !== guide.slug)!;
  return (
    <SitePage compactBelow={980} overlayHeader background="#fff">
      <section className="bhero ghero">
        <div className="bhero-in ghero-in">
          <span className="bhero-pill">
            <Icon name={guide.icon} size={16} color="#1A56DB" />
            {guide.audience}
          </span>
          <h1 className="bhero-title">{guide.title}</h1>
          <p className="bhero-sub">{guide.subtitle}</p>
          <div className="gmeta">
            <span>
              <Icon name="format_list_numbered" size={18} color="#1A56DB" />
              {guide.steps.length} steps
            </span>
            <span>
              <Icon name="schedule" size={18} color="#1A56DB" />
              {guide.readMins} min read
            </span>
          </div>
        </div>
      </section>

      <section className="guide">
        <div className="guide-in">
          <aside className="gtoc" aria-label="On this page">
            <div className="gtoc-t">In this guide</div>
            <ol>
              {guide.steps.map((s, i) => (
                <li key={s.title}>
                  <a href={`#step-${i + 1}`}>
                    <span className="gtoc-n">{i + 1}</span>
                    {s.title}
                  </a>
                </li>
              ))}
              <li>
                <a href="#faq">
                  <span className="gtoc-n">
                    <Icon name="help" size={14} />
                  </span>
                  FAQs
                </a>
              </li>
            </ol>
          </aside>

          <div className="gmain">
            <ol className="gsteps">
              {guide.steps.map((s, i) => (
                <li className="gstep" id={`step-${i + 1}`} key={s.title}>
                  <div className="gstep-rail">
                    <span className={cx('gstep-n', `tone-${guide.tone}`)}>{i + 1}</span>
                  </div>
                  <div className="gstep-card">
                    <div className="gstep-head">
                      <span className={cx('tile', `tone-${guide.tone}`)}>
                        <Icon name={s.icon} size={22} />
                      </span>
                      <h2>{s.title}</h2>
                    </div>
                    <p>{s.text}</p>
                    {s.bullets && (
                      <ul>
                        {s.bullets.map((b) => (
                          <li key={b}>
                            <Icon name="check_circle" size={18} color="#10B981" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              ))}
            </ol>

            <div className="gtips">
              <div className="gtips-t">
                <Icon name="lightbulb" size={20} color="#D97706" />
                Pro tips
              </div>
              <ul>
                {guide.tips.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>

            <h2 className="gfaq-t" id="faq">
              Frequently asked questions
            </h2>
            <div className="gfaq">
              {guide.faqs.map(([q, a]) => (
                <details className="faq-item" key={q}>
                  <summary>
                    <span>{q}</span>
                    <Icon name="expand_more" size={24} color="#45464F" className="faq-chev" />
                  </summary>
                  <div className="faq-a">{a}</div>
                </details>
              ))}
            </div>

            <Link href={other.path} className="gother">
              <span className={cx('tile', `tone-${other.tone}`)}>
                <Icon name={other.icon} size={22} />
              </span>
              <span className="gother-txt">
                <span className="gother-k">Also read</span>
                <span className="gother-t">{other.title}</span>
              </span>
              <Icon name="arrow_forward" size={20} color="#1A56DB" />
            </Link>

            <div className="bcta bcta-post">
              <div>
                <div className="bcta-t">Ready to get started?</div>
                <div className="bcta-s">Create your account and follow along. It takes a few minutes.</div>
              </div>
              <SmartLink href={ROUTES.signUp} className="hero-btn hero-btn-light">
                Start free trial
              </SmartLink>
            </div>
          </div>
        </div>
      </section>
    </SitePage>
  );
}
