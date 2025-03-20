import React, { useState, useEffect, useRef } from 'react';
import { ImageOff } from 'lucide-react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fallbackClassName?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  priority?: boolean;
  placeholderColor?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  fallbackClassName = '',
  objectFit = 'cover',
  priority = false,
  placeholderColor = '#f3f4f6',
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Reset states when src changes
    setIsLoaded(false);
    setIsError(false);
  }, [src]);

  useEffect(() => {
    const currentImgRef = imgRef.current;

    // If priority is true, don't use intersection observer and load immediately
    if (priority && currentImgRef) {
      if (currentImgRef.complete) {
        handleImageLoaded();
      }
      return;
    }

    // Initialize intersection observer for lazy loading
    observer.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && currentImgRef) {
          // When the image enters the viewport, start loading it
          currentImgRef.src = src;
          observer.current?.unobserve(currentImgRef);
        }
      },
      {
        rootMargin: '200px', // Start loading when image is 200px away from viewport
        threshold: 0.01,
      }
    );

    if (currentImgRef) {
      observer.current.observe(currentImgRef);
    }

    return () => {
      if (currentImgRef && observer.current) {
        observer.current.unobserve(currentImgRef);
      }
    };
  }, [src, priority]);

  const handleImageLoaded = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleImageError = () => {
    setIsError(true);
    onError?.();
  };

  // Construct style object
  const imageStyle: React.CSSProperties = {
    objectFit,
    width: width ? `${width}px` : '100%',
    height: height ? `${height}px` : '100%',
    backgroundColor: placeholderColor,
    transition: 'opacity 0.3s ease',
    opacity: isLoaded ? 1 : 0,
  };

  // Create image element with appropriate attributes
  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '100%',
      }}
    >
      <div
        className="absolute inset-0 animate-pulse"
        style={{
          backgroundColor: placeholderColor,
          opacity: isLoaded ? 0 : 1,
          transition: 'opacity 0.3s ease',
        }}
      />

      {isError ? (
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center bg-muted ${fallbackClassName}`}
        >
          <ImageOff className="mb-2 h-8 w-8 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Failed to load image</span>
        </div>
      ) : (
        <img
          ref={imgRef}
          alt={alt}
          className={className}
          style={imageStyle}
          onLoad={handleImageLoaded}
          onError={handleImageError}
          // If priority is true, set src immediately, otherwise it will be set by the observer
          src={priority ? src : ''}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      )}
    </div>
  );
};

export default OptimizedImage;
