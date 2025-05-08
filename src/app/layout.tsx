import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sattar Hedayat | Structural Engineering & Seismic Analysis',
  description: 'Personal website of Sattar Hedayat, showcasing my research in structural engineering, seismic analysis, and AI integration in building engineering.',
  keywords: 'structural engineering, seismic analysis, AI, building engineering, research, earthquake, structural simulation',
  authors: [{ name: 'Sattar Hedayat' }],
  creator: 'Sattar Hedayat',
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
} 