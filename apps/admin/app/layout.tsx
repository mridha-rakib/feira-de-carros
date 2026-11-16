import '@feira/ui/globals.css';
import type { Metadata } from 'next';
import { isExplicitDevOrTest } from '../lib/security/environment';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Painel de Controle | Feira de Carros Admin',
  description: 'Back-office operacional para moderação, suporte e gestão comercial.',
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
  const isDevOrTest = isExplicitDevOrTest();
  return (
    <html lang="pt-BR" data-app-env={isDevOrTest ? 'test' : 'production'}>
      <body className="min-h-screen bg-slate-50 text-foreground font-sans antialiased theme-admin flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
