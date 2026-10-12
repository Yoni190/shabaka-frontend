import { useEffect, useState } from "react";
import HeroSection from "../../components/home/HeroSection";
import ValueProposition from "../../components/home/ValueProposition";
import CallToAction from "../../components/home/CallToAction";
import BrandsCarousel, {
  BrandsCarouselSkeleton,
} from "../../components/home/BrandsCarousel";
import ProductCard, {
  ProductCardSkeleton,
} from "../../components/products/ProductCard";
import { getBrands } from "../../api/brands";
import { getHomeProducts } from "../../api/products";
import type { Brand, Product } from "../../types";

export default function HomePage() {
  /* ---------- Brands (API) ---------- */

  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoadingBrands, setIsLoadingBrands] = useState(true);
  const [brandsError, setBrandsError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoadingBrands(true);
      setBrandsError(null);
      try {
        const data = await getBrands();
        if (!cancelled) setBrands(data);
      } catch {
        if (!cancelled) {
          setBrandsError(
            "Unable to load brands. Please try again later.",
          );
        }
      } finally {
        if (!cancelled) setIsLoadingBrands(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  /* ---------- Featured products (API) ---------- */

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoadingProducts(true);
      setProductsError(null);
      try {
        const data = await getHomeProducts();
        if (!cancelled) setFeaturedProducts(data);
      } catch {
        if (!cancelled) {
          setProductsError(
            "Unable to load featured products. Please try again later.",
          );
        }
      } finally {
        if (!cancelled) setIsLoadingProducts(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAddToCart = (product: Product) => {
    console.info("Add to cart:", product.id);
  };

  /* ---------- Render ---------- */

  const hasBrands = brands.length > 0;
  const hasFeaturedProducts = featuredProducts.length > 0;

  return (
    <div className="flex-1">
      <HeroSection />

      {/* Brands */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Brands
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Trusted names in business networking
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              We stock equipment from the manufacturers your infrastructure
              already runs on.
            </p>
          </div>

          <div className="mt-10">
            {isLoadingBrands && <BrandsCarouselSkeleton />}

            {!isLoadingBrands && brandsError && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-6 text-center">
                <p className="text-sm font-medium text-rose-800">
                  {brandsError}
                </p>
              </div>
            )}

            {!isLoadingBrands && !brandsError && hasBrands && (
              <BrandsCarousel brands={brands} />
            )}

            {!isLoadingBrands && !brandsError && !hasBrands && (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <p className="text-sm font-medium text-slate-700">
                  No brands available.
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Check back soon — new brands are added regularly.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured products — unchanged */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                Featured
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Popular with our business customers
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                In-demand hardware, ready to ship to your site or integrator.
              </p>
            </div>
            <a
              href="/products"
              className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
            >
              Browse all products →
            </a>
          </div>

          <div className="mt-8">
            {isLoadingProducts && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </div>
            )}

            {!isLoadingProducts && productsError && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-6 text-center">
                <p className="text-sm font-medium text-rose-800">
                  {productsError}
                </p>
              </div>
            )}

            {!isLoadingProducts &&
              !productsError &&
              hasFeaturedProducts && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {featuredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              )}

            {!isLoadingProducts &&
              !productsError &&
              !hasFeaturedProducts && (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
                  <p className="text-sm font-semibold text-slate-900">
                    No featured products available
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Check back soon, or browse the full catalogue.
                  </p>
                </div>
              )}
          </div>
        </div>
      </section>

      <ValueProposition />
      <CallToAction />
    </div>
  );
}