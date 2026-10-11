import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BlogCover } from '@/components/blog/BlogCover';
import { SitePage } from '@/components/SitePage';
import { Icon, SmartLink, cx } from '@/components/ui';
import { AUTHOR, BLOG_POSTS, formatDate, getPost } from '@/content/blog';
import { ROUTES, SITE } from '@/lib/config';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
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
  const post = getPost(slug);
  if (!post) notFound();

  const related = BLOG_POSTS.filter((p) => p.slug !== post.slug)
    .sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category))
    .slice(0, 3);

  return (
    <SitePage compactBelow={980} overlayHeader background="#fff">
      <section className="bhero bhero-post">
        <div className="bhero-in bhero-in-post">
          <Link href={ROUTES.blog} className="bback">
            <Icon name="arrow_back" size={18} />
            All articles
          </Link>
          <span className={cx('bpill', 'bpill-tone', `tone-${post.tone}`)}>{post.category}</span>
          <h1 className="bpost-title">{post.title}</h1>
          <p className="bhero-sub">{post.excerpt}</p>
          <div className="bpost-by">
            <span className="bpost-avatar">T</span>
            <span>
              <span className="bpost-author">{AUTHOR}</span>
              <span className="bpost-meta">
                {formatDate(post.date)} · {post.readMins} min read
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
              Key takeaways
            </div>
            <ul>
              {post.takeaways.map((t) => (
                <li key={t}>
                  <Icon name="check_circle" size={18} color="#10B981" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </aside>

          <div className="bbody">
            {post.body.map((b, i) => {
              if (b.t === 'h') return <h2 key={i}>{b.text}</h2>;
              if (b.t === 'p') return <p key={i}>{b.text}</p>;
              return (
                <ul key={i}>
                  {b.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              );
            })}
          </div>

          <div className="bcta bcta-post">
            <div>
              <div className="bcta-t">See it in action</div>
              <div className="bcta-s">Try Teamital free: attendance, GPS and leave in one place.</div>
            </div>
            <SmartLink href={ROUTES.signUp} className="hero-btn hero-btn-light">
              Start free trial
            </SmartLink>
          </div>
        </div>

        {related.length > 0 && (
          <div className="brel">
            <h2 className="brel-t">Keep reading</h2>
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
                      <span>{p.readMins} min read</span>
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
