
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fluxa eCommerce Assistant - AI-Powered eCommerce Solution',
  description: 'Boost sales and reduce support costs with Fluxa eCommerce Assistant. The most advanced AI eCommerce plugin for WordPress and e-commerce platforms.',
};

// Dynamically import Chatbox with SSR disabled
const Chatbox = dynamic(
  () => import('@/components/chatbox/Chatbox'),
  { ssr: false }
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} relative`} suppressHydrationWarning={true}>
          {children}
          <Chatbox />
      </body>
    </html>
  );
}
