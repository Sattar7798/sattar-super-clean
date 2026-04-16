import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Sattar Hedayat | Structural Engineering & Seismic Analysis',
  description: 'Personal website of Sattar Hedayat, showcasing my research in structural engineering, seismic analysis, and AI integration in building engineering.',
  keywords: 'structural engineering, seismic analysis, AI, building engineering, research, earthquake, structural simulation',
  authors: [{ name: 'Sattar Hedayat' }],
  creator: 'Sattar Hedayat',
  robots: 'index, follow',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="bg-[#0f172a] text-gray-200">
        {children}
      </body>
    </html>
  );
} 