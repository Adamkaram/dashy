import type { Metadata } from 'next';
import './globals.css';
import ClientBody from './ClientBody';

export const metadata: Metadata = {
  title: 'ماى مومنت | Sarainah',
  description: 'خدمات تنسيق الفعاليات والمناسبات - Event Planning and Decoration Services',
};

import { Montserrat } from 'next/font/google';
import LayoutWrapper from '@/components/LayoutWrapper';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning className={montserrat.variable}>
      <ClientBody>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </ClientBody>
    </html>
  );
}
