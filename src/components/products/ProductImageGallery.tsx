import { useState } from "react";

interface ProductImageGalleryProps {
  images: { id: number; url: string; is_primary: boolean }[];
  alt: string;
}

export default function ProductImageGallery({
  images,
  alt,
}: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-400">
        No images
      </div>
    );
  }

  const active = images[Math.min(activeIndex, images.length - 1)];

  return (
    <div>
      <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white">
        <img
          src={active.url}
          alt={alt}
          className="aspect-[4/3] w-full object-contain"
        />
        {active.is_primary && (
          <span className="absolute left-2 top-2 rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
            Primary
          </span>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border transition ${
                index === activeIndex
                  ? "border-blue-500 ring-2 ring-blue-500/20"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <img
                src={image.url}
                alt=""
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}