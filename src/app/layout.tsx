import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Saksham · Your field coaching workspace',
  description: 'Turn classroom observations into thoughtful coaching and meaningful follow-up.',
  applicationName: 'Saksham',
  appleWebApp: { capable: true, title: 'Saksham', statusBarStyle: 'default' },
};
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="en"><body>{children}</body></html>;
}
