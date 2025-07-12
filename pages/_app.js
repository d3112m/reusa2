import '@/styles/globals.css';
import Layout from '@/components/Layout';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  // Se a página tiver um layout customizado, use-o. Senão, use o padrão.
  const getLayout = Component.getLayout || ((page) => <Layout>{page}</Layout>)

  return getLayout(
    <>
      <Head>
        <title>ReUse App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;