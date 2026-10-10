import type { CmsBlock, CmsPageContent } from '@/lib/cms';
import { blockToSlot } from '@/lib/cms';
import { Footer } from '../Footer';
import { Header } from '../Header';
import { HomeSlotView } from '../home/HomeSlots';
import { SmartLink, cx } from '../ui';

const href = (h: string, fallback: string) => (h.trim() ? h.trim() : fallback);

function HeroBlock({ block }: { block: CmsBlock }) {
  return (
    <div className="cms-hero">
      <h1 className="cms-hero-h">{block.heading || 'Welcome'}</h1>
      {block.body && <p className="cms-hero-p">{block.body}</p>}
      <div className="cms-btns cms-hero-btns">
        {block.buttonLabel && (
          <SmartLink href={href(block.buttonHref, '/sign-up')} className="btn-filled cms-btn cms-btn-hero">
            {block.buttonLabel}
          </SmartLink>
        )}
        {block.button2Label && (
          <SmartLink href={href(block.button2Href, '/contact')} className="btn-outlined cms-btn cms-btn-hero">
            {block.button2Label}
          </SmartLink>
        )}
      </div>
    </div>
  );
}

function GenericBlock({ block }: { block: CmsBlock }) {
  const banner = block.type === 'cta' || block.variant === 'ask-banner';
  return (
    <div className={cx('cms-gen', banner && 'cms-gen-banner')}>
      {block.heading && <h2 className="cms-gen-h">{block.heading}</h2>}
      {block.body && <p className="cms-gen-p">{block.body}</p>}
      {block.items.length > 0 && (
        <div className="cms-gen-items">
          {block.items.map((line, i) => (
            <div className="cms-gen-item" key={i}>
              <span className="cms-gen-bul">•&nbsp;&nbsp;</span>
              <span>{line.replace(/\|/g, ' — ')}</span>
            </div>
          ))}
        </div>
      )}
      {(block.buttonLabel || block.button2Label) && (
        <div className="cms-btns">
          {block.buttonLabel && (
            <SmartLink href={href(block.buttonHref, '/sign-up')} className="btn-filled cms-btn">
              {block.buttonLabel}
            </SmartLink>
          )}
          {block.button2Label && (
            <SmartLink href={href(block.button2Href, '/contact')} className="btn-outlined cms-btn">
              {block.button2Label}
            </SmartLink>
          )}
        </div>
      )}
    </div>
  );
}

function renderBlock(block: CmsBlock, i: number) {
  if (block.type === 'slot') {
    return (
      <div className="cms-slot" key={i}>
        <HomeSlotView
          slot={blockToSlot(block)}
          primaryHref={href(block.buttonHref, '/contact')}
          secondaryHref={href(block.button2Href, '/sign-up')}
        />
      </div>
    );
  }
  if (block.type === 'hero') return <HeroBlock block={block} key={i} />;
  return <GenericBlock block={block} key={i} />;
}

/** Renders a published CMS page using the same section types as Landing/Home. */
export function CmsPageView({ page }: { page: CmsPageContent }) {
  return (
    <div className="page theme-app" style={{ background: '#fff' }}>
      <div className="page-header page-header-sticky">
        <Header compactBelow={0} />
      </div>
      {page.blocks.map((b, i) => (
        <div key={i}>
          {renderBlock(b, i)}
          <div style={{ height: 8 }} />
        </div>
      ))}
      {page.blocks.length === 0 && <h1 className="cms-empty">{page.h1 || page.title}</h1>}
      <Footer />
    </div>
  );
}
