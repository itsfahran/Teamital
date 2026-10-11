/** Blog posts. Add a new object here to publish a new article. */
export type PostBlock =
  | { t: 'h'; text: string }
  | { t: 'p'; text: string }
  | { t: 'ul'; items: string[] };

export type Tone = 'blue' | 'violet' | 'green' | 'amber' | 'rose' | 'sky';

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  readMins: number;
  icon: string;
  tone: Tone;
  takeaways: string[];
  body: PostBlock[];
};

export const AUTHOR = 'Teamital Team';

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'gps-geofencing-reduces-buddy-punching',
    title: 'How GPS geofencing reduces buddy punching',
    excerpt:
      'Clock-ins that only count when someone is actually on site make attendance records far harder to fake. Here is how geofencing works and how to roll it out fairly.',
    category: 'Attendance',
    date: '2026-10-06',
    readMins: 5,
    icon: 'location_on',
    tone: 'blue',
    takeaways: [
      'Geofencing ties a clock-in to a real place, not just a device or a password.',
      'Radius and accuracy settings matter: too tight causes false rejections, too loose defeats the purpose.',
      'Pair location checks with face or fingerprint verification for the strongest result.',
    ],
    body: [
      {
        t: 'p',
        text: 'Buddy punching is when one employee clocks in or out on behalf of a colleague. It is rarely malicious in intent, but it quietly inflates payroll and makes attendance data unreliable. Traditional controls such as PINs and shared kiosks are easy to get around because they verify knowledge, not presence.',
      },
      { t: 'h', text: 'What a geofence actually does' },
      {
        t: 'p',
        text: 'A geofence is a virtual boundary drawn around a work location. When an employee taps clock in, the app compares the phone location with that boundary and records the result alongside the punch. If the person is outside the zone, the punch can be blocked, flagged for review, or allowed with a note, depending on your policy.',
      },
      { t: 'h', text: 'Rolling it out without friction' },
      {
        t: 'ul',
        items: [
          'Start with a generous radius around each site, then tighten it using real accuracy data.',
          'Define what happens when a punch fails: block, flag, or request a manager override.',
          'Tell your team what is collected and why. Location is only checked at the moment of a punch.',
          'Review flagged punches weekly so genuine problems, such as poor signal in a basement, get fixed.',
        ],
      },
      { t: 'h', text: 'Combine signals for stronger proof' },
      {
        t: 'p',
        text: 'Location on its own can be spoofed on some devices. Adding a second factor, such as face or fingerprint verification, makes it much harder for someone else to clock in for you. The two checks together give managers confidence without adding much effort for employees.',
      },
    ],
  },
  {
    slug: 'biometric-vs-face-verification',
    title: 'Biometric vs face verification: what suits your workplace',
    excerpt:
      'Fingerprint, face and PIN checks each have different strengths. A practical comparison to help you choose the right mix for offices, sites and shifts.',
    category: 'Security',
    date: '2026-09-29',
    readMins: 6,
    icon: 'fingerprint',
    tone: 'violet',
    takeaways: [
      'Fingerprint is fast and familiar; face verification needs no touch and suits shared devices.',
      'PINs are convenient but are the easiest method to share, so use them as a fallback.',
      'Choose per site: the best method depends on environment, device and volume of punches.',
    ],
    body: [
      {
        t: 'p',
        text: 'Choosing how employees prove who they are at clock-in is a balance between security, speed and comfort. There is no single right answer, and many teams run more than one method.',
      },
      { t: 'h', text: 'Fingerprint' },
      {
        t: 'p',
        text: 'Fingerprint checks are quick and widely understood. They work well on personal phones that already have a sensor, and in offices where devices are kept clean and dry. They can be less reliable for staff who work with their hands in dusty or wet conditions.',
      },
      { t: 'h', text: 'Face verification' },
      {
        t: 'p',
        text: 'Face verification is contactless, which helps on shared tablets and in hygiene-sensitive environments. It needs reasonable lighting and a camera, and works best when staff understand how the capture is used and stored.',
      },
      { t: 'h', text: 'PIN as a fallback' },
      {
        t: 'p',
        text: 'A PIN is simple and works anywhere, but it is also the easiest credential to share. Treat it as a backup for when other methods are not available, and combine it with a location check where you can.',
      },
      { t: 'h', text: 'How to decide' },
      {
        t: 'ul',
        items: [
          'Office teams on personal phones: fingerprint or face, plus GPS.',
          'Shared devices at a front desk or site gate: face verification.',
          'Mixed or temporary staff: PIN with geofencing and manager review.',
        ],
      },
    ],
  },
  {
    slug: 'dashboards-managers-open-every-morning',
    title: 'Building dashboards managers actually open every morning',
    excerpt:
      'A good attendance dashboard answers three questions in seconds. Here is what to show, what to hide, and how to keep it useful as the team grows.',
    category: 'Insights',
    date: '2026-09-22',
    readMins: 4,
    icon: 'bar_chart',
    tone: 'green',
    takeaways: [
      'Lead with who is in, who is late and who is on leave right now.',
      'Show trends over days and weeks, but keep detail one click away.',
      'Alerts beat charts: surface exceptions instead of making managers hunt for them.',
    ],
    body: [
      {
        t: 'p',
        text: 'Most dashboards fail for the same reason: they show everything and answer nothing. Managers open them once, feel overwhelmed, and go back to messaging people individually.',
      },
      { t: 'h', text: 'Answer the morning questions first' },
      {
        t: 'p',
        text: 'Before the day starts a manager wants to know who is on site, who is running late, and who is away. Put those three numbers at the top, with the names one click behind them.',
      },
      { t: 'h', text: 'Make exceptions impossible to miss' },
      {
        t: 'ul',
        items: [
          'Missed clock-ins and punches outside the site boundary.',
          'Overtime that is trending above the usual weekly hours.',
          'Pending leave requests waiting for an approval.',
        ],
      },
      { t: 'h', text: 'Keep history simple' },
      {
        t: 'p',
        text: 'Weekly and monthly views are most useful for spotting patterns such as recurring lateness or understaffed shifts. A simple bar chart per team is usually enough, and exports cover the payroll team.',
      },
    ],
  },
  {
    slug: 'leave-management-employees-trust',
    title: 'Leave management your employees will actually trust',
    excerpt:
      'Transparent balances, quick approvals and clear rules reduce back-and-forth. Practical steps to set up leave so it just works.',
    category: 'HR Ops',
    date: '2026-09-15',
    readMins: 5,
    icon: 'beach_access',
    tone: 'amber',
    takeaways: [
      'Show every employee their balance and request status in one place.',
      'Set approval rules once, so managers are not re-deciding the same thing.',
      'Keep a single calendar so overlapping absences are visible before approval.',
    ],
    body: [
      {
        t: 'p',
        text: 'Leave is one of the most emotionally charged parts of HR. When balances are unclear or approvals are slow, people lose trust in the system and start working around it.',
      },
      { t: 'h', text: 'Make balances visible' },
      {
        t: 'p',
        text: 'Employees should always be able to see what they have, what is pending, and what has been approved. That alone removes a large share of questions to HR.',
      },
      { t: 'h', text: 'Define rules, then automate them' },
      {
        t: 'ul',
        items: [
          'Leave types and how many days each includes.',
          'Who approves each team, and what happens if they are away.',
          'Minimum notice, and any blackout periods around busy seasons.',
        ],
      },
      { t: 'h', text: 'Plan around the team calendar' },
      {
        t: 'p',
        text: 'A shared calendar lets managers spot overlapping requests before they approve, so coverage problems are solved early rather than on the day.',
      },
    ],
  },
  {
    slug: 'attendance-for-field-and-remote-teams',
    title: 'Tracking attendance for field and remote teams',
    excerpt:
      'Teams that are not in one building still need reliable hours. How to handle sites, travel time and flexible schedules without micromanaging.',
    category: 'Field Teams',
    date: '2026-09-08',
    readMins: 5,
    icon: 'local_shipping',
    tone: 'sky',
    takeaways: [
      'Define multiple work locations so people can clock in at the right site.',
      'Capture the work that matters, such as job or project, with the punch.',
      'Trust but verify: location and photo checks on punches, not constant tracking.',
    ],
    body: [
      {
        t: 'p',
        text: 'Field technicians, delivery crews and remote staff do not share one door or one desk. A single time clock does not fit, but you still need accurate hours for payroll and billing.',
      },
      { t: 'h', text: 'Model sites, not just offices' },
      {
        t: 'p',
        text: 'Add each customer site, depot or office as a location with its own boundary. Employees can then clock in wherever they are working that day, and the record shows exactly where.',
      },
      { t: 'h', text: 'Capture context with the punch' },
      {
        t: 'ul',
        items: [
          'Which project or job the time belongs to.',
          'An optional note or photo when something unusual happens.',
          'Break start and end, so paid time is calculated correctly.',
        ],
      },
      { t: 'h', text: 'Respect privacy' },
      {
        t: 'p',
        text: 'Checking location at the moment of a punch is very different from continuous tracking. Be clear with your team about which one you use, and keep it to what the job needs.',
      },
    ],
  },
  {
    slug: 'gdpr-basics-for-attendance-data',
    title: 'GDPR basics for attendance and workforce data',
    excerpt:
      'Attendance records, locations and biometrics are personal data. A plain-language checklist of what to document and communicate.',
    category: 'Compliance',
    date: '2026-09-01',
    readMins: 6,
    icon: 'security',
    tone: 'rose',
    takeaways: [
      'Know what you collect, why, and how long you keep it.',
      'Tell employees clearly, and give them a way to ask questions or raise requests.',
      'Limit access to people who need it, and review that access regularly.',
    ],
    body: [
      {
        t: 'p',
        text: 'If you operate in the EU or process data about people there, attendance data is personal data. This is a general overview and not legal advice, so involve your data protection adviser for decisions specific to your business.',
      },
      { t: 'h', text: 'Document what and why' },
      {
        t: 'p',
        text: 'Write down which data you collect at clock-in (for example time, location and a verification method), the reason for each, and how long it is kept. This is the foundation for every other step.',
      },
      { t: 'h', text: 'Be transparent with employees' },
      {
        t: 'ul',
        items: [
          'Give a plain-language notice that explains what is collected.',
          'Explain how to ask questions, request access, or raise a concern.',
          'Make sure any biometric option is introduced with particular care.',
        ],
      },
      { t: 'h', text: 'Control access and retention' },
      {
        t: 'p',
        text: 'Use role-based access so only the people who need attendance data can see it, and set a retention period so records are removed when they are no longer needed.',
      },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
}
