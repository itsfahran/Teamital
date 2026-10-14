import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BlogCover } from '@/components/blog/BlogCover';
import { SitePage } from '@/components/SitePage';
import { Icon, SmartLink, cx } from '@/components/ui';
import { BLOG, BLOG_PAGE_KEY, formatDate } from '@/content/blog';
import { RichText } from '@/components/RichText';
import { getSiteContent } from '@/lib/content/server';
import { plainText } from '@/lib/content/utils';
import { ROUTES, SITE } from '@/lib/config';

type Params = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateStaticParams() {
  const c = await getSiteContent(BLOG_PAGE_KEY, BLOG);
  return c.posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const c = await getSiteContent(BLOG_PAGE_KEY, BLOG);
  const post = c.posts.find((p) => p.slug === slug);
  if (!post) return {};
  const url = `${SITE.publicSiteUrl}/blog/${post.slug}`;
  return {
    title: { absolute: `${post.title} | Teamital Blog` },
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: { title: post.title, description: post.excerpt, url, type: 'article', publishedTime: post.date },
  };
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  const c = await getSiteContent(BLOG_PAGE_KEY, BLOG);
  const post = c.posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const related = c.posts.filter((p) => p.slug !== post.slug)
    .sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category))
    .slice(0, 3);

  return (
    <SitePage compactBelow={980} overlayHeader background="#fff">
      <section className="bhero bhero-post">
        <div className="bhero-in bhero-in-post">
          <Link href={ROUTES.blog} className="bback">
            <Icon name="arrow_back" size={18} />
            {c.labels.backToAll}
          </Link>
          <span className={cx('bpill', 'bpill-tone', `tone-${post.tone}`)}>{post.category}</span>
          <h1 className="bpost-title">{post.title}</h1>
          <RichText className="bhero-sub" value={post.excerpt} />
          <div className="bpost-by">
            <span className="bpost-avatar">T</span>
            <span>
              <span className="bpost-author">{c.authorName}</span>
              <span className="bpost-meta">
                {formatDate(post.date)} · {post.readMins} {c.labels.minRead}
              </span>
            </span>
          </div>
        </div>
      </section>

      <article className="bpost">
        <div className="bpost-in">
          <BlogCover post={post} size="hero" />

          <aside className="btake">
            <div className="btake-t">
              <Icon name="lightbulb" size={20} color="#1A56DB" />
              {c.labels.takeaways}
            </div>
            <ul>
              {post.takeaways.map((t, i) => (
                <li key={i}>
                  <Icon name="check_circle" size={18} color="#10B981" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </aside>

          <div className="bbody">
            {post.body.map((b, i) => {
              if (b.type === 'heading') return <h2 key={i}>{plainText(b.text)}</h2>;
              if (b.type === 'paragraph') return <RichText key={i} value={b.text} />;
              return (
                <ul key={i}>
                  {b.items.map((it, j) => (
                    <li key={j}>{it}</li>
                  ))}
                </ul>
              );
            })}
          </div>

          <div className="bcta bcta-post">
            <div>
              <div className="bcta-t">{c.postCta.title}</div>
              <div className="bcta-s">{c.postCta.text}</div>
            </div>
            <SmartLink href={ROUTES.signUp} className="hero-btn hero-btn-light">
              {c.postCta.button}
            </SmartLink>
          </div>
        </div>

        {related.length > 0 && (
          <div className="brel">
            <h2 className="brel-t">{c.labels.keepReading}</h2>
            <div className="bgrid">
              {related.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="bcard">
                  <BlogCover post={p} />
                  <div className="bcard-body">
                    <span className={cx('bpill', 'bpill-tone', `tone-${p.tone}`)}>{p.category}</span>
                    <h3 className="bcard-title">{p.title}</h3>
                    <div className="bmeta">
                      <span>{formatDate(p.date)}</span>
                      <span className="bmeta-dot" />
                      <span>
                        {p.readMins} {c.labels.minRead}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </SitePage>
  );
}
