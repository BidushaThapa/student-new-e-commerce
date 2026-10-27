import { useState } from 'react';

type ProductImageProps = {
  src?: string;
  alt: string;
  className?: string;
};

export function ProductImage({ src, alt, className = '' }: ProductImageProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-slate-100 text-sm font-semibold text-slate-500 ${className}`}
      >
        Image unavailable
      </div>
    );
  }

  return (
    <img
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      src={src}
    />
  );
}
