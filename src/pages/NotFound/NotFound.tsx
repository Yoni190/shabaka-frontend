export default function NotFoundPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
          Error 404
        </p>

        <h1 className="mt-3 text-6xl font-bold tracking-tight text-slate-900 sm:text-7xl">
          Page not found
        </h1>

        <p className="mt-5 text-base leading-7 text-slate-600">
          The page you're looking for doesn't exist, was moved, or the link
          may be broken. Let's get you back to the equipment.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Back to Home
          </a>
          <a
            href="/products"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Browse Products
          </a>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6">
          <p className="text-sm text-slate-500">
            Need help finding something?{" "}
            <a
              href="/contact"
              className="font-semibold text-blue-600 transition hover:text-blue-700"
            >
              Contact our team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}