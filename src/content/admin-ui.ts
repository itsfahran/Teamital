/** Labels of the admin panel itself (Admin → Site content → Admin panel labels). */
export const ADMIN_UI_KEY = 'admin-ui';

export const ADMIN_UI = {
  brand: 'Admin',
  viewSite: 'View site',
  signOut: 'Sign out',
  nav: {
    dashboard: 'Dashboard',
    content: 'Site content',
    customPages: 'Custom pages',
    navigation: 'Navigation',
    plans: 'Pricing plans',
    bookings: 'Call bookings',
    availability: 'Availability',
    leads: 'Leads',
    messages: 'Messages',
  },
  dashboard: {
    title: 'Dashboard',
    pagesLabel: 'Pages',
    pagesSub: 'published',
    unreadLabel: 'Unread messages',
    unreadSub: 'total',
    callsLabel: 'Upcoming calls',
    callsSub: 'booked from /book-a-call',
    plansLabel: 'Pricing plans',
    plansSub: 'shown on /pricing',
    latestTitle: 'Latest messages',
    noMessages: 'No messages yet.',
    newBadge: 'new',
  },
  pages: {
    content: {
      title: 'Site content',
      intro: 'Edit the text, images and buttons of every page. Descriptions have a formatting toolbar, images upload straight from your computer, and changes go live as soon as you press Save & publish.',
      relatedTitle: 'Also managed here',
    },
    availability: { title: 'Booking availability', intro: 'Choose when visitors can book a call. Changes apply to the public booking page straight away.' },
    bookings: { title: 'Call bookings', intro: 'Calls booked from the “Book a free 1:1 call” page. Times are shown in your browser’s time zone.' },
    messages: { title: 'Messages', intro: 'Submissions from the website contact form.' },
    plans: { title: 'Pricing plans', intro: 'These plans appear on the public Pricing page.' },
  },
};

export type AdminUi = typeof ADMIN_UI;
