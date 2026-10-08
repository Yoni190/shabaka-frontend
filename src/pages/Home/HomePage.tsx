import { useEffect, useState } from "react";
import HeroSection from "../../components/home/HeroSection";
import ValueProposition from "../../components/home/ValueProposition";
import CallToAction from "../../components/home/CallToAction";
import CategoryCard, {
  CategoryCardSkeleton,
} from "../../components/categories/CategoryCard";
import ProductCard, {
  ProductCardSkeleton,
} from "../../components/products/ProductCard";
import { getHomeCategories } from "../../api/categories";
import { getHomeProducts } from "../../api/products";
import type { Category, Product } from "../../types";

export default function HomePage() {
  /* ---------- Categories (API) ---------- */

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoadingCategories(true);
      setCategoriesError(null);
      try {
        const data = await getHomeCategories();
        if (!cancelled) setCategories(data);
      } catch {
        if (!cancelled) {
          setCategoriesError(
            "Unable to load categories. Please try again later.",
          );
        }
      } finally {
        if (!cancelled) setIsLoadingCategories(false);
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

  const hasCategories = categories.length > 0;
  const hasFeaturedProducts = featuredProducts.length > 0;

  return (
    <div className="flex-1">
      <HeroSection />

      {/* Categories */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                Categories
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Shop by category
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Everything needed to build, upgrade and maintain business
                networks.
              </p>
            </div>
            {/* <a
              href="/categories"
              className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
            >
              View all categories →
            </a> */}
          </div>

          <div className="mt-8">
            {isLoadingCategories && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-6">
                {Array.from({ length: 5 }).map((_, index) => (
                  <CategoryCardSkeleton key={index} />
                ))}
              </div>
            )}

            {!isLoadingCategories && categoriesError && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-6 text-center">
                <p className="text-sm font-medium text-rose-800">
                  {categoriesError}
                </p>
              </div>
            )}

            {!isLoadingCategories &&
              !categoriesError &&
              hasCategories && (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-6">
                  {categories.map((category) => (
                    <CategoryCard key={category.id} category={category} />
                  ))}
                </div>
              )}

            {!isLoadingCategories &&
              !categoriesError &&
              !hasCategories && (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
                  <p className="text-sm font-medium text-slate-700">
                    No categories available.
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Check back soon — new categories are added regularly.
                  </p>
                </div>
              )}
          </div>
        </div>
      </section>

      {/* Featured products */}
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