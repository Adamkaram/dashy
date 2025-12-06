import type { Metadata } from 'next';
import './globals.css';
import ClientBody from './ClientBody';

export const metadata: Metadata = {
  title: 'ماى مومنت | Sarainah',
  description: 'خدمات تنسيق الفعاليات والمناسبات - Event Planning and Decoration Services',
};

import LayoutWrapper from '@/components/LayoutWrapper';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <ClientBody>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </ClientBody>
    </html>
  );
}
