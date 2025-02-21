import './globals.css'; // Si tienes estilos globales
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Layout from './components/layout/Layout'; // Importa el Layout component!

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mi Aplicación Next.js con App Router',
  description: 'Layout con Topbar y Sidebar',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Layout>{children}</Layout> 
      </body>
    </html>
  );
}