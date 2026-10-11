import type { CSSProperties } from 'react';
import { Icon } from '../ui';

type Msg =
  | { kind: 'in' | 'out'; text: string }
  | { kind: 'card'; title: string; meta: string };

const MESSAGES: Msg[] = [
  { kind: 'in', text: 'Good morning! Your shift starts at 9:00 AM at Dublin HQ.' },
  { kind: 'out', text: 'On my way, clocking in now.' },
  { kind: 'card', title: 'Clock-in confirmed', meta: '08:58 AM · GPS verified · On site' },
  { kind: 'out', text: 'Can I request leave for Friday?' },
  { kind: 'in', text: 'Approved. Enjoy the long weekend!' },
];

const idx = (i: number) => ({ '--i': i }) as CSSProperties;

/** Animated product mockup for the hero: a live team-chat card with floating status widgets. */
export function HeroVisual() {
  return (
    <div className="hv" aria-hidden="true">
      <div className="hv-blob hv-blob-a" />
      <div className="hv-blob hv-blob-b" />

      <div className="hv-chat">
        <div className="hv-head">
          <div className="hv-avatar">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo.jpg" alt="" width={46} height={46} />
          </div>
          <div className="hv-head-txt">
            <div className="hv-name">Teamital HR</div>
            <div className="hv-status">
              <span className="hv-dot" />
              Online now
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
                    <span className="hv-card-t">{m.title}</span>
                    <span className="hv-card-m">{m.meta}</span>
                  </span>
                </div>
              </div>
            ) : (
              <div className={`hv-row hv-row-${m.kind} hv-pop`} style={idx(i)} key={i}>
                <div className={`hv-bubble hv-bubble-${m.kind}`}>{m.text}</div>
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
          <span>Type a message…</span>
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
          <span className="hv-float-t">GPS verified</span>
          <span className="hv-float-m">Dublin HQ · 12 m</span>
        </span>
      </div>

      <div className="hv-float hv-float-b">
        <div className="hv-float-m">On site today</div>
        <div className="hv-timer">06:42:10</div>
        <div className="hv-bar">
          <div />
        </div>
      </div>

      <div className="hv-float hv-float-c">
        <div className="hv-float-m">Attendance this week</div>
        <div className="hv-bars">
          {[44, 62, 52, 78, 66, 88, 58].map((h, i) => (
            <span key={i} style={{ height: h * 0.45, animationDelay: `${i * 0.12}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
