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
import './sections.css';
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

const GTM_ID = 'GTM-KFMTVPXP';

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
    icon: [{ url: '/favicon.jpg', type: 'image/jpeg' }],
    shortcut: '/favicon.jpg',
    apple: '/favicon.jpg',
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
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
        {/* End Google Tag Manager */}
        <noscript>
          <style>{'.aos{opacity:1!important;transform:none!important}'}</style>
        </noscript>
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`} height="0" width="0" style={{ display: 'none', visibility: 'hidden' }} />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
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
