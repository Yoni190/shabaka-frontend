import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

/**
 * Shared shell for every page: Navbar on top, Footer on bottom,
 * and the matched child route rendered via <Outlet />.
 *
 * Change Navbar/Footer props here once and every page inherits it.
 */
export default function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar cartCount={0} />

      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}