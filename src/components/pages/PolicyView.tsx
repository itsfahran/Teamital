import type { ReactNode } from 'react';
import { POLICY_LAST_UPDATED, type PolicyBlock } from '@/content/policies';
import { PolicyShell } from '../SitePage';

export function PolicyBlocks({ blocks }: { blocks: PolicyBlock[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.t === 'h') return <PolicyH key={i}>{b.text}</PolicyH>;
        if (b.t === 'p') return <PolicyP key={i}>{b.text}</PolicyP>;
        return <PolicyBullets key={i} items={b.items} />;
      })}
    </>
  );
}

export const PolicyH = ({ children }: { children: ReactNode }) => <h2 className="pol-h">{children}</h2>;
export const PolicyP = ({ children }: { children: ReactNode }) => <p className="pol-p">{children}</p>;
export const PolicyBullets = ({ items }: { items: ReactNode[] }) => (
  <ul className="pol-ul">
    {items.map((it, i) => (
      <li key={i}>
        <span className="pol-dot" />
        <span>{it}</span>
      </li>
    ))}
  </ul>
);

export function PolicyView({
  appBarTitle,
  heading,
  lastUpdated = POLICY_LAST_UPDATED,
  blocks,
}: {
  appBarTitle: string;
  heading: string;
  lastUpdated?: string;
  blocks: PolicyBlock[];
}) {
  return (
    <PolicyShell title={appBarTitle}>
      <div className="pol">
        <div className="pol-in">
          <h1 className="pol-title">{heading}</h1>
          <div className="pol-updated">Last Updated: {lastUpdated}</div>
          <PolicyBlocks blocks={blocks} />
        </div>
      </div>
    </PolicyShell>
  );
}
