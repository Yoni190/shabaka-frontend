import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductImageGallery from "../../components/products/ProductImageGallery";
import { getProductById } from "../../api/products";
import { getErrorMessage, isNotFound } from "../../lib/axios";
import type { Product } from "../../types";

const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "SAR",
});

type Status =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "not_found" }
  | { kind: "loaded"; product: Product };

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const productId = Number(id);

  const [status, setStatus] = useState<Status>({ kind: "loading" });

  const load = useCallback(async () => {
    if (!Number.isFinite(productId) || productId <= 0) {
      setStatus({ kind: "not_found" });
      return;
    }

    setStatus({ kind: "loading" });
    try {
      const product = await getProductById(productId);
      setStatus({ kind: "loaded", product });
    } catch (error) {
      if (isNotFound(error)) {
        setStatus({ kind: "not_found" });
      } else {
        setStatus({
          kind: "error",
          message: getErrorMessage(
            error,
            "Unable to load this product. Please try again.",
          ),
        });
      }
    }
  }, [productId]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleAddToCart = (product: Product) => {
    console.info("Add to cart:", product.id);
  };

  /* ---------- Non-loaded states ---------- */

  if (status.kind === "loading") {
    return <DetailsSkeleton />;
  }

  if (status.kind === "not_found") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Error 404
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
          Product not found
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          The product you're looking for doesn't exist or is no longer
          available.
        </p>
        <a
          href="/products"
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Back to products
        </a>
      </div>
    );
  }

  if (status.kind === "error") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-8 text-center">
          <p className="text-sm font-semibold text-rose-800">
            Couldn't load product
          </p>
          <p className="mx-auto mt-1 max-w-md text-sm text-rose-700">
            {status.message}
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <button
              type="button"
              onClick={load}
              className="inline-flex items-center justify-center rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              Try again
            </button>
            <a
              href="/products"
              className="inline-flex items-center justify-center rounded-lg border border-rose-300 bg-white px-5 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
            >
              Back to products
            </a>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- Loaded ---------- */

  const { product } = status;
  const inStock = product.is_active && product.stock_quantity > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-slate-500">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <a href="/" className="transition hover:text-slate-700">
              Home
            </a>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <a href="/products" className="transition hover:text-slate-700">
              Products
            </a>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <a
              href={`/products?category_id=${product.category.id}`}
              className="transition hover:text-slate-700"
            >
              {product.category.name}
            </a>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="truncate font-medium text-slate-700">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Left — images */}
        <div>
          <ProductImageGallery
            images={product.images}
            alt={product.name}
          />
        </div>

        {/* Right — info */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            {product.brand.name}
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {product.name}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
            <span className="font-mono">SKU: {product.sku}</span>
            <span>·</span>
            <span>{product.category.name}</span>
          </div>

          {/* Price + status */}
          <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-y border-slate-200 py-5">
            <div>
              <p className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {priceFormatter.format(Number(product.price))}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                per unit · including tax
              </p>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                inStock
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  inStock ? "bg-emerald-500" : "bg-slate-400"
                }`}
                aria-hidden="true"
              />
              {inStock ? `In stock · ${product.stock_quantity} units` : "Out of stock"}
            </span>
          </div>

          {/* Description */}
          <div className="mt-6">
            <h2 className="text-sm font-semibold text-slate-900">
              Description
            </h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
              {product.description?.trim() ||
                "No description provided for this product."}
            </p>
          </div>

          {/* Add to cart */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => handleAddToCart(product)}
              disabled={!inStock}
              className="inline-flex flex-1 items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
            >
              {inStock ? "Add to Cart" : "Out of stock"}
            </button>
            <a
              href="/products"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Back to catalogue
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Loading skeleton ---------- */

function DetailsSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="h-3 w-64 animate-pulse rounded bg-slate-100" />

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <div className="aspect-[4/3] animate-pulse rounded-lg bg-slate-100" />
          <div className="mt-3 flex gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-14 w-14 animate-pulse rounded-lg bg-slate-100"
              />
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
          <div className="h-8 w-3/4 animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-48 animate-pulse rounded bg-slate-100" />
          <div className="h-24 animate-pulse rounded bg-slate-100" />
          <div className="h-32 animate-pulse rounded bg-slate-100" />
          <div className="h-12 animate-pulse rounded-lg bg-slate-100" />
        </div>
      </div>
    </div>
  );
}