import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        {/* Monetag verification */}
        <meta name="monetag" content="cf4c027231e2f06123bce0c0fd7d7081" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}