import '../styles/globals.css'; // Si tienes estilos globales (opcional)
import Layout from './components/layout/Layout';
import type { AppProps } from 'next/app'; // Importa AppProps desde 'next/app'

function MyApp({ Component, pageProps }: AppProps) { // Anota el tipo de las props de MyApp
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;