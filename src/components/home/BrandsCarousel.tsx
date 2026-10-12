import { useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import type { Brand } from "../../types";

interface BrandsCarouselProps {
  brands: Brand[];
}

/**
 * Auto-scrolling, looping, non-interactive logo strip.
 * Logos are display-only — no links, no buttons, not focusable.
 */
export default function BrandsCarousel({ brands }: BrandsCarouselProps) {
  // ---- Respect prefers-reduced-motion ----
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);

    const handler = (event: MediaQueryListEvent) =>
      setReducedMotion(event.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Stable plugins array. When reduced motion is on, we pass no plugins —
  // Embla initialises without auto-scroll and simply shows a static row.
  const plugins = useMemo(() => {
    if (reducedMotion) return [];
    return [
      AutoScroll({
        speed: 0.8,
        startDelay: 0,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        stopOnFocusIn: false,
        playOnInit: true,
      }),
    ];
  }, [reducedMotion]);

  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      dragFree: true,
      containScroll: false,
    },
    plugins,
  );

  return (
    <div
      ref={emblaRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Brands we carry"
      className="overflow-hidden"
    >
      <div className="flex touch-pan-y">
        {brands.map((brand, index) => (
          <div
            key={brand.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${brands.length}`}
            className="flex h-28 min-w-0 shrink-0 grow-0 basis-1/2 items-center justify-center px-4 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
          >
            <BrandLogo brand={brand} />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Renders the brand logo if a URL is present and loads successfully,
 * otherwise falls back to the brand name so nothing ever shows a
 * broken-image icon.
 */
function BrandLogo({ brand }: { brand: Brand }) {
  const [errored, setErrored] = useState(false);

  if (!brand.brand_image_url || errored) {
    return (
      <span className="line-clamp-2 text-center text-sm font-semibold text-slate-700">
        {brand.name}
      </span>
    );
  }

  return (
    <img
      src={brand.brand_image_url}
      alt={brand.name}
      loading="lazy"
      onError={() => setErrored(true)}
      className="max-h-20 max-w-full object-contain"
    />
  );
}

/** Loading placeholder — same slide geometry so nothing jumps when data lands. */
export function BrandsCarouselSkeleton() {
  return (
    <div className="overflow-hidden" aria-hidden="true">
      <div className="flex">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex h-28 min-w-0 shrink-0 grow-0 basis-1/2 items-center justify-center px-4 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
          >
            <div className="h-16 w-32 animate-pulse rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}