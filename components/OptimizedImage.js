import { useState } from 'react';
import { Briefcase } from 'lucide-react';

export default function OptimizedImage({ src, alt, className, darkMode }) {
  const [imageError, setImageError] = useState(false);
  const [fallbackError, setFallbackError] = useState(false);

  if (imageError && fallbackError) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Briefcase className={`w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
      </div>
    );
  }

  return (
    <img
      src={imageError ? src.replace('logo.clearbit.com', 'www.google.com/s2/favicons?sz=64&domain=') : src}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (!imageError) {
          setImageError(true);
        } else {
          setFallbackError(true);
        }
      }}
    />
  );
}
