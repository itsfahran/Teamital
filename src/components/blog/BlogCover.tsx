import type { CmsPost } from '@/content/blog';
import { Icon, cx } from '../ui';

/** Cover: the uploaded image when there is one, otherwise generated art (tinted gradient with a large icon). */
export function BlogCover({ post, size = 'card' }: { post: Pick<CmsPost, 'icon' | 'tone' | 'cover'>; size?: 'card' | 'featured' | 'hero' }) {
  if (post.cover) {
    return (
      <div className={cx('bcover', 'bcover-img', `bcover-${size}`)} aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={post.cover} alt="" />
      </div>
    );
  }
  return (
    <div className={cx('bcover', `bcover-${size}`, `tone-${post.tone}`)} aria-hidden="true">
      <span className="bcover-shape bcover-shape-a" />
      <span className="bcover-shape bcover-shape-b" />
      <span className="bcover-grid" />
      <span className="bcover-icon">
        <Icon name={post.icon} size={size === 'card' ? 52 : 76} color="#fff" />
      </span>
    </div>
  );
}
