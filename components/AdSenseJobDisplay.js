import { useEffect } from 'react';

export default function AdSenseJobDisplay() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div className="my-8">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-9962507745166386"
        data-ad-slot="9436716943"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
