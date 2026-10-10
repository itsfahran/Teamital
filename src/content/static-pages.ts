/** Static marketing pages linked from the footer (port of WebLegalPage content). */
export type StaticPage = { title: string; subtitle: string; paragraphs: string[] };

export const STATIC_PAGES: Record<'about' | 'features' | 'careers' | 'blog', StaticPage> = {
  about: {
    title: 'About us',
    subtitle: 'We build workforce tools that keep teams honest, on time, and in sync.',
    paragraphs: [
      'Teamital helps companies track attendance with GPS and biometrics, manage leave and tasks, and see live workforce insights.',
      'Our product runs on web, Android, iOS and desktop so office and field teams share one source of truth.',
      'We partner with HR and operations leaders who need reliable punch data without complicated software.',
    ],
  },
  features: {
    title: 'Features',
    subtitle: 'Everything you need for modern workforce attendance.',
    paragraphs: [
      'Clock in / out with GPS geofencing, face and biometric checks.',
      'Leave requests, balances and manager approvals in one place.',
      'Task assignment, HR chat, and realtime dashboards for admins.',
      'Exports and work summaries ready for payroll workflows.',
    ],
  },
  careers: {
    title: 'Careers',
    subtitle: 'Join a product team focused on workforce tools.',
    paragraphs: [
      'We hire engineers, designers and customer success specialists who care about clear UX.',
      'Remote-friendly roles open periodically — send your CV via the Contact page.',
      'Tell us how you would improve attendance for field teams.',
    ],
  },
  blog: {
    title: 'Blog',
    subtitle: 'Guides on attendance, GPS and HR ops.',
    paragraphs: [
      'How GPS geofencing reduces buddy punching.',
      'Choosing biometric vs face verification for offices.',
      'Building dashboards managers actually open every morning.',
      'More articles coming soon — follow us on social for updates.',
    ],
  },
};
