'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { imageQuality } from '@/config/images';
import { generatePlaceholderDataUrl, getImageName } from '@/utils';

interface OptimizedImageProps extends Omit<ImageProps, 'onError'> {
  fallbackText?: string;
  showImageName?: boolean;
  useFill?: boolean;
  blurPlaceholder?: boolean;
}

const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  fallbackText,
  showImageName = true,
  className = '',
  priority = false,
  quality = imageQuality.medium,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  useFill = false,
  blurPlaceholder = true,
  loading: loadingProp,
  ...props
}: OptimizedImageProps) => {
  const [error, setError] = useState(false);
  const imageName = getImageName(src);
  const displayText = fallbackText || `Image needs updating: ${imageName}`;

  // Only use loading='lazy' when priority is false
  const loading = priority ? undefined : (loadingProp || 'lazy');

  // Generate placeholder - only if requested and not priority loading
  const placeholderDataUrl = !priority && blurPlaceholder
    ? generatePlaceholderDataUrl(
        width || 700,
        height || 475,
        true
      )
    : undefined;

  const handleError = () => {
    setError(true);
  };

  if (error) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gray-100 border border-gray-200 ${className}`}
        style={{
          width: useFill ? '100%' : width,
          height: useFill ? '100%' : height,
          minHeight: 100,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-10 h-10 text-gray-400 mb-2"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
        <div className="text-center p-2">
          <p className="text-gray-600 text-sm">{displayText}</p>
          {showImageName && (
            <code className="text-xs bg-gray-200 px-1 py-0.5 rounded mt-1 block">{imageName}</code>
          )}
        </div>
      </div>
    );
  }

  // Use a single return with conditional props for fill
  return (
    <>
      {useFill ? (
        <div className={`relative w-full h-full ${className}`}>
          <Image
            src={src}
            alt={alt}
            fill={true}
            className="object-cover"
            priority={priority}
            quality={quality}
            sizes={sizes}
            onError={handleError}
            loading={loading}
            placeholder={placeholderDataUrl ? 'blur' : 'empty'}
            blurDataURL={placeholderDataUrl}
            {...props}
          />
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`object-cover ${className}`}
          priority={priority}
          quality={quality}
          sizes={sizes}
          onError={handleError}
          loading={loading}
          placeholder={placeholderDataUrl ? 'blur' : 'empty'}
          blurDataURL={placeholderDataUrl}
          {...props}
        />
      )}
    </>
  );
};

export default OptimizedImage;
