import type { CSSProperties } from 'react';
import type { HomeContent } from '@/content/home';
import { Icon } from '../ui';

const idx = (i: number) => ({ '--i': i }) as CSSProperties;

/** Animated product mockup for the hero: a live team-chat card with floating status widgets. */
export function HeroVisual({ c }: { c: HomeContent['heroChat'] }) {
  const MESSAGES = c.messages;
  return (
    <div className="hv" aria-hidden="true">
      <div className="hv-blob hv-blob-a" />
      <div className="hv-blob hv-blob-b" />

      <div className="hv-chat">
        <div className="hv-head">
          <div className="hv-avatar">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.avatar || '/assets/logo.jpg'} alt="" width={46} height={46} />
          </div>
          <div className="hv-head-txt">
            <div className="hv-name">{c.name}</div>
            <div className="hv-status">
              <span className="hv-dot" />
              {c.status}
            </div>
          </div>
          <Icon name="more_horiz" size={22} color="#6B7280" />
        </div>

        <div className="hv-msgs">
          {MESSAGES.map((m, i) =>
            m.kind === 'card' ? (
              <div className="hv-row hv-row-in hv-pop" style={idx(i)} key={i}>
                <div className="hv-card">
                  <span className="hv-card-ico">
                    <Icon name="check" size={18} color="#fff" />
                  </span>
                  <span>
                    <span className="hv-card-t">{m.text}</span>
                    <span className="hv-card-m">{m.meta}</span>
                  </span>
                </div>
              </div>
            ) : (
              <div className={`hv-row hv-row-${m.kind === 'out' ? 'out' : 'in'} hv-pop`} style={idx(i)} key={i}>
                <div className={`hv-bubble hv-bubble-${m.kind === 'out' ? 'out' : 'in'}`}>{m.text}</div>
              </div>
            ),
          )}
          <div className="hv-row hv-row-in hv-pop" style={idx(MESSAGES.length)}>
            <div className="hv-bubble hv-bubble-in hv-typing">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>

        <div className="hv-input">
          <span>{c.placeholder}</span>
          <span className="hv-send">
            <Icon name="send" size={16} color="#fff" />
          </span>
        </div>
      </div>

      <div className="hv-float hv-float-a">
        <span className="hv-float-ico hv-float-ico-green">
          <Icon name="gps_fixed" size={22} color="#fff" />
        </span>
        <span>
          <span className="hv-float-t">{c.gps.title}</span>
          <span className="hv-float-m">{c.gps.meta}</span>
        </span>
      </div>

      <div className="hv-float hv-float-b">
        <div className="hv-float-m">{c.timer.label}</div>
        <div className="hv-timer">{c.timer.value}</div>
        <div className="hv-bar">
          <div />
        </div>
      </div>

      <div className="hv-float hv-float-c">
        <div className="hv-float-m">{c.chart.label}</div>
        <div className="hv-bars">
          {[44, 62, 52, 78, 66, 88, 58].map((h, i) => (
            <span key={i} style={{ height: h * 0.45, animationDelay: `${i * 0.12}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
