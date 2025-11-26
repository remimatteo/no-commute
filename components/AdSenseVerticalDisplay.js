import { useEffect, useRef } from 'react';

export default function AdSenseVerticalDisplay() {
  const adLoaded = useRef(false);

  useEffect(() => {
    if (adLoaded.current) return;

    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        adLoaded.current = true;
      }
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div className="adsense-container">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-9962507745166386"
        data-ad-slot="3231011024"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
