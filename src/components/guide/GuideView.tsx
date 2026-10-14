import Link from 'next/link';
import type { GuideDocItem, GuidesDoc } from '@/content/guides';
import { ROUTES } from '@/lib/config';
import { plainText } from '@/lib/content/utils';
import { RichText } from '../RichText';
import { SitePage } from '../SitePage';
import { Icon, SmartLink, cx } from '../ui';

export function GuideView({ guide, other, labels, cta }: { guide: GuideDocItem; other: GuideDocItem; labels: GuidesDoc['labels']; cta: GuidesDoc['cta'] }) {
  return (
    <SitePage compactBelow={980} overlayHeader background="#fff">
      <section className="bhero ghero">
        <div className="bhero-in ghero-in">
          <span className="bhero-pill">
            <Icon name={guide.icon} size={16} color="#1A56DB" />
            {guide.audience}
          </span>
          <h1 className="bhero-title">{guide.title}</h1>
          <RichText className="bhero-sub" value={guide.subtitle} />
          <div className="gmeta">
            <span>
              <Icon name="format_list_numbered" size={18} color="#1A56DB" />
              {guide.steps.length} {labels.stepsWord}
            </span>
            <span>
              <Icon name="schedule" size={18} color="#1A56DB" />
              {guide.readMins} {labels.minRead}
            </span>
          </div>
        </div>
      </section>

      <section className="guide">
        <div className="guide-in">
          <aside className="gtoc" aria-label="On this page">
            <div className="gtoc-t">{labels.inThisGuide}</div>
            <ol>
              {guide.steps.map((s, i) => (
                <li key={i}>
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
                  {labels.faqLink}
                </a>
              </li>
            </ol>
          </aside>

          <div className="gmain">
            <ol className="gsteps">
              {guide.steps.map((s, i) => (
                <li className="gstep" id={`step-${i + 1}`} key={i}>
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
                    <RichText value={s.text} />
                    {s.bullets.length > 0 && (
                      <ul>
                        {s.bullets.map((b, j) => (
                          <li key={j}>
                            <Icon name="check_circle" size={18} color="#10B981" />
                            <span>{plainText(b)}</span>
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
                {labels.proTips}
              </div>
              <ul>
                {guide.tips.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>

            <h2 className="gfaq-t" id="faq">
              {labels.faqTitle}
            </h2>
            <div className="gfaq">
              {guide.faqs.map((f, i) => (
                <details className="faq-item" key={i}>
                  <summary>
                    <span>{f.q}</span>
                    <Icon name="expand_more" size={24} color="#45464F" className="faq-chev" />
                  </summary>
                  <div className="faq-a">
                    <RichText value={f.a} />
                  </div>
                </details>
              ))}
            </div>

            <Link href={other.path} className="gother">
              <span className={cx('tile', `tone-${other.tone}`)}>
                <Icon name={other.icon} size={22} />
              </span>
              <span className="gother-txt">
                <span className="gother-k">{labels.alsoRead}</span>
                <span className="gother-t">{other.title}</span>
              </span>
              <Icon name="arrow_forward" size={20} color="#1A56DB" />
            </Link>

            <div className="bcta bcta-post">
              <div>
                <div className="bcta-t">{cta.title}</div>
                <div className="bcta-s">{plainText(cta.text)}</div>
              </div>
              <SmartLink href={ROUTES.signUp} className="hero-btn hero-btn-light">
                {cta.button}
              </SmartLink>
            </div>
          </div>
        </div>
      </section>
    </SitePage>
  );
}
