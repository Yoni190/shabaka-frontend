import type { Product } from "../../types";
import ImageWithFallback from "../ui/ImageWithFallback";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "SAR",
});

/** Primary image if flagged, otherwise the first, otherwise empty. */
function pickImageUrl(product: Product): string {
  const primary = product.images.find((image) => image.is_primary);
  return (primary ?? product.images[0])?.url ?? "";
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const imageUrl = pickImageUrl(product);
  const inStock = product.is_active && product.stock_quantity > 0;

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-blue-300 hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden">
        <ImageWithFallback
          src={imageUrl}
          alt={product.name}
          label={product.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700 shadow-sm">
          {product.brand.name}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
          {product.brand.name} · {product.sku}
        </p>

        <h3 className="mt-1 text-sm font-semibold leading-5 text-slate-900">
          <a
            href={`/products/${product.id}`}
            className="transition hover:text-blue-600"
          >
            {product.name}
          </a>
        </h3>

        <p className="mt-2 flex items-center gap-1.5 text-xs font-medium">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              inStock ? "bg-emerald-500" : "bg-rose-500"
            }`}
            aria-hidden="true"
          />
          <span className={inStock ? "text-emerald-700" : "text-rose-600"}>
            {inStock ? "In stock" : "Out of stock"}
          </span>
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-slate-100 pt-4">
          <div>
            <p className="text-base font-semibold text-slate-900">
              {priceFormatter.format(Number(product.price))}
            </p>
            <p className="text-[11px] text-slate-500">per unit · incl. tax</p>
          </div>

          <button
            type="button"
            onClick={() => onAddToCart?.(product)}
            disabled={!inStock}
            className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}

/** Placeholder shown while products are loading. */
export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="aspect-[4/3] bg-slate-100" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-20 rounded bg-slate-100" />
        <div className="h-4 w-3/4 rounded bg-slate-100" />
        <div className="h-3 w-1/4 rounded bg-slate-100" />
        <div className="h-9 w-full rounded-lg bg-slate-100" />
      </div>
    </div>
  );
}