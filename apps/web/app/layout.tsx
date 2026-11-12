import '@feira/ui/globals.css';
import type { Metadata } from 'next';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Feira de Carros | O Maior Marketplace Automotivo',
  description:
    'Compre e venda carros novos e seminovos com segurança, transparência e as melhores ofertas de particulares e concessionárias.',
  icons: {
    icon: [
      { url: '/brand/2026/brand-icon-red.png?v=2026_v2', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico?v=2026_v2' },
      { url: '/brand/2026/icon-512.png?v=2026_v2', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico?v=2026_v2',
    apple: '/brand/2026/icon-512.png?v=2026_v2',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-background font-sans antialiased flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
