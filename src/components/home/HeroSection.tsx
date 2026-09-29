const orderLines = [
  { name: "24-Port Gigabit PoE Switch", meta: "6 units · Cisco", price: "SAR 3,480.00" },
  { name: "Wi-Fi 6 Access Point", meta: "4 units · Ubiquiti", price: "SAR 756.00" },
  { name: "Rackmount Firewall", meta: "2 units · Fortinet", price: "SAR 1,225.00" },
];

const stats = [
  { label: "SKUs in catalogue", value: "5,000+" },
  { label: "Dispatch", value: "Same day" },
  { label: "Payment terms", value: "Net 30" },
];

export default function HeroSection() {
  return (
    <section className="bg-slate-900 text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-300">
            Networking equipment for business
          </span>

          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Equip your business network with hardware you can trust
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-slate-300">
            Routers, switches, access points and firewalls from the brands your
            infrastructure already runs on. Volume pricing, business invoicing
            and straightforward order management — all in one place.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="/products"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Browse Products
            </a>
            <a
              href="/register"
              className="inline-flex items-center justify-center rounded-lg border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Register Your Business
            </a>
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-6 sm:gap-6">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-xs text-slate-400">{stat.label}</dt>
                <dd className="mt-1 text-base font-semibold text-white sm:text-lg">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Decorative order-summary panel */}
        <div className="mx-auto w-full max-w-md lg:max-w-none">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <p className="text-sm font-medium text-white">Order summary</p>
              <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-medium text-emerald-300">
                Net 30 approved
              </span>
            </div>

            <ul className="divide-y divide-white/5">
              {orderLines.map((line) => (
                <li
                  key={line.name}
                  className="flex items-center justify-between gap-4 py-3.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">
                      {line.name}
                    </p>
                    <p className="text-xs text-slate-400">{line.meta}</p>
                  </div>
                  <span className="shrink-0 text-sm font-medium text-slate-200">
                    {line.price}
                  </span>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <span className="text-sm text-slate-300">Subtotal (12 units)</span>
              <span className="text-base font-semibold text-white">
                SAR 5,461.00
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}