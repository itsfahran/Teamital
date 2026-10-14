import type { ReactNode } from 'react';
import type { HomeVariants } from '@/content/home';
import type { HomeSlot } from '@/lib/cms';
import { cx, Pill } from '../ui';

type Props = {
  slot: HomeSlot;
  v: HomeVariants['slots'];
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

export function HomeSlotView({ slot, v, primaryHref, secondaryHref }: Props) {
  switch (slot.variant) {
    case 'ops-board':
      return <Ops slot={slot} v={v} primaryHref={primaryHref} secondaryHref={secondaryHref} />;
    case 'feature-chart':
      return <FeatureChart slot={slot} v={v} />;
    case 'story-rows':
      return <StoryRows slot={slot} v={v} />;
    case 'ai-insight':
      return <AiInsight slot={slot} v={v} primaryHref={primaryHref} />;
    case 'topic-menu':
      return <TopicMenu slot={slot} v={v} primaryHref={primaryHref} />;
    case 'ask-banner':
      return <AskBanner slot={slot} v={v} primaryHref={primaryHref} secondaryHref={secondaryHref} />;
    default:
      return <DeviceTracking slot={slot} v={v} />;
  }
}

function DeviceTracking({ slot, v }: { slot: HomeSlot; v: HomeVariants['slots'] }) {
  const lines = slot.items.length
    ? slot.items
    : v.deviceLines;
  return (
    <Pad>
      <div className="slot-two slot-two-900">
        <div className="slot-col">
          <h2 className="slot-h slot-h-primary">{slot.heading || v.deviceHeading}</h2>
          <p className="slot-p slot-p-16">
            {slot.body || v.deviceBody}
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
              <div className="dev-timer">{v.deviceTimer}</div>
              <div className="dev-on">{v.deviceOn}</div>
              <div className="dev-total">{v.deviceTotal}</div>
            </div>
          </div>
        </div>
      </div>
    </Pad>
  );
}

function Ops({ slot, v, primaryHref, secondaryHref }: Props) {
  return (
    <Pad>
      <div className="slot-two slot-two-960 slot-ops">
        <div className="slot-col">
          <h2 className="slot-h slot-h-ops">{slot.heading || v.opsHeading}</h2>
          <p className="slot-p slot-p-16 slot-p-ops">
            {slot.body || v.opsBody}
          </p>
          <div className="slot-pills">
            <Pill variant="slot" filled href={primaryHref} label={slot.button || v.opsA} />
            <Pill variant="slot" filled={false} href={secondaryHref} label={slot.button2 || v.opsB} />
          </div>
        </div>
        <div className="slot-col">
          <div className="mini-board">
            <div className="mini-board-title">{v.opsBoardTitle}</div>
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

function FeatureChart({ slot, v }: { slot: HomeSlot; v: HomeVariants['slots'] }) {
  const lines = slot.items.length
    ? slot.items
    : v.chartLines;
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
            <div className="bar-card-title">{v.chartTitle}</div>
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

function StoryRows({ slot, v }: { slot: HomeSlot; v: HomeVariants['slots'] }) {
  const lines =
    slot.items.length >= 2
      ? slot.items
      : v.storyLines;
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
        <img src={flip ? v.storyImageB : v.storyImageA} alt="" />
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

function AiInsight({ slot, v, primaryHref }: { slot: HomeSlot; v: HomeVariants['slots']; primaryHref: string }) {
  const lines = slot.items.length
    ? slot.items
    : v.aiLines;
  return (
    <Pad>
      <div className="slot-two slot-two-900 slot-ai">
        <div className="slot-col">
          <h2 className="slot-h slot-h-ai">{slot.heading || v.aiHeading}</h2>
          <p className="slot-p slot-p-16 slot-p-ai">
            {slot.body || v.aiBody}
          </p>
          <Pill variant="slot" filled href={primaryHref} label={slot.button || v.aiButton} />
        </div>
        <div className="slot-col">
          <div className="ai-chat">
            <div className="ai-chat-title">{v.aiTitle}</div>
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

function TopicMenu({ slot, v, primaryHref }: { slot: HomeSlot; v: HomeVariants['slots']; primaryHref: string }) {
  const topics = slot.items.length ? slot.items : v.topics;
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
            <h3 className="topic-h">{slot.heading || v.topicHeading}</h3>
            <p className="topic-p">
              {slot.body || v.topicBody}
            </p>
            <Pill variant="slot" filled href={primaryHref} label={slot.button || v.topicButton} />
          </div>
        </div>
      </div>
    </div>
  );
}

function AskBanner({ slot, v, primaryHref, secondaryHref }: Props) {
  return (
    <div className="ask-wrap">
      <div className="ask-in">
        <div className="ask-box">
          <h2 className="ask-h">{slot.heading || v.askHeading}</h2>
          <p className="ask-p">{slot.body || v.askBody}</p>
          <div className="ask-pills">
            <Pill variant="slot" filled={false} href={primaryHref} label={slot.button || v.askA} />
            <Pill variant="slot" filled={false} href={secondaryHref} label={slot.button2 || v.askB} />
          </div>
        </div>
      </div>
    </div>
  );
}
