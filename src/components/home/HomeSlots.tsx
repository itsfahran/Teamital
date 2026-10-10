import type { ReactNode } from 'react';
import type { HomeSlot } from '@/lib/cms';
import { cx, Pill } from '../ui';

type Props = {
  slot: HomeSlot;
  /** Hrefs for the primary / secondary pill. */
  primaryHref: string;
  secondaryHref: string;
};

/** Section frame (_pad): white band, content max 1140. */
function Pad({ children }: { children: ReactNode }) {
  return (
    <div className="slot-pad">
      <div className="slot-pad-in">{children}</div>
    </div>
  );
}

export function HomeSlotView({ slot, primaryHref, secondaryHref }: Props) {
  switch (slot.variant) {
    case 'ops-board':
      return <Ops slot={slot} primaryHref={primaryHref} secondaryHref={secondaryHref} />;
    case 'feature-chart':
      return <FeatureChart slot={slot} />;
    case 'story-rows':
      return <StoryRows slot={slot} />;
    case 'ai-insight':
      return <AiInsight slot={slot} primaryHref={primaryHref} />;
    case 'topic-menu':
      return <TopicMenu slot={slot} primaryHref={primaryHref} />;
    case 'ask-banner':
      return <AskBanner slot={slot} primaryHref={primaryHref} secondaryHref={secondaryHref} />;
    default:
      return <DeviceTracking slot={slot} />;
  }
}

