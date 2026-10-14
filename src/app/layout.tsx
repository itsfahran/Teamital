import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { Roboto } from 'next/font/google';
import './globals.css';
import './header.css';
import './site.css';
import './hero-visual.css';
import './blog.css';
import './guide.css';
import './wl.css';
import './policy.css';
import './home-sections.css';
import './booking.css';
import './admin.css';
import { SITE } from '@/lib/config';
import { ToastProvider } from '@/components/Toast';
import { Intercom } from '@/components/Intercom';
import { BookingModalProvider } from '@/components/booking/BookingModal';
import { ChromeProvider } from '@/components/ChromeProvider';
import { CHROME, CHROME_PAGE_KEY } from '@/content/chrome';
import { getSiteContent } from '@/lib/content/server';

const poppins = localFont({
  src: [
    { path: '../fonts/Poppins-Light.ttf', weight: '300', style: 'normal' },
    { path: '../fonts/Poppins-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../fonts/Poppins-Medium.ttf', weight: '500', style: 'normal' },
    { path: '../fonts/Poppins-SemiBold.ttf', weight: '600', style: 'normal' },
    { path: '../fonts/Poppins-Bold.ttf', weight: '700', style: 'normal' },
    { path: '../fonts/Poppins-ExtraBold.ttf', weight: '800', style: 'normal' },
  ],
  variable: '--font-poppins',
  display: 'swap',
});

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
});

const TITLE = 'Teamital — Complete Workforce Intelligence in One Place';
const DESCRIPTION =
  'Complete workforce intelligence in one place — attendance, GPS, leave, tasks and live insights.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE.publicSiteUrl),
  title: TITLE,
  description: DESCRIPTION,
  applicationName: 'Teamital',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [{ url: '/brand-logo.png', type: 'image/png' }],
    shortcut: '/brand-logo.png',
    apple: '/brand-logo.png',
  },
  openGraph: {
    title: 'Teamital — Workforce tools that keep your team in sync',
    description: 'Track attendance, tasks, and hours in real time — by person, shift, and site.',
    type: 'website',
    url: SITE.publicSiteUrl + '/',
  },
  appleWebApp: { title: 'Teamital', statusBarStyle: 'black' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FFFFFF',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const chrome = await getSiteContent(CHROME_PAGE_KEY, CHROME);
  return (
    <html lang="en" className={`${poppins.variable} ${roboto.variable}`}>
      <head>
        <noscript>
          <style>{'.aos{opacity:1!important;transform:none!important}'}</style>
        </noscript>
      </head>
      <body>
        <ToastProvider>
          <ChromeProvider value={chrome}>
            <BookingModalProvider>{children}</BookingModalProvider>
          </ChromeProvider>
        </ToastProvider>
        <Intercom />
      </body>
    </html>
  );
}
