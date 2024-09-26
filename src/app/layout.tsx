import type { Metadata } from 'next';

import './globals.css';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

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
      <body className="safe-area-padding">
        <div className="min-h-screen bg-background p-0">
          <header className="w-full py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <div className="flex items-center flex-shrink-0 text-primary mr-6">
                <Avatar>
                  <AvatarImage src="https://nicholasgriffin.dev/avatar.png" />
                  <AvatarFallback>NG</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>
          {children}
          <footer className="w-full py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-2">
              <span className="text-muted-foreground text-xs">
                Created by{' '}
                <a href="https://nicholasgriffin.dev">Nicholas Griffin</a>
              </span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
