import { BlogIndex } from '@/components/blog/BlogIndex';
import { SitePage } from '@/components/SitePage';
import { SmartLink } from '@/components/ui';
import { BLOG_POSTS } from '@/content/blog';
import { ROUTES } from '@/lib/config';
import { metadataFor } from '@/lib/seo';

export const generateMetadata = () => metadataFor('/blog');

export default function Page() {
  return (
    <SitePage compactBelow={980} overlayHeader background="#fff">
      <section className="bhero">
        <div className="bhero-in">
          <span className="bhero-pill">
            <span className="bhero-dot" />
            Teamital Blog
          </span>
          <h1 className="bhero-title">Insights for modern workforce teams</h1>
          <p className="bhero-sub">
            Practical guides on attendance, GPS, HR operations and compliance, written for the people who keep teams
            running.
          </p>
        </div>
      </section>

      <section className="blog">
        <div className="blog-in">
          <BlogIndex posts={BLOG_POSTS} />

          <div className="bcta">
            <div>
              <div className="bcta-t">Put these ideas to work</div>
              <div className="bcta-s">Start a free trial and see attendance, GPS and leave in one place.</div>
            </div>
            <SmartLink href={ROUTES.signUp} className="hero-btn hero-btn-light">
              Start free trial
            </SmartLink>
          </div>
        </div>
      </section>
    </SitePage>
  );
}
