import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "theme-dark");
  const location = useLocation();

  useEffect(() => {
    document.body.className = theme === "theme-light" ? "theme-light" : "";
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <Navbar theme={theme} onToggleTheme={() => setTheme((t) => (t === "theme-light" ? "theme-dark" : "theme-light"))} />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
