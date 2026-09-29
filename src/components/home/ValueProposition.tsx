const benefits = [
  {
    title: "Business-focused pricing",
    description:
      "Volume tiers and contract pricing on the hardware you buy most, with tailored quotes for larger rollouts.",
    path: "M12 1v23M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  },
  {
    title: "Reliable networking equipment",
    description:
      "Enterprise-grade routers, switches, access points and firewalls from manufacturers your IT team already knows.",
    path: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  },
  {
    title: "Convenient purchasing",
    description:
      "Search by brand, specification or SKU, build a cart and check out in minutes — no back-and-forth emails.",
    path: "M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM20 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
  },
  {
    title: "Business invoices",
    description:
      "Proper invoices with your company details, VAT/tax information and purchase order references for your records.",
    path: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  },
  {
    title: "Easy order management",
    description:
      "Track order status, review purchase history and reorder frequently bought items from your account.",
    path: "M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
  },
];

export default function ValueProposition() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            Why businesses buy from us
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Built for procurement, not just checkout
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            We supply networking hardware to IT teams, integrators and growing
            businesses — with the pricing and paperwork that come with it.
          </p>
        </div>

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <li
              key={benefit.title}
              className="rounded-xl border border-slate-200 bg-slate-50/60 p-6"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600">
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
                  <path d={benefit.path} />
                </svg>
              </span>
              <h3 className="mt-4 text-sm font-semibold text-slate-900">
                {benefit.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {benefit.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}