import '../styles/globals.css';
import GoogleAnalytics from '../components/GoogleAnalytics';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;