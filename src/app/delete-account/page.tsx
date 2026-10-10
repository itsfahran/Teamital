import { PolicyBullets, PolicyH, PolicyP } from '@/components/pages/PolicyView';
import { PolicyShell } from '@/components/SitePage';
import { SITE } from '@/lib/config';
import { metadataFor } from '@/lib/seo';

export const generateMetadata = () => metadataFor('/delete-account');

const SUBJECT = encodeURIComponent('Teamital — Account deletion request');

export default function Page() {
  const mail = `mailto:${SITE.contactEmail}?subject=${SUBJECT}`;
  return (
    <PolicyShell title="Delete account">
      <div className="pol">
        <div className="pol-in">
          <h1 className="pol-title pol-title-del">Delete Your Teamital Account</h1>
          <div className="gap-16" />
          <PolicyP>
            If you would like to delete your Teamital account and associated personal data, you can submit a deletion
            request using the instructions below.
          </PolicyP>
          <PolicyH>How to request account deletion</PolicyH>
          <PolicyP>
            Please contact us using the email address associated with your Teamital account and request that your
            account be deleted.
          </PolicyP>
          <div className="gap-8" />
          <div className="del-mail">
            <span className="del-mail-l">Email: </span>
            <a href={mail} className="del-mail-a">
              {SITE.contactEmail}
            </a>
          </div>
          <div className="gap-16" />
          <PolicyP>Please include:</PolicyP>
          <PolicyBullets
            items={['Your registered email address or username', 'Your request to delete your Teamital account']}
          />
          <PolicyP>We may ask you to verify your identity before processing the request.</PolicyP>
          <PolicyH>What happens when your account is deleted?</PolicyH>
          <PolicyP>When your account deletion request is processed:</PolicyP>
          <PolicyBullets
            items={[
              'Your Teamital account will be permanently deleted.',
              'Personal information associated with your account will be deleted.',
              'Employee/profile information associated with your account will be deleted.',
              'Any other data that is not required to be retained for legitimate legal or security purposes will be deleted.',
            ]}
          />
          <PolicyP>
            Some information may be retained for a limited period when required by law, for fraud prevention,
            security, accounting, or other legitimate legal purposes. Any retained information will be securely stored
            and deleted when the applicable retention requirement expires.
          </PolicyP>
          <PolicyH>Account deletion is permanent</PolicyH>
          <PolicyP>
            Account deletion is permanent and cannot be undone. Once your account and associated data have been
            deleted, they cannot be recovered.
          </PolicyP>
          <PolicyP>If you have questions about account deletion or your data, please contact us at:</PolicyP>
          <a href={mail} className="del-mail-a">
            {SITE.contactEmail}
          </a>
        </div>
      </div>
    </PolicyShell>
  );
}
