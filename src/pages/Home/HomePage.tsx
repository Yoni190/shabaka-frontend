import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import HeroSection from "../../components/home/HeroSection";
import ValueProposition from "../../components/home/ValueProposition";
import CallToAction from "../../components/home/CallToAction";
import CategoryCard from "../../components/categories/CategoryCard";
import ProductCard, {
  ProductCardSkeleton,
} from "../../components/products/ProductCard";
import { mockCategories, mockFeaturedProducts } from "../../data/mockData";
import type { Product } from "../../types";


export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    // Placeholder for: GET /api/products?featured=1
    const timer = window.setTimeout(() => {
      setFeaturedProducts(mockFeaturedProducts);
      setIsLoadingProducts(false);
    }, 300);

    return () => window.clearTimeout(timer);
  }, []);

  const handleAddToCart = (product: Product) => {
    // Cart is not implemented yet — will call the cart API/context later.
    console.info("Add to cart:", product.id);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar cartCount={0} />

      <main className="flex-1">
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
              <a
                href="/categories"
                className="text-sm font-semibold text-blue-600 transition hover:text-blue-700"
              >
                View all categories →
              </a>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 lg:gap-6">
              {mockCategories.map((category) => (
                <CategoryCard key={category.id} category={category} />
              ))}
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
              {isLoadingProducts ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <ProductCardSkeleton key={index} />
                  ))}
                </div>
              ) : featuredProducts.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
                  <p className="text-sm font-semibold text-slate-900">
                    No featured products available
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    Check back soon, or browse the full catalogue.
                  </p>
                </div>
              ) : (
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
            </div>
          </div>
        </section>

        <ValueProposition />
        <CallToAction />
      </main>

      <Footer />
    </div>
  );
}