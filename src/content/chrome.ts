import { ROUTES, SITE, STORE_LINKS } from '@/lib/config';

/** Site-wide header and footer content (Admin → Site content → Header & footer). */
export const CHROME_PAGE_KEY = 'site-chrome';

export const HEADER_MENUS = [
  {
    id: 'Features',
    label: 'Features',
    columns: [
      {
        title: 'Workforce',
        items: [
          { icon: 'fingerprint', title: 'Clock in / out', subtitle: 'GPS, face & biometric attendance', href: '', external: false },
          { icon: 'task_alt', title: 'Tasks', subtitle: 'Assign work and track progress', href: '', external: false },
          { icon: 'beach_access', title: 'Leave', subtitle: 'Requests, balances & approvals', href: '', external: false },
          { icon: 'schedule', title: 'Shifts', subtitle: 'Schedules your team can trust', href: '', external: false },
        ],
      },
      {
        title: 'Insights',
        items: [
          { icon: 'bar_chart', title: 'Live dashboards', subtitle: 'Realtime hours & attendance charts', href: '', external: false },
          { icon: 'assignment', title: 'Work summary', subtitle: 'Hours, overtime & attendance %', href: '', external: false },
          { icon: 'notifications', title: 'Alerts', subtitle: 'Clock-in reminders & updates', href: '', external: false },
        ],
      },
      {
        title: 'Collaboration',
        items: [
          { icon: 'forum', title: 'Community & AI', subtitle: 'Chat with HR and company teams', href: '', external: false },
          { icon: 'support_agent', title: 'Help desk', subtitle: 'Tickets and support in-app', href: '', external: false },
        ],
      },
    ],
  },
  {
    id: 'Solutions',
    label: 'Solutions',
    columns: [
      {
        title: 'Teams',
        items: [
          { icon: 'rocket_launch', title: 'For Startups', subtitle: 'Get attendance live without a big HR team', href: '', external: false },
          { icon: 'storefront', title: 'For Small Businesses', subtitle: 'One place for clock-in, leave and reports', href: '', external: false },
          { icon: 'apartment', title: 'For Enterprises', subtitle: 'Multi-site workforce with role-based access', href: '', external: false },
          { icon: 'wifi', title: 'For Remote Teams', subtitle: 'See who is working, from any location', href: '', external: false },
          { icon: 'location_on', title: 'For Field Employees', subtitle: 'GPS-verified presence on site', href: '', external: false },
          { icon: 'verified', title: 'White Label Program', subtitle: 'Launch your own branded SaaS', href: ROUTES.whiteLabel, external: false },
        ],
      },
      {
        title: 'Industries',
        items: [
          { icon: 'trending_up', title: 'For Sales Teams', subtitle: 'Track field visits and daily activity', href: '', external: false },
          { icon: 'local_shipping', title: 'For Delivery Teams', subtitle: 'Confirm stops and on-the-road hours', href: '', external: false },
          { icon: 'construction', title: 'For Construction Companies', subtitle: 'Site attendance with geofencing', href: '', external: false },
          { icon: 'handyman', title: 'For Service Businesses', subtitle: 'Technicians, jobs and time on site', href: '', external: false },
          { icon: 'precision_manufacturing', title: 'For Manufacturing Companies', subtitle: 'Shift attendance across factory floors', href: '', external: false },
        ],
      },
    ],
  },
  {
    id: 'Platforms',
    label: 'Platforms',
    columns: [
      {
        title: 'Get the app',
        items: [
          { icon: 'android', title: 'Android', subtitle: 'Download on Google Play', href: STORE_LINKS.playStore, external: true },
          { icon: 'apple', title: 'iOS', subtitle: 'Download on the App Store', href: STORE_LINKS.appStore, external: true },
          { icon: 'desktop_windows', title: 'Windows', subtitle: 'Install from Microsoft Store', href: STORE_LINKS.microsoftStore, external: true },
          { icon: 'language', title: 'Web', subtitle: 'Open the browser app', href: ROUTES.signIn, external: false },
        ],
      },
    ],
  },
  {
    id: 'Resources',
    label: 'Resources',
    columns: [
      {
        title: 'Learn',
        items: [
          { icon: 'article', title: 'Blog', subtitle: 'Guides on attendance and GPS', href: ROUTES.blog, external: false },
          { icon: 'apartment', title: 'Guide for Companies', subtitle: 'Set up your team, rules and reports', href: ROUTES.guideCompanies, external: false },
          { icon: 'menu_book', title: 'Guide for Employees', subtitle: 'Clock in, hours, leave and tasks', href: ROUTES.guideEmployees, external: false },
          { icon: 'new_releases', title: 'Product Updates', subtitle: 'What is new in Teamital', href: '', external: false },
        ],
      },
      {
        title: 'Support',
        items: [
          { icon: 'help_center', title: 'Help Center', subtitle: 'Get answers and how-to steps', href: '', external: false },
          { icon: 'quiz', title: 'FAQs', subtitle: 'Common questions about the workflow', href: '', external: false },
          { icon: 'mail_outline', title: 'Contact Support', subtitle: 'Reach our support inbox', href: ROUTES.contact, external: false },
        ],
      },
    ],
  },
];

