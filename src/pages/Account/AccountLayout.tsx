import { Outlet } from "react-router-dom";
import AccountSidebar from "../../components/account/AccountSidebar";

export default function AccountLayout() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
          Business account
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          My Account
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Manage your profile, addresses, orders, and account security.
        </p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        <AccountSidebar className="lg:sticky lg:top-24 lg:self-start" />
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}