import { useState } from "react";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  /** Short label shown inside the placeholder when there is no image. */
  label?: string;
}

/**
 * Renders an image, falling back to a neutral placeholder block when the
 * source is empty or fails to load. Keeps product/category cards safe once
 * real API image URLs are wired up.
 */
export default function ImageWithFallback({
  src,
  alt,
  className = "",
  label,
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-100 to-slate-200 ${className}`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-8 w-8 text-slate-300"
          aria-hidden="true"
        >
          <rect x="2" y="3" width="20" height="7" rx="2" />
          <rect x="2" y="14" width="20" height="7" rx="2" />
          <path d="M6 6.5h.01M6 17.5h.01" />
        </svg>
        <span className="max-w-full truncate px-3 text-[11px] font-medium uppercase tracking-wide text-slate-400">
          {label ?? alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}