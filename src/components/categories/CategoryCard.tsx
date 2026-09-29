import type { Category } from "../../types";
import ImageWithFallback from "../ui/ImageWithFallback";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <a
      href={`/products?category=${category.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-blue-300 hover:shadow-md"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <ImageWithFallback
          src={category.image}
          alt={category.name}
          label={category.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600">
          {category.name}
        </h3>
        <p className="mt-1 flex-1 text-xs leading-5 text-slate-500">
          {category.description}
        </p>
        <span className="mt-3 text-xs font-semibold text-blue-600">
          {category.productCount} products
        </span>
      </div>
    </a>
  );
}