import type { Metadata } from 'next';
import { PolicyBullets, PolicyH } from '@/components/pages/PolicyView';
import { RichText } from '@/components/RichText';
import { PolicyShell } from '@/components/SitePage';
import { DELETE_ACCOUNT, DELETE_ACCOUNT_KEY } from '@/content/delete-account';
import { SITE } from '@/lib/config';
import { getSiteContent } from '@/lib/content/server';
import { plainText } from '@/lib/content/utils';
import { metadataFor } from '@/lib/seo';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const c = await getSiteContent(DELETE_ACCOUNT_KEY, DELETE_ACCOUNT);
  return metadataFor('/delete-account', undefined, c.seo);
}

export default async function Page() {
  const c = await getSiteContent(DELETE_ACCOUNT_KEY, DELETE_ACCOUNT);
  const mail = `mailto:${SITE.contactEmail}?subject=${encodeURIComponent(c.mailSubject)}`;
  return (
    <PolicyShell title={c.appBarTitle}>
      <div className="pol">
        <div className="pol-in">
          <h1 className="pol-title pol-title-del">{c.title}</h1>
          <div className="gap-16" />
          {c.blocks.map((b, i) => (
            <div key={i}>
              {b.type === 'heading' && <PolicyH>{plainText(b.text)}</PolicyH>}
              {b.type === 'paragraph' && <RichText className="pol-p" value={b.text} />}
              {b.type === 'list' && <PolicyBullets items={b.items} />}
              {i + 1 === c.mailAfterBlock && (
                <>
                  <div className="gap-8" />
                  <div className="del-mail">
                    <span className="del-mail-l">{c.emailLabel}</span>
                    <a href={mail} className="del-mail-a">
                      {SITE.contactEmail}
                    </a>
                  </div>
                  <div className="gap-16" />
                </>
              )}
            </div>
          ))}
          <a href={mail} className="del-mail-a">
            {SITE.contactEmail}
          </a>
        </div>
      </div>
    </PolicyShell>
  );
}
