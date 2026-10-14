import { looksLikeHtml } from '@/lib/content/utils';
import { cx } from './ui';

/**
 * Renders a CMS text field. Rich-text HTML (already sanitised on the server) is injected as is;
 * plain text from the code defaults is wrapped in a paragraph so both look the same.
 */
export function RichText({ value, className }: { value: string; className?: string }) {
  if (!value) return null;
  if (looksLikeHtml(value)) return <div className={cx('rt', className)} dangerouslySetInnerHTML={{ __html: value }} />;
  return <p className={className}>{value}</p>;
}
