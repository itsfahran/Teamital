'use client';

import { usePathname } from 'next/navigation';

/** "/slug is not published in CMS yet." (shows the requested path). */
export function MissingPath() {
  const path = usePathname() || '/';
  return <div className="missing-s">{path} is not published in CMS yet.</div>;
}
