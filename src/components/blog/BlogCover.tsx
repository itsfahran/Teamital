import type { BlogPost } from '@/content/blog';
import { Icon, cx } from '../ui';

/** Generated cover art: tinted gradient with a large icon and soft shapes (no image files needed). */
export function BlogCover({ post, size = 'card' }: { post: Pick<BlogPost, 'icon' | 'tone'>; size?: 'card' | 'featured' | 'hero' }) {
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
