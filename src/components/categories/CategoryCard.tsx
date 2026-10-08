import type { Category } from "../../types";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <a
      href={`/products?category=${category.id}`}
      className="group flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white p-5 text-center transition hover:border-blue-300 hover:shadow-md"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition group-hover:bg-blue-100">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      </span>
      <span className="text-sm font-semibold text-slate-900 transition group-hover:text-blue-600">
        {category.name}
      </span>
    </a>
  );
}

/** Placeholder shown while categories are loading. */
export function CategoryCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-5">
      <div className="mx-auto h-12 w-12 rounded-lg bg-slate-100" />
      <div className="mx-auto mt-3 h-3 w-20 rounded bg-slate-100" />
    </div>
  );
}