/** How-to guides. Edit the copy here; layout lives in components/guide/GuideView.tsx. */
export type GuideStep = {
  icon: string;
  title: string;
  text: string;
  bullets?: string[];
};

export type Guide = {
  slug: 'companies' | 'employees';
  path: string;
  audience: string;
  title: string;
  subtitle: string;
  icon: string;
  tone: 'blue' | 'green';
  readMins: number;
  steps: GuideStep[];
  tips: string[];
  faqs: Array<[string, string]>;
};

export const GUIDES: Guide[] = [
  {
    slug: 'companies',
    path: '/guide/companies',
    audience: 'For companies & admins',
    title: 'Guide for Companies',
    subtitle:
      'Set up Teamital for your business: add your team, define attendance rules and locations, then track hours, leave and tasks from one dashboard.',
    icon: 'apartment',
    tone: 'blue',
    readMins: 6,
    steps: [
      {
        icon: 'person_add',
        title: 'Create your company account',
        text: 'Sign up with your work email, name your company and confirm your email address. The person who signs up becomes the first company admin.',
        bullets: ['Use a shared inbox such as hr@ if several people will manage the account.', 'Pick a plan, or start with the free trial and upgrade when you are ready.'],
      },
      {
        icon: 'badge',
        title: 'Set up your company profile',
        text: 'Add your company details, departments and teams so employees land in the right place from day one.',
        bullets: ['Create departments that mirror how your teams are organised.', 'Decide who needs admin access and who is a regular employee.'],
      },
      {
        icon: 'group_add',
        title: 'Add your employees',
        text: 'Invite people by email or add them from the company dashboard. Each person receives an invitation to set a password and sign in.',
        bullets: ['Assign a department and role when you add someone.', 'You can add people in batches, so start with one team and expand.'],
      },
      {
        icon: 'location_on',
        title: 'Configure attendance rules and locations',
        text: 'Choose how people clock in and where they are allowed to. Add each office, site or depot as a location with its own boundary.',
        bullets: [
          'Pick clock-in methods: GPS, face, fingerprint or PIN.',
          'Set a geofence radius for each site, then fine-tune it with real data.',
          'Decide what happens when a punch is outside the zone: block, flag or allow with a note.',
        ],
      },
      {
        icon: 'schedule',
        title: 'Plan shifts and working hours',
        text: 'Create shifts and assign them to people or teams, so lateness and overtime are measured against the right schedule.',
      },
      {
        icon: 'beach_access',
        title: 'Set up leave',
        text: 'Define leave types and balances, then let employees request time off. Managers approve or decline in one place.',
        bullets: ['Approved leave appears in the team calendar.', 'Balances update automatically as requests are approved.'],
      },
      {
        icon: 'task_alt',
        title: 'Assign tasks and projects',
        text: 'Give work a home: create projects, assign tasks to people and follow progress without chasing updates.',
      },
      {
        icon: 'insights',
        title: 'Watch the live dashboard',
        text: 'See who is on site, who is late and who is on leave right now. Alerts surface exceptions such as missed clock-ins.',
      },
      {
        icon: 'ios_share',
        title: 'Review reports and export for payroll',
        text: 'Pull hours, overtime and attendance summaries by person, team and period, then export them for your payroll workflow.',
      },
      {
        icon: 'workspace_premium',
        title: 'Manage your plan and access',
        text: 'Upgrade, change billing and review who has admin access whenever your team changes. Remove access as soon as someone leaves.',
      },
    ],
    tips: [
      'Roll out to one team first, learn from it, then add the rest.',
      'Tell employees what is collected at clock-in and why, before you switch it on.',
      'Review flagged punches weekly so genuine issues, like poor signal on site, get fixed.',
    ],
    faqs: [
      ['How long does setup take?', 'Most teams are ready the same day: create the account, add a location, invite a first group and run a test clock-in.'],
      ['Can I use more than one clock-in method?', 'Yes. You can allow several methods and choose which applies to which team or site.'],
      ['Do employees need a smartphone?', 'They can use the Android, iOS or Windows app, or the web app in a browser. Shared devices can be used at a site gate or front desk.'],
      ['Who can see attendance data?', 'Access is role-based. Admins and managers see what their role allows, and employees see their own records.'],
    ],
  },
  {
    slug: 'employees',
    path: '/guide/employees',
    audience: 'For employees',
    title: 'Guide for Employees',
    subtitle:
      'Everything you need to clock in, track your hours, request leave and stay in touch with your team, from sign-in to your first week.',
    icon: 'badge',
    tone: 'green',
    readMins: 4,
    steps: [
      {
        icon: 'mail_outline',
        title: 'Accept your invitation',
        text: 'Your company will email you an invitation. Open it, set your password and sign in on the web or in the app.',
      },
      {
        icon: 'install_mobile',
        title: 'Install the app on your device',
        text: 'Teamital works on Android, iOS, Windows and in your browser. Use whichever suits your day, and sign in with the same account everywhere.',
      },
      {
        icon: 'face',
        title: 'Complete your profile and verification',
        text: 'Add your details and, if your company uses it, set up face or fingerprint verification so your clock-ins are quick and secure.',
      },
      {
        icon: 'play_circle',
        title: 'Clock in and out',
        text: 'Tap Clock in when you start. Your location and verification are checked at that moment, and you will see a confirmation. Tap Clock out when you finish.',
        bullets: ['Make sure location is on for the app.', 'Start and end your breaks so your paid time is correct.'],
      },
      {
        icon: 'timer',
        title: 'Check your hours',
        text: 'See today and this week at a glance, including your clock-in times, breaks and total hours.',
      },
      {
        icon: 'event_available',
        title: 'Request leave',
        text: 'Check your balance, choose your dates and send the request. You are notified as soon as your manager approves or declines it.',
      },
      {
        icon: 'task_alt',
        title: 'Follow your tasks',
        text: 'See what has been assigned to you, update progress and mark work done so your manager always has the latest picture.',
      },
      {
        icon: 'forum',
        title: 'Stay in touch and get notified',
        text: 'Message HR or your team in the app, and turn on notifications for reminders, approvals and announcements.',
      },
      {
        icon: 'edit_note',
        title: 'Missed a punch?',
        text: 'If you forgot to clock in or out, tell your manager. They can add the missing entry so your hours stay accurate.',
      },
    ],
    tips: [
      'Open the app a minute before your shift so location has time to settle.',
      'Keep location services on while you clock in; it is only checked at the moment of the punch.',
      'If something looks wrong in your hours, raise it the same day so it is easy to fix.',
    ],
    faqs: [
      ['Is my location tracked all day?', 'No. Location is checked when you clock in or out, according to your company settings.'],
      ['What if I have no signal at the site?', 'Tell your manager. They can review the punch or add the entry for you.'],
      ['Can I use my own phone?', 'Yes. You can use the Android or iOS app, or the web app, depending on what your company allows.'],
      ['Who do I ask for help?', 'Start with your manager or HR team. You can also reach Teamital support through the contact page.'],
    ],
  },
];

export const getGuide = (slug: string) => GUIDES.find((g) => g.slug === slug);