function DeviceTracking({ slot }: { slot: HomeSlot }) {
  const lines = slot.items.length
    ? slot.items
    : ['Manual timer start and stop', 'Project and task selection', 'Optional photos', 'App tracking'];
  return (
    <Pad>
      <div className="slot-two slot-two-900">
        <div className="slot-col">
          <h2 className="slot-h slot-h-primary">{slot.heading || 'Personal device tracking'}</h2>
          <p className="slot-p slot-p-16">
            {slot.body || 'Employees clock in on their own devices, and tracking stops when they clock out.'}
          </p>
          <div className="slot-dots">
            {lines.map((line, i) => (
              <div className="slot-dot-row" key={i}>
                <span className="slot-dot" />
                <span>{line}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="slot-col">
          <div className="dev-card">
            <div className="dev-card-in">
              <div className="dev-timer">00:21:25</div>
              <div className="dev-on">On site</div>
              <div className="dev-total">Total today 8:12</div>
            </div>
          </div>
        </div>
      </div>
    </Pad>
  );
}

function Ops({ slot, primaryHref, secondaryHref }: Props) {
  return (
    <Pad>
      <div className="slot-two slot-two-960 slot-ops">
        <div className="slot-col">
          <h2 className="slot-h slot-h-ops">{slot.heading || 'See how your team spends the day'}</h2>
          <p className="slot-p slot-p-16 slot-p-ops">
            {slot.body || 'Live attendance, breaks, and hours in one view.'}
          </p>
          <div className="slot-pills">
            <Pill variant="slot" filled href={primaryHref} label={slot.button || 'Book a demo'} />
            <Pill variant="slot" filled={false} href={secondaryHref} label={slot.button2 || 'Start free trial'} />
          </div>
        </div>
        <div className="slot-col">
          <div className="mini-board">
            <div className="mini-board-title">Activities</div>
            {[
              ['Ayesha', 0.9],
              ['Hamza', 0.35],
              ['Sara', 0.7],
            ].map(([n, v]) => (
              <div className="mini-board-row" key={String(n)}>
                <span>{n}</span>
                <div className="mini-track">
                  <div className="mini-fill" style={{ width: `${Number(v) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Pad>
  );
}

function FeatureChart({ slot }: { slot: HomeSlot }) {
  const lines = slot.items.length
    ? slot.items
    : [
        'Real-time monitoring|See who is on site right now.',
        'Time and attendance|Hours are recorded as people clock in.',
        'Manual entries|Add a missing punch when needed.',
        'Reports|Review hours by team and day.',
      ];
  return (
    <Pad>
      <div className="slot-two slot-two-900 slot-fc">
        <div className="slot-col slot-fc-list">
          {lines.map((l, i) => (
            <div className={cx('fc-item', i === lines.length - 1 && 'fc-item-last')} key={i}>
              <div className="fc-title">{l.split('|')[0]}</div>
              {l.includes('|') && <div className="fc-sub">{l.split('|').slice(-1)[0]}</div>}
            </div>
          ))}
        </div>
        <div className="slot-col">
          <div className="bar-card">
            <div className="bar-card-title">Hours this week</div>
            <div className="bar-card-bars">
              {[40, 70, 55, 90, 64, 78, 48].map((h, i) => (
                <div className="bar-card-col" key={i}>
                  <div style={{ height: h }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Pad>
  );
}

function StoryRows({ slot }: { slot: HomeSlot }) {
  const lines =
    slot.items.length >= 2
      ? slot.items
      : [
          'Clearer project estimates|Hours show how long work really takes.',
          'Spot overload early|See when a team is carrying too many hours.',
        ];
  const row = (raw: string, flip: boolean) => {
    const parts = raw.split('|');
    const text = (
      <div className="story-text">
        <div className="story-title">{parts[0]}</div>
        <div className="story-body">{parts.length > 1 ? parts[1] : ''}</div>
      </div>
    );
    const art = (
      <div className="story-art">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={flip ? '/assets/home/workload.jpg' : '/assets/home/estimates.jpg'} alt="" />
      </div>
    );
    return (
      <div className={cx('story-row', flip && 'story-row-flip')}>
        {flip ? art : text}
        {flip ? text : art}
        {/* narrow layout always shows art first */}
      </div>
    );
  };
  return (
    <Pad>
      <div className="story">
        {row(lines[0], false)}
        {row(lines[1], true)}
      </div>
    </Pad>
  );
}

function AiInsight({ slot, primaryHref }: { slot: HomeSlot; primaryHref: string }) {
  const lines = slot.items.length
    ? slot.items
    : ['Average day is about 8 hours', 'On-site rate is steady this week', 'One team is over the usual hours'];
  return (
    <Pad>
      <div className="slot-two slot-two-900 slot-ai">
        <div className="slot-col">
          <h2 className="slot-h slot-h-ai">{slot.heading || 'A clearer view of the workday'}</h2>
          <p className="slot-p slot-p-16 slot-p-ai">
            {slot.body || 'Attendance and hours, summarized so managers can act on the day, not guess.'}
          </p>
          <Pill variant="slot" filled href={primaryHref} label={slot.button || 'Start free trial'} />
        </div>
        <div className="slot-col">
          <div className="ai-chat">
            <div className="ai-chat-title">Today</div>
            {lines.map((l, i) => (
              <div className="ai-chat-line" key={i}>
                • {l}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Pad>
  );
}

function TopicMenu({ slot, primaryHref }: { slot: HomeSlot; primaryHref: string }) {
  const topics = slot.items.length ? slot.items : ['Leave requests', 'Clock in and out', 'Shifts', 'Reports'];
  return (
    <div className="topic-wrap">
      <div className="topic-in">
        <div className="topic-card">
          <div className="topic-menu">
            {topics.map((t, i) => (
              <div className={cx('topic-item', i === 0 && 'topic-item-on')} key={i}>
                {t}
              </div>
            ))}
          </div>
          <div className="topic-panel">
            <h3 className="topic-h">{slot.heading || 'Leave your team can request'}</h3>
            <p className="topic-p">
              {slot.body || 'People see their balance, request time off, and managers approve it in the same place.'}
            </p>
            <Pill variant="slot" filled href={primaryHref} label={slot.button || 'Open leave'} />
          </div>
        </div>
      </div>
    </div>
  );
}

function AskBanner({ slot, primaryHref, secondaryHref }: Props) {
  return (
    <div className="ask-wrap">
      <div className="ask-in">
        <div className="ask-box">
          <h2 className="ask-h">{slot.heading || 'Want a closer look?'}</h2>
          <p className="ask-p">{slot.body || 'Book a demo or start a free trial. No credit card required.'}</p>
          <div className="ask-pills">
            <Pill variant="slot" filled={false} href={primaryHref} label={slot.button || 'Book a demo'} />
            <Pill variant="slot" filled={false} href={secondaryHref} label={slot.button2 || 'Start free trial'} />
          </div>
        </div>
      </div>
    </div>
  );
}
