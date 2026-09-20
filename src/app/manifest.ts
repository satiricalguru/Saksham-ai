import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Saksham · Field Coaching Workspace',
    short_name: 'Saksham',
    description: 'Evidence-grounded classroom coaching for field mentors.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f6f7f3',
    theme_color: '#123e35',
    orientation: 'portrait-primary',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}
