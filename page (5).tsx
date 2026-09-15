"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Moon, Sun, Bell, MapPin, LogOut, Trash2 } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useAppData } from "@/components/AppDataProvider";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, logout, location } = useAppData();
  const router = useRouter();
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [jobDigest, setJobDigest] = useState(true);

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="mb-3 text-ink-700 dark:text-ink-100">Log in to manage your settings.</p>
        <button
          onClick={() => router.push("/login")}
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
        >
          Go to login
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
      <h1 className="mb-6 font-display text-2xl font-bold text-ink-900 dark:text-ink-50">Settings</h1>

      <div className="flex flex-col gap-6">
        <section className="rounded-xl border border-ink-100 bg-white p-5 dark:border-ink-800 dark:bg-ink-900">
          <h2 className="mb-3 font-display text-base font-semibold text-ink-900 dark:text-ink-50">Appearance</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-ink-700 dark:text-ink-100">
              {theme === "light" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              Dark mode
            </div>
            <ToggleSwitch checked={theme === "dark"} onChange={toggleTheme} label="Toggle dark mode" />
          </div>
        </section>

        <section className="rounded-xl border border-ink-100 bg-white p-5 dark:border-ink-800 dark:bg-ink-900">
          <h2 className="mb-3 font-display text-base font-semibold text-ink-900 dark:text-ink-50">Notifications</h2>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2 text-sm text-ink-700 dark:text-ink-100">
              <Bell className="h-4 w-4" /> Email me about application status updates
            </div>
            <ToggleSwitch checked={emailAlerts} onChange={() => setEmailAlerts((v) => !v)} label="Toggle application email alerts" />
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2 text-sm text-ink-700 dark:text-ink-100">
              <Bell className="h-4 w-4" /> Weekly digest of new matching jobs
            </div>
            <ToggleSwitch checked={jobDigest} onChange={() => setJobDigest((v) => !v)} label="Toggle weekly job digest" />
          </div>
        </section>

        <section className="rounded-xl border border-ink-100 bg-white p-5 dark:border-ink-800 dark:bg-ink-900">
          <h2 className="mb-3 font-display text-base font-semibold text-ink-900 dark:text-ink-50">Location</h2>
          <div className="flex items-center justify-between text-sm text-ink-700 dark:text-ink-100">
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Current search location
            </span>
            <span className="font-medium">{location.label}</span>
          </div>
          <p className="mt-2 text-xs text-ink-400">
            Change this any time from the location picker on the Jobs or Dashboard page.
          </p>
        </section>

        <section className="rounded-xl border border-rose-100 bg-rose-50/40 p-5 dark:border-rose-900 dark:bg-rose-950/20">
          <h2 className="mb-3 font-display text-base font-semibold text-rose-700 dark:text-rose-400">Account</h2>
          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="mb-2 flex w-full items-center gap-2 rounded-lg border border-ink-200 px-4 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50 dark:border-ink-700 dark:text-ink-100 dark:hover:bg-ink-800"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
          <button className="flex w-full items-center gap-2 rounded-lg border border-rose-200 px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-400 dark:hover:bg-rose-950">
            <Trash2 className="h-4 w-4" /> Delete account
          </button>
        </section>
      </div>
    </div>
  );
}

function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative h-6 w-11 rounded-full transition-colors ${
        checked ? "bg-brand-500" : "bg-ink-200 dark:bg-ink-700"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
