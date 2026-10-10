import { Aos } from '@/components/Aos';
import { SitePage } from '@/components/SitePage';
import { Icon, SmartLink } from '@/components/ui';
import { ROUTES } from '@/lib/config';
import { metadataFor } from '@/lib/seo';

export const generateMetadata = () => metadataFor('/how-it-works');

const STEPS: Array<[string, string, string]> = [
  ['apartment', 'Create your company account', 'Sign up, name your workspace, and invite the first admin.'],
  ['group_add', 'Add employees', 'Invite people by email or add them from the company dashboard.'],
  ['location_on', 'Set attendance rules and locations', 'Choose clock-in methods, GPS geofences, and working hours.'],
  ['fingerprint', 'Employees clock in and out', 'Teams punch with GPS, face, or biometrics on web and mobile.'],
  ['insights', 'Track attendance and workforce activity', 'See who is present, late, or on site from live dashboards.'],
  ['assignment', 'Manage projects and leave', 'Assign work, approve time off, and keep one source of truth.'],
  ['bar_chart', 'Generate reports', 'Export hours, overtime, and attendance summaries for payroll.'],
];

export default function Page() {
  return (
    <SitePage stickyHeader compactBelow={980}>
      <div className="hw2">
        <div className="hw2-in">
          <Aos>
            <h1 className="hw2-title">How It Works</h1>
            <p className="hw2-sub">The complete Teamital workflow — from signup to reports.</p>
          </Aos>
          <div className="gap-32" />
          {STEPS.map(([icon, title, body], i) => (
            <Aos key={title} delay={60 * i}>
              <div className="hw2-step">
                <div className="hw2-ico">
                  <Icon name={icon} size={22} color="#fff" />
                </div>
                <div>
                  <div className="hw2-step-t">
                    {i + 1}. {title}
                  </div>
                  <div className="hw2-step-d">{body}</div>
                </div>
              </div>
            </Aos>
          ))}
          <div className="gap-24" />
          <SmartLink href={ROUTES.signUp} className="btn-filled hw2-btn">
            Create your company account
          </SmartLink>
        </div>
      </div>
    </SitePage>
  );
}
