import '@feira/ui/globals.css';
import type { Metadata } from 'next';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'Feira de Carros | O Maior Marketplace Automotivo',
  description:
    'Compre e venda carros novos e seminovos com segurança, transparência e as melhores ofertas de particulares e concessionárias.',
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
