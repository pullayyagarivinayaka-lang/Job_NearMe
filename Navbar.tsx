"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Briefcase,
  LayoutDashboard,
  Search,
  Bookmark,
  ListChecks,
  UserCircle,
  Settings,
  Moon,
  Sun,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useAppData } from "./AppDataProvider";
import clsx from "clsx";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/jobs", label: "Jobs", icon: Search },
  { href: "/saved", label: "Saved", icon: Bookmark },
  { href: "/applications", label: "Applications", icon: ListChecks },
  { href: "/profile", label: "Profile", icon: UserCircle },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAppData();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname === "/login" || pathname === "/register" || pathname === "/") {
    return (
      <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/90 backdrop-blur dark:border-ink-800 dark:bg-ink-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-bold text-brand-600 dark:text-brand-400">
            <Briefcase className="h-6 w-6" aria-hidden />
            JobNearMe
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/about"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-ink-600 hover:bg-ink-50 dark:text-ink-100 dark:hover:bg-ink-800 sm:block"
            >
              About
            </Link>
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="rounded-full p-2 text-ink-600 hover:bg-ink-50 dark:text-ink-100 dark:hover:bg-ink-800"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            {pathname !== "/login" && (
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-brand-600 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-ink-800"
              >
                Log in
              </Link>
            )}
            {pathname !== "/register" && (
              <Link
                href="/register"
                className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
              >
                Sign up
              </Link>
            )}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/90 backdrop-blur dark:border-ink-800 dark:bg-ink-950/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-display text-lg font-bold text-brand-600 dark:text-brand-400">
            <Briefcase className="h-6 w-6" aria-hidden />
            <span className="hidden sm:inline">JobNearMe</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname.startsWith(href)
                    ? "bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300"
                    : "text-ink-600 hover:bg-ink-50 dark:text-ink-100 dark:hover:bg-ink-800"
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="rounded-full p-2 text-ink-600 hover:bg-ink-50 dark:text-ink-100 dark:hover:bg-ink-800"
          >
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>
          {isAuthenticated && (
            <button
              onClick={logout}
              className="hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-600 hover:bg-ink-50 dark:text-ink-100 dark:hover:bg-ink-800 md:flex"
            >
              <LogOut className="h-4 w-4" aria-hidden />
              Log out
            </button>
          )}
          <button
            className="rounded-lg p-2 text-ink-600 hover:bg-ink-50 dark:text-ink-100 dark:hover:bg-ink-800 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="border-t border-ink-100 bg-white px-4 py-2 dark:border-ink-800 dark:bg-ink-950 md:hidden" aria-label="Primary mobile">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={clsx(
                "flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium",
                pathname.startsWith(href)
                  ? "bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300"
                  : "text-ink-600 dark:text-ink-100"
              )}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {label}
            </Link>
          ))}
          <button
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-3 text-left text-sm font-medium text-ink-600 dark:text-ink-100"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            Log out
          </button>
        </nav>
      )}
    </header>
  );
}
