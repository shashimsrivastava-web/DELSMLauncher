import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: '3D Vertical Rotating Dial Menu',
  description: 'An interactive 3D vertical rotating dial carousel for fluid hyperlink navigation.',
  openGraph: {
    title: '3D Vertical Rotating Dial Menu',
    description: 'An interactive 3D vertical rotating dial carousel for fluid hyperlink navigation.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '3D Vertical Rotating Dial Menu',
    description: 'An interactive 3D vertical rotating dial carousel for fluid hyperlink navigation.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
