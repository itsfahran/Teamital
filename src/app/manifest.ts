import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Teamital',
    short_name: 'Teamital',
    start_url: '/',
    display: 'standalone',
    background_color: '#0175C2',
    theme_color: '#1A56DB',
    description: 'Workforce tools that keep your team in sync — attendance, GPS, leave and tasks.',
    orientation: 'portrait-primary',
    icons: [
      { src: '/icons/Icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/Icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/Icon-maskable-192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
      { src: '/icons/Icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
