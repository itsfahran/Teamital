import type { Metadata } from 'next';
import { BlogIndex } from '@/components/blog/BlogIndex';
import { RichText } from '@/components/RichText';
import { SitePage } from '@/components/SitePage';
import { SmartLink } from '@/components/ui';
import { BLOG, BLOG_PAGE_KEY } from '@/content/blog';
import { ROUTES } from '@/lib/config';
import { getSiteContent } from '@/lib/content/server';
import { metadataFor } from '@/lib/seo';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const c = await getSiteContent(BLOG_PAGE_KEY, BLOG);
  return metadataFor('/blog', undefined, c.seo);
}

export default async function Page() {
  const c = await getSiteContent(BLOG_PAGE_KEY, BLOG);
  return (
    <SitePage compactBelow={980} overlayHeader background="#fff">
      <section className="bhero">
        <div className="bhero-in">
          <span className="bhero-pill">
            <span className="bhero-dot" />
            {c.hero.pill}
          </span>
          <h1 className="bhero-title">{c.hero.title}</h1>
          <RichText className="bhero-sub" value={c.hero.sub} />
        </div>
      </section>

      <section className="blog">
        <div className="blog-in">
          <BlogIndex posts={c.posts} author={c.authorName} searchPlaceholder={c.searchPlaceholder} labels={c.labels} />

          <div className="bcta">
            <div>
              <div className="bcta-t">{c.cta.title}</div>
              <div className="bcta-s">{c.cta.text}</div>
            </div>
            <SmartLink href={ROUTES.signUp} className="hero-btn hero-btn-light">
              {c.cta.button}
            </SmartLink>
          </div>
        </div>
      </section>
    </SitePage>
  );
}
