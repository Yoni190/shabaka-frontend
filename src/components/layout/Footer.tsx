const footerSections = [
  {
    title: "Products",
    links: [
      { label: "Routers", href: "/products?category=routers" },
      { label: "Network Switches", href: "/products?category=switches" },
      { label: "Access Points", href: "/products?category=access-points" },
      { label: "Firewalls", href: "/products?category=firewalls" },
      { label: "Accessories", href: "/products?category=accessories" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Business Accounts", href: "/register" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Shipping & Returns", href: "/shipping" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-900 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
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
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                  <path d="M10 6.5h4a3 3 0 0 1 3 3V14" />
                </svg>
              </span>
              <span className="text-lg font-semibold tracking-tight text-white">
                Shabaka
              </span>
            </div>

            <p className="mt-4 max-w-xs text-sm leading-6">
              Networking equipment for businesses. Routers, switches, access
              points and firewalls with volume pricing and business invoicing.
            </p>

            <div className="mt-5 space-y-1 text-sm">
              <p>support@shabaka.example</p>
              <p>+966 555 010 2030</p>
            </div>
          </div>

          {/* Link columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-white">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-sm transition hover:text-white"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-slate-800 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Shabaka. All rights reserved.</p>
          <p>Prices shown include tax.</p>
        </div>
      </div>
    </footer>
  );
}