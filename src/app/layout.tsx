import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'NG AI App - Image to Website',
  description: 'A side project to convert images to websites',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
