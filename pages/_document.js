import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://logo.clearbit.com" />
        <link rel="preconnect" href="https://www.google.com" />
        
        {/* Google Fonts - Caveat for handwritten style - optimized with display=swap */}
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* ✅ CookieYes banner script - deferred for better performance */}
        <script
          id="cookieyes"
          type="text/javascript"
          src="https://cdn-cookieyes.com/client_data/812e5433b4a05d2ac6826592/script.js"
          defer
        ></script>

        {/* ✅ Google AdSense script - async already applied */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9962507745166386"
          crossOrigin="anonymous"
        ></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
