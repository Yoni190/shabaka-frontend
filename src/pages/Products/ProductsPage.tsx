import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCard, {
  ProductCardSkeleton,
} from "../../components/products/ProductCard";
import { getProducts } from "../../api/products";
import { getCategories } from "../../api/categories";
import { useDebounce } from "../../hooks/useDebounce";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import type {
  Category,
  Product,
  ProductPaginationMeta,
} from "../../types";

type SortOption =
  | "created_at:desc"
  | "created_at:asc"
  | "name:asc"
  | "name:desc"
  | "price:asc"
  | "price:desc";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "created_at:desc", label: "Newest first" },
  { value: "created_at:asc", label: "Oldest first" },
  { value: "name:asc", label: "Name: A → Z" },
  { value: "name:desc", label: "Name: Z → A" },
  { value: "price:asc", label: "Price: low to high" },
  { value: "price:desc", label: "Price: high to low" },
];

function parseSort(value: SortOption): {
  sort: "name" | "price" | "created_at";
  direction: "asc" | "desc";
} {
  const [sort, direction] = value.split(":") as [
    "name" | "price" | "created_at",
    "asc" | "desc",
  ];
  return { sort, direction };
}

export default function ProductsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { addItem, isAddingProductId } = useCart();

  /* ---------- Catalogue state ---------- */

  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<ProductPaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ---------- Query state ---------- */

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 350);
  const [categoryId, setCategoryId] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("created_at:desc");
  const [page, setPage] = useState(1);

  /* ---------- Category filter options ---------- */

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setIsLoadingCategories(true);
      try {
        const response = await getCategories({ per_page: 100 });
        if (!cancelled) setCategories(response.data);
      } catch {
        // Non-fatal: filter just shows no options.
      } finally {
        if (!cancelled) setIsLoadingCategories(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  /* ---------- Fetch products ---------- */

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { sort, direction } = parseSort(sortOption);
      const response = await getProducts({
        page,
        search: debouncedSearch || undefined,
        category_id: categoryId || undefined,
        sort,
        direction,
      });

      if (response.data.length === 0 && response.meta.current_page > 1) {
        setPage(response.meta.current_page - 1);
        return;
      }

      setProducts(response.data);
      setMeta(response.meta);
    } catch {
      setError("Unable to load products. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [page, debouncedSearch, categoryId, sortOption]);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, categoryId, sortOption]);

  /* ---------- Add to cart ---------- */

  const handleAddToCart = async (product: Product) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    try {
      await addItem(product.id, 1);
    } catch {
      // The cart context already surfaces a toast on failure.
    }
  };

  /* ---------- Render ---------- */

  const isEmpty = !isLoading && !error && products.length === 0;
  const hasActiveFilters =
    debouncedSearch.trim().length > 0 || categoryId !== "";

  return (
    <div className="flex-1">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
          Catalogue
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Products
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Networking hardware for your business.
        </p>

        {/* Toolbar */}
        <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_200px_200px]">
          {/* Search */}
          <div className="relative">
            <label htmlFor="product-search" className="sr-only">
              Search products
            </label>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input
              id="product-search"
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by name or SKU…"
              className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Category filter */}
          <div>
            <label htmlFor="product-category" className="sr-only">
              Filter by category
            </label>
            <select
              id="product-category"
              value={categoryId}
              disabled={isLoadingCategories}
              onChange={(event) => setCategoryId(event.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
            >
              <option value="">
                {isLoadingCategories ? "Loading…" : "All categories"}
              </option>
              {categories.map((category) => (
                <option key={category.id} value={String(category.id)}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label htmlFor="product-sort" className="sr-only">
              Sort products
            </label>
            <select
              id="product-sort"
              value={sortOption}
              onChange={(event) =>
                setSortOption(event.target.value as SortOption)
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {meta && !isLoading && (
          <p className="mt-4 text-xs text-slate-500">
            {meta.total} {meta.total === 1 ? "product" : "products"}
          </p>
        )}

        {/* Body */}
        <div className="mt-6">
          {isLoading && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </div>
          )}

          {!isLoading && error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-8 text-center">
              <p className="text-sm font-semibold text-rose-800">
                Couldn't load products
              </p>
              <p className="mx-auto mt-1 max-w-md text-sm text-rose-700">
                {error}
              </p>
              <button
                type="button"
                onClick={fetchProducts}
                className="mt-5 inline-flex items-center justify-center rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                Try again
              </button>
            </div>
          )}

          {!isLoading && !error && isEmpty && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="text-sm font-semibold text-slate-900">
                {hasActiveFilters
                  ? "No products match your filters"
                  : "No products available"}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {hasActiveFilters
                  ? "Try changing your search or category filter."
                  : "Check back soon — new products are added regularly."}
              </p>
            </div>
          )}

          {!isLoading && !error && products.length > 0 && (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    isAdding={isAddingProductId === product.id}
                  />
                ))}
              </div>

              {meta && meta.last_page > 1 && (
                <div className="mt-8 flex flex-col items-center justify-between gap-3 sm:flex-row">
                  <p className="text-xs text-slate-500">
                    Showing {meta.from ?? 0}–{meta.to ?? 0} of {meta.total}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={meta.current_page <= 1}
                      onClick={() => setPage(meta.current_page - 1)}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="text-xs text-slate-600">
                      Page {meta.current_page} of {meta.last_page}
                    </span>
                    <button
                      type="button"
                      disabled={meta.current_page >= meta.last_page}
                      onClick={() => setPage(meta.current_page + 1)}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}