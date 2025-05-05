import Head from 'next/head';

export default function Test() {
  return (
    <div>
      <Head>
        <title>Test Page</title>
        <meta name="description" content="A simple test page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{ padding: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Test Page</h1>
        <p>If you can see this page, the basic Next.js setup is working correctly.</p>
      </main>
    </div>
  );
} 