import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

interface NavbarProps {
  cartCount?: number;
}

const navLinks = [
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/categories" },
];

const accountLinks = [
  { label: "Account", href: "/account" },
  { label: "My Orders", href: "/account/orders" },
  { label: "Quotes", href: "/account/quotes" },
];

export default function Navbar({ cartCount = 0 }: NavbarProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const closeMenus = () => {
    setIsMobileMenuOpen(false);
    setIsAccountMenuOpen(false);
  };

  const handleLogout = async () => {
    closeMenus();
    await logout();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      {/* Utility bar */}
      <div className="hidden bg-slate-900 md:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs text-slate-300 sm:px-6 lg:px-8">
          <p>Business accounts · Volume pricing · Net 30 terms</p>
          <p className="hidden lg:block">
            support@shabaka.example · +966 555 010 2030
          </p>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="/" className="flex shrink-0 items-center gap-2" onClick={closeMenus}>
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
          <span className="text-lg font-semibold tracking-tight text-slate-900">
            Shabaka
          </span>
        </a>

        {/* Desktop links */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop search */}
        <form
          role="search"
          onSubmit={(event) => event.preventDefault()}
          className="hidden min-w-0 flex-1 md:block md:max-w-md"
        >
          <label htmlFor="navbar-search" className="sr-only">
            Search products
          </label>
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="navbar-search"
              type="search"
              placeholder="Search routers, switches, access points…"
              className="w-full rounded-lg border border-slate-300 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-2">
          {/* Cart */}
          <a
            href="/cart"
            className="relative rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <span className="sr-only">Cart</span>
            <CartIcon className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[11px] font-semibold text-white">
                {cartCount}
              </span>
            )}
          </a>

          {/* Desktop auth */}
          {isAuthenticated && user ? (
            <div className="relative hidden lg:block">
              <button
                type="button"
                onClick={() => setIsAccountMenuOpen((open) => !open)}
                aria-haspopup="menu"
                aria-expanded={isAccountMenuOpen}
                className="flex items-center gap-2 rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="max-w-[8rem] truncate">{user.name}</span>
                <ChevronDownIcon className="h-4 w-4 text-slate-400" />
              </button>

              {isAccountMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
                >
                  <div className="border-b border-slate-100 px-4 py-2.5">
                    <p className="truncate text-sm font-medium text-slate-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {user.role === "admin"
                        ? "Administrator"
                        : "Business customer"}
                    </p>
                  </div>

                  {accountLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      role="menuitem"
                      onClick={closeMenus}
                      className="block px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                    >
                      {link.label}
                    </a>
                  ))}

                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="block w-full border-t border-slate-100 px-4 py-2 text-left text-sm text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 lg:flex">
              <a
                href="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                Login
              </a>
              <a
                href="/register"
                className="rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Register
              </a>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((open) => !open)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
          >
            {isMobileMenuOpen ? (
              <CloseIcon className="h-5 w-5" />
            ) : (
              <MenuIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 pb-5 pt-4 sm:px-6 lg:hidden">
          <form
            role="search"
            onSubmit={(event) => event.preventDefault()}
            className="mb-4 md:hidden"
          >
            <label htmlFor="mobile-search" className="sr-only">
              Search products
            </label>
            <div className="relative">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="mobile-search"
                type="search"
                placeholder="Search products…"
                className="w-full rounded-lg border border-slate-300 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </form>

          <nav className="flex flex-col">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMenus}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="mt-4 border-t border-slate-200 pt-4">
            {isAuthenticated && user ? (
              <div className="flex flex-col gap-2">
                <div className="px-3 pb-2">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {user.name}
                  </p>
                  <p className="text-xs text-slate-500">Business customer</p>
                </div>

                {accountLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={closeMenus}
                    className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                  >
                    {link.label}
                  </a>
                ))}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <a
                  href="/login"
                  onClick={closeMenus}
                  className="rounded-lg border border-slate-300 px-3 py-2.5 text-center text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Login
                </a>
                <a
                  href="/register"
                  onClick={closeMenus}
                  className="rounded-lg bg-blue-600 px-3 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Register
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

/* ---------- Local icons ---------- */

interface IconProps {
  className?: string;
}

function SearchIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function CartIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
    </svg>
  );
}

function MenuIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}

function CloseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}