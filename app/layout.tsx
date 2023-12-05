import '@mantine/core/styles.css';
import './globals.css';

import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import Nav from '@/components/Nav/Nav';

export const metadata = {
  title: 'Buk - A Singular Social Network',
  description: 'I have followed setup instructions carefully',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/*<ColorSchemeScript suppressHydrationWarning />*/}
      </head>
      <body>
        <MantineProvider defaultColorScheme="auto" forceColorScheme="auto">
          <Nav />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
