import { useEffect, useRef } from 'react';

export default function AdSenseInFeed() {
  const adRef = useRef(null);
  const isAdPushed = useRef(false);

  useEffect(() => {
    try {
      // Only push ad if it hasn't been pushed yet and the element exists
      if (typeof window !== 'undefined' &&
          window.adsbygoogle &&
          adRef.current &&
          !isAdPushed.current) {

        // Check if this specific ad element already has an ad
        const hasAd = adRef.current.getAttribute('data-adsbygoogle-status');

        if (!hasAd) {
          window.adsbygoogle.push({});
          isAdPushed.current = true;
        }
      }
    } catch (err) {
      // Silently handle errors as AdSense will retry
      console.log('AdSense loading...');
    }
  }, []);

  return (
    <div className="my-4">
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-format="fluid"
        data-ad-layout-key="-gm-12-36-7c+za"
        data-ad-client="ca-pub-9962507745166386"
        data-ad-slot="1244910894"
      />
    </div>
  );
}
