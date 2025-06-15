import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RiskSight AI - AI-Powered Business Risk Analysis',
  description: 'Identifikasi risiko bisnis secara otomatis dengan teknologi AI. Analisis dokumen bisnis, transkrip rapat, dan business plan dengan akurasi tinggi.',
  keywords: 'business risk, AI analysis, risk management, business intelligence, document analysis, RiskSight AI',
  authors: [{ name: 'RiskSight AI Team' }],
  openGraph: {
    title: 'RiskSight AI - AI-Powered Business Risk Analysis',
    description: 'Identifikasi risiko bisnis secara otomatis dengan teknologi AI',
    type: 'website',
  },
  icons: {
    icon: '/icon.png',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        {children}
        <Toaster 
          position="top-right"
          richColors
          closeButton
          duration={4000}
        />
      </body>
    </html>
  );
}