import type { ComponentType } from "react";
import { NavLink } from "react-router-dom";

interface AccountSidebarProps {
  className?: string;
}

interface NavItem {
  to: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  end?: boolean;
}

const navItems: NavItem[] = [
  { to: "/account", label: "Overview", icon: OverviewIcon, end: true },
  { to: "/account/details", label: "Account Details", icon: UserIcon },
  { to: "/account/addresses", label: "Addresses", icon: AddressIcon },
  { to: "/account/orders", label: "Orders", icon: OrdersIcon },
  { to: "/account/security", label: "Security", icon: ShieldIcon },
];

export default function AccountSidebar({ className }: AccountSidebarProps) {
  return (
    <nav
      aria-label="Account sections"
      className={className}
    >
      <ul
        className="
          -mx-4 flex gap-1 overflow-x-auto px-4 pb-2
          sm:-mx-6 sm:px-6
          lg:mx-0 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-0 lg:pb-0
        "
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.to} className="shrink-0 lg:shrink">
              <NavLink
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ---------- Icons ---------- */

interface IconProps {
  className?: string;
}

function iconProps(className?: string) {
  return {
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true as const,
  };
}

function OverviewIcon({ className }: IconProps) {
  return (
    <svg {...iconProps(className)}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  );
}

function UserIcon({ className }: IconProps) {
  return (
    <svg {...iconProps(className)}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function AddressIcon({ className }: IconProps) {
  return (
    <svg {...iconProps(className)}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function OrdersIcon({ className }: IconProps) {
  return (
    <svg {...iconProps(className)}>
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function ShieldIcon({ className }: IconProps) {
  return (
    <svg {...iconProps(className)}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}