export const CHROME = {
  header: {
    homeLabel: 'Home',
    howItWorksLabel: 'How It Works',
    pricingLabel: 'Pricing',
    scheduleLabel: 'Schedule 1:1 Demo',
    scheduleShortLabel: 'Schedule demo',
    signInLabel: 'Sign in',
    trialLabel: 'Start 14-days trial',
    menus: HEADER_MENUS,
  },
  footer: {
    tagline: 'Complete workforce intelligence in one place: attendance, GPS, leave, tasks and live insights for every team.',
    email: SITE.contactEmail,
    address: 'Kandoy House, 2 Fairview Strand, Clontarf West, Dublin, D03 R8P3, Ireland',
    columns: [
      {
        title: 'Product',
        links: [
          { label: 'Features', href: ROUTES.features },
          { label: 'How it works', href: ROUTES.howItWorks },
          { label: 'Pricing', href: ROUTES.pricing },
          { label: 'Sign in', href: ROUTES.signIn },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'About us', href: ROUTES.about },
          { label: 'Contact', href: ROUTES.contact },
          { label: 'Book a call', href: ROUTES.bookCall },
          { label: 'Careers', href: ROUTES.careers },
          { label: 'White Label Program', href: ROUTES.whiteLabel },
        ],
      },
      {
        title: 'Resources',
        links: [
          { label: 'Guide for Companies', href: ROUTES.guideCompanies },
          { label: 'Guide for Employees', href: ROUTES.guideEmployees },
          { label: 'Blog', href: ROUTES.blog },
        ],
      },
      {
        title: 'Legal',
        links: [
          { label: 'Privacy Policy', href: ROUTES.privacyPolicy },
          { label: 'Terms & Conditions', href: ROUTES.terms },
          { label: 'Cookie Policy', href: ROUTES.cookies },
          { label: 'Security Policy', href: ROUTES.security },
          { label: 'Delete account', href: ROUTES.deleteAccount },
        ],
      },
    ],
    availableLabel: 'Available for:',
    copyright: 'All rights reserved.',
    bottomLinks: [
      { label: 'Privacy', href: ROUTES.privacyPolicy },
      { label: 'Terms', href: ROUTES.terms },
      { label: 'Cookies', href: ROUTES.cookies },
      { label: 'Security', href: ROUTES.security },
    ],
    social: [
      { name: 'linkedin', label: 'LinkedIn', url: SITE.socialLinkedIn },
      { name: 'x', label: 'X (Twitter)', url: SITE.socialX },
      { name: 'youtube', label: 'YouTube', url: SITE.socialYouTube },
      { name: 'facebook', label: 'Facebook', url: SITE.socialFacebook },
      { name: 'instagram', label: 'Instagram', url: SITE.socialInstagram },
      { name: 'pinterest', label: 'Pinterest', url: SITE.socialPinterest },
      { name: 'tiktok', label: 'TikTok', url: SITE.socialTikTok },
    ],
  },
};

export type ChromeContent = typeof CHROME;
