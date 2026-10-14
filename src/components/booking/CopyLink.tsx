'use client';

import { useState } from 'react';
import { useChrome } from '../ChromeProvider';
import { Icon } from '../ui';

/** Shows a meeting link with a one-click "Copy" button. */
export function CopyLink({ link }: { link: string }) {
  const t = useChrome().booking;
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      // Fallback for browsers/contexts without the async clipboard API.
      const ta = document.createElement('textarea');
      ta.value = link;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
      } catch {
        /* ignore */
      }
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="bk-link">
      <div className="bk-link-label">
        <Icon name="videocam" size={16} color="#1A56DB" />
        {t.meetLinkLabel}
      </div>
      <div className="bk-link-row">
        <a href={link} target="_blank" rel="noopener noreferrer" className="bk-link-url">
          {link.replace(/^https?:\/\//, '')}
        </a>
        <button type="button" className={copied ? 'bk-copy bk-copy-on' : 'bk-copy'} onClick={copy} aria-live="polite">
          <Icon name={copied ? 'check' : 'content_copy'} size={18} />
          {copied ? t.copied : t.copyLink}
        </button>
      </div>
    </div>
  );
}
