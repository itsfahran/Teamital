/** Default copy for the home page (the CMS overlays whatever the admin edits in Site content → Home). */
export type HomeTone = 'blue' | 'violet' | 'green' | 'amber' | 'rose' | 'sky';

export const HOME_PAGE_KEY = 'home';

export const HOME = {
  seo: {
    title: 'Teamital — Complete Workforce Intelligence in One Place',
    description: 'Complete workforce intelligence in one place — attendance, GPS, leave, tasks and live insights.',
  },

  hero: {
    badge: 'Teamital · Workforce intelligence',
    title: 'Workforce tools that',
    typewriter: ['Track attendance.', 'Manage teams.', 'Grow faster.', 'Stay in sync.'],
    body: 'Clock in with GPS and biometrics, manage leave and tasks, and see live workforce insights — on every device.',
    primary: 'Get started free',
    secondary: 'Sign in',
    trust: ['No credit card required', '14-day free trial', 'Cancel anytime'],
    availableLabel: 'Available on:',
    image: '',
  },

  heroChat: {
    avatar: '/assets/logo.jpg',
    name: 'Teamital HR',
    status: 'Online now',
    placeholder: 'Type a message…',
    messages: [
      { kind: 'in', text: 'Good morning! Your shift starts at 9:00 AM at Dublin HQ.', meta: '' },
      { kind: 'out', text: 'On my way, clocking in now.', meta: '' },
      { kind: 'card', text: 'Clock-in confirmed', meta: '08:58 AM · GPS verified · On site' },
      { kind: 'out', text: 'Can I request leave for Friday?', meta: '' },
      { kind: 'in', text: 'Approved. Enjoy the long weekend!', meta: '' },
    ],
    gps: { title: 'GPS verified', meta: 'Dublin HQ · 12 m' },
    timer: { label: 'On site today', value: '06:42:10' },
    chart: { label: 'Attendance this week' },
  },

  features: {
    eyebrow: 'Features',
    title: 'Built for modern teams',
    sub: 'One product for attendance, tasks, leave and insights.',
    image: '/assets/undraw_engineering-team_13ax.svg',
    captionTitle: 'Everything your team needs',
    captionText: 'Attendance, tasks, leave and insights, in one place.',
    items: [
      { icon: 'fingerprint', title: 'Trusted clock-in', text: 'Face, fingerprint and GPS checks keep attendance honest.', tone: 'blue' as HomeTone },
      { icon: 'bar_chart', title: 'Realtime charts', text: 'Web dashboards update as your team clocks in and out.', tone: 'green' as HomeTone },
      { icon: 'forum', title: 'HR chat', text: 'Employees reach HR without leaving the app.', tone: 'violet' as HomeTone },
    ],
  },

  howItWorks: {
    eyebrow: 'How it works',
    title: 'How it works',
    sub: 'Three steps from signup to live ops.',
    image: '/assets/undraw_working-together_r43a.svg',
    steps: [
      { icon: 'apartment', title: 'Create company', text: 'Sign up and invite your workforce in minutes.' },
      { icon: 'fingerprint', title: 'Clock with confidence', text: 'Employees punch in with GPS, face or biometric checks.' },
      { icon: 'insights', title: 'See live insights', text: 'Managers track hours, leave and tasks from the web dashboard.' },
    ],
  },

  roles: {
    eyebrow: 'Roles',
    title: 'Built for every role',
    sub: 'The right tools for admins, staff and partners.',
    items: [
      { icon: 'business', title: 'Company admins', text: 'Departments, employees, attendance maps and exports.', href: '/guide/companies', tone: 'blue' as HomeTone, cta: 'Admin guide' },
      { icon: 'badge', title: 'Employees', text: 'Clock in/out, tasks, leave requests and HR chat.', href: '/guide/employees', tone: 'green' as HomeTone, cta: 'Employee guide' },
      { icon: 'hub', title: 'White-label partners', text: 'Resell with your brand and manage tenant companies.', href: '/white-label-program', tone: 'violet' as HomeTone, cta: 'Partner program' },
    ],
  },

  security: {
    eyebrow: 'Security',
    title: 'Security you can trust',
    text: 'Role-based access, secure auth and audit-friendly records.',
    points: [
      { icon: 'lock', text: 'Encrypted auth sessions via Supabase' },
      { icon: 'admin_panel_settings', text: 'Role gates for admin, employee & partners' },
      { icon: 'fingerprint', text: 'GPS / biometric verification options' },
      { icon: 'history', text: 'Attendance history ready for exports' },
    ],
    linkLabel: 'Read our security policy',
    linkHref: '/security-policy',
    image: '/assets/undraw_device-sync_d9ei.svg',
    chipA: 'Access controlled',
    chipB: 'Audit ready',
  },

  testimonials: {
    eyebrow: 'Testimonials',
    title: 'Loved by growing teams',
    sub: 'Simple words from teams who track attendance every day.',
    items: [
      { quote: 'Clock-in finally works for our field team.', role: 'Ops Manager', caption: 'Teamital customer', tone: 'blue' as HomeTone },
      { quote: 'Web dashboards help us spot late days early.', role: 'HR Lead', caption: 'Teamital customer', tone: 'violet' as HomeTone },
      { quote: 'Employees love the leave + chat flow.', role: 'Company Admin', caption: 'Teamital customer', tone: 'green' as HomeTone },
    ],
  },

  whyUs: {
    eyebrow: 'Why Teamital',
    title: 'Why teams switch to us',
    sub: 'Clear outcomes for HR, ops and field supervisors.',
    items: [
      { icon: 'verified_user', title: 'Honest attendance', text: 'GPS and biometric checks cut buddy punching and fake punches.', tone: 'blue' as HomeTone },
      { icon: 'speed', title: 'Live ops view', text: 'Managers see who is in, late, or on leave without spreadsheet chase.', tone: 'amber' as HomeTone },
      { icon: 'devices', title: 'One stack everywhere', text: 'Web, Android, iOS and desktop share the same workforce data.', tone: 'violet' as HomeTone },
    ],
  },

  toolkit: {
    eyebrow: 'Toolkit',
    title: 'Built-in workforce toolkit',
    sub: 'No patchwork of apps — attendance, leave, tasks and chat together.',
    chips: [
      { label: 'GPS', icon: 'location_on', tone: 'blue' as HomeTone },
      { label: 'Face ID', icon: 'face_retouching_natural', tone: 'violet' as HomeTone },
      { label: 'Fingerprint', icon: 'fingerprint', tone: 'green' as HomeTone },
      { label: 'Leave', icon: 'beach_access', tone: 'amber' as HomeTone },
      { label: 'Tasks', icon: 'task_alt', tone: 'sky' as HomeTone },
      { label: 'Reports', icon: 'ios_share', tone: 'rose' as HomeTone },
    ],
  },

  stats: {
    items: [
      { value: '99.9%', label: 'Uptime focus', icon: 'cloud_done' },
      { value: '4', label: 'Platforms', icon: 'devices' },
      { value: '1', label: 'Source of truth', icon: 'database' },
      { value: '24/7', label: 'Live clock data', icon: 'schedule' },
    ],
  },

  faq: {
    eyebrow: 'FAQ',
    title: 'Quick answers before you sign up',
    text: 'Everything you need to know to get started with Teamital.',
    image: '/assets/undraw_questions_52ic.svg',
    contactLabel: 'Still have questions? Contact us',
    items: [
      { q: 'Does it work on mobile and web?', a: 'Yes — Android, iOS, web and desktop share the same Teamital experience.' },
      { q: 'Can employees clock in with GPS?', a: 'Yes. Admins can require GPS (and biometric/face) for clock-in and clock-out.' },
      { q: 'Is there a company admin dashboard?', a: 'Company admins manage employees, attendance, leave, tasks and reports from the web.' },
    ],
  },

  /** Texts of the alternative layouts used by the legacy "Custom pages → home" editor. */
  variants: {
    hero: {
      mapTitle: 'Track, manage, and optimize your workforce',
      mapBlurb: 'Keep tabs on your team while they are clocked in, with live location.',
      opsTitle: 'See how your team spends the day',
      opsBlurb: 'Live attendance, breaks, and hours in one view, so you know who is on site.',
      defaultTitle: 'Automatic time tracking built for privacy',
      defaultBlurb: 'See the day as it happens, and keep activity data private.',
      privacyButton: 'Start free 14-day trial',
      privacyNote: 'No credit card required',
      workforceA: 'Create a free account',
      workforceB: 'Request a free demo',
      opsA: 'Book a demo',
      opsB: 'Start free trial',
      opsNote: 'No credit card required',
    },
    dashboardCard: {
      title: 'Live attendance',
      stats: [
        { value: '96%', label: 'Present' },
        { value: '12', label: 'Late' },
        { value: '4', label: 'Leave' },
      ],
      lines: ['William · 8h 12m', 'Sara · 7h 40m', 'Ali · On site'],
    },
    opsBoard: {
      title: 'Activities',
      sub: 'On site  ·  Break  ·  Late',
      workTimeLabel: 'Work time',
      workTimeValue: '02:43:02',
      workTimeSub: 'On site · 92%',
      teamHoursLabel: 'Team hours',
      people: [
        { name: 'Ayesha', percent: '92%' },
        { name: 'Hamza', percent: '34%' },
        { name: 'Sara', percent: '76%' },
      ],
    },
    h2: {
      title: 'Workforce tools built for every team',
      blurb: 'Track attendance, tasks, and hours in real time, by person, shift, and site.',
      lines: ['Clock-in with GPS, face, and fingerprint', 'Leave, shifts, and task tracking', 'Live dashboards for managers', 'Reports your payroll team can use', 'Works on mobile, desktop, and web'],
      securityTitle: 'See who is on site, on every device',
      securityBlurb: 'Attendance checks GPS, face, and fingerprint, then shows a clear pass or fail for the team.',
      securityLines: ['GPS check', 'Face check', 'Fingerprint', '- Outside the site', '- Missing photo'],
      securityButton: 'Explore attendance checks',
      cardTitle: 'Team devices',
      cardSub: 'Checks  ·  Needs review',
      todayTitle: 'Today',
      stats: [
        { value: '95%', label: 'On time' },
        { value: '76%', label: 'On site' },
        { value: '73%', label: 'Active' },
      ],
      hoursLabel: 'Hours',
    },
    h3: {
      whyTitle: 'Why time tracking matters',
      whyLines: ['See hours clearly across every team.', 'Build a record your managers can trust.', 'Give clients a work log they can check.', 'Keep attendance ready for review.'],
      whyButton: 'Get started',
      floatTime: '00:21:25',
      floatSub: 'On site today',
      floatCore: '55% core work',
      title: 'Employee tracking on every device',
      blurb: 'Clock in from Windows, Mac, and the web. Attendance, GPS, and live status stay in one place.',
      tabs: ['Desktop', 'Mobile', 'Web'],
      pills: [
        { icon: 'desktop_windows', label: 'Windows' },
        { icon: 'laptop_mac', label: 'macOS' },
        { icon: 'public', label: 'Web' },
      ],
      cardTitle: 'Tracked hours',
      cardValue: '05:57',
      cardOn: 'On site · clocked in',
      mini: [
        { value: '95%', label: 'On time' },
        { value: '76%', label: 'On site' },
      ],
    },
    slots: {
      deviceHeading: 'Personal device tracking',
      deviceBody: 'Employees clock in on their own devices, and tracking stops when they clock out.',
      deviceLines: ['Manual timer start and stop', 'Project and task selection', 'Optional photos', 'App tracking'],
      deviceTimer: '00:21:25',
      deviceOn: 'On site',
      deviceTotal: 'Total today 8:12',
      opsHeading: 'See how your team spends the day',
      opsBody: 'Live attendance, breaks, and hours in one view.',
      opsA: 'Book a demo',
      opsB: 'Start free trial',
      opsBoardTitle: 'Activities',
      chartTitle: 'Hours this week',
      chartLines: ['Real-time monitoring|See who is on site right now.', 'Time and attendance|Hours are recorded as people clock in.', 'Manual entries|Add a missing punch when needed.', 'Reports|Review hours by team and day.'],
      storyLines: ['Clearer project estimates|Hours show how long work really takes.', 'Spot overload early|See when a team is carrying too many hours.'],
      storyImageA: '/assets/home/estimates.jpg',
      storyImageB: '/assets/home/workload.jpg',
      aiHeading: 'A clearer view of the workday',
      aiBody: 'Attendance and hours, summarized so managers can act on the day, not guess.',
      aiButton: 'Start free trial',
      aiTitle: 'Today',
      aiLines: ['Average day is about 8 hours', 'On-site rate is steady this week', 'One team is over the usual hours'],
      topicHeading: 'Leave your team can request',
      topicBody: 'People see their balance, request time off, and managers approve it in the same place.',
      topicButton: 'Open leave',
      topics: ['Leave requests', 'Clock in and out', 'Shifts', 'Reports'],
      askHeading: 'Want a closer look?',
      askBody: 'Book a demo or start a free trial. No credit card required.',
      askA: 'Book a demo',
      askB: 'Start free trial',
    },
  },

  cta: {
    title: 'Ready to track your workforce?',
    text: 'Create your company account in minutes.',
    primary: 'Sign up now',
    secondary: 'Talk to our team',
  },
};

export type HomeContent = typeof HOME;
export type HomeVariants = HomeContent['variants'];
