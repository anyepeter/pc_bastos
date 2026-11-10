import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CEPCA — Council of Protestant Churches of Cameroon',
    short_name: 'CEPCA',
    description: 'Conseil des Églises Protestantes du Cameroun · Council of Protestant Churches of Cameroon',
    start_url: '/',
    display: 'browser',
    background_color: '#ffffff',
    theme_color: '#5B32A6',
    icons: [
      { src: '/images/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/images/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
