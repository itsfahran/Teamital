'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { AUTHOR, formatDate, type BlogPost } from '@/content/blog';
import { Icon, cx } from '../ui';
import { BlogCover } from './BlogCover';

function Meta({ post }: { post: BlogPost }) {
  return (
    <div className="bmeta">
      <span>{formatDate(post.date)}</span>
      <span className="bmeta-dot" />
      <span>{post.readMins} min read</span>
    </div>
  );
}

export function BlogIndex({ posts }: { posts: BlogPost[] }) {
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');

  const categories = useMemo(() => ['All', ...Array.from(new Set(posts.map((p) => p.category)))], [posts]);
  const q = query.trim().toLowerCase();
  const filtered = posts.filter(
    (p) =>
      (category === 'All' || p.category === category) &&
      (!q || p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q)),
  );

  const showFeatured = category === 'All' && !q && filtered.length > 0;
  const featured = showFeatured ? filtered[0] : null;
  const rest = showFeatured ? filtered.slice(1) : filtered;

  return (
    <>
      <div className="blog-tools">
        <div className="blog-chips" role="tablist" aria-label="Filter by category">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={c === category}
              className={cx('blog-chip', c === category && 'blog-chip-on')}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <label className="blog-search">
          <Icon name="search" size={20} color="#6B7280" />
          <input
            type="search"
            placeholder="Search articles"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search articles"
          />
        </label>
      </div>

      {featured && (
        <Link href={`/blog/${featured.slug}`} className="bfeat">
          <BlogCover post={featured} size="featured" />
          <div className="bfeat-body">
            <span className="bpill">Featured · {featured.category}</span>
            <h2 className="bfeat-title">{featured.title}</h2>
            <p className="bfeat-ex">{featured.excerpt}</p>
            <Meta post={featured} />
            <span className="bfeat-link">
              Read article
              <Icon name="arrow_forward" size={18} />
            </span>
          </div>
        </Link>
      )}

      {rest.length > 0 && (
        <div className="bgrid">
          {rest.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="bcard">
              <BlogCover post={p} />
              <div className="bcard-body">
                <span className={cx('bpill', `tone-${p.tone}`, 'bpill-tone')}>{p.category}</span>
                <h3 className="bcard-title">{p.title}</h3>
                <p className="bcard-ex">{p.excerpt}</p>
                <div className="bcard-foot">
                  <Meta post={p} />
                  <span className="bcard-arrow">
                    <Icon name="arrow_forward" size={18} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
          {showFeatured && rest.length % 3 === 2 && (
            <div className="bnote">
              <span className="bnote-ico">
                <Icon name="edit_note" size={28} color="#1A56DB" />
              </span>
              <div className="bnote-t">Have a topic in mind?</div>
              <div className="bnote-s">Tell us what you would like us to cover next on attendance, GPS or HR operations.</div>
              <Link href="/contact" className="bnote-link">
                Suggest a topic
                <Icon name="arrow_forward" size={16} />
              </Link>
            </div>
          )}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="bempty">
          <Icon name="search_off" size={36} color="#9CA3AF" />
          <div className="bempty-t">No articles found</div>
          <div className="bempty-s">Try another keyword or choose a different category.</div>
          <button
            type="button"
            className="blog-chip blog-chip-on"
            onClick={() => {
              setCategory('All');
              setQuery('');
            }}
          >
            Clear filters
          </button>
        </div>
      )}
      <span className="sr-only">{AUTHOR}</span>
    </>
  );
}
