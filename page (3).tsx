import Link from "next/link";
import { MapPin, Zap, ShieldCheck, Search, ArrowRight } from "lucide-react";
import { categoryLabels } from "@/lib/mockData";

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white dark:from-ink-900 dark:to-ink-950">
        <div className="mx-auto flex max-w-5xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28">
          <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-medium text-brand-700 dark:border-brand-800 dark:bg-ink-900 dark:text-brand-300">
            <MapPin className="h-3.5 w-3.5" /> Built for students &amp; job seekers across India
          </span>
          <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight text-ink-900 dark:text-ink-50 sm:text-5xl md:text-6xl">
            Find the right job. Near you. Apply in one click.
          </h1>
          <p className="mt-5 max-w-xl text-base text-ink-600 dark:text-ink-400 sm:text-lg">
            Build your profile once, discover roles near your location, and let JobNearMe
            handle the busywork of applying — for undergrads, freshers, interns and experienced
            professionals alike.
          </p>
          <p className="mt-2 max-w-xl text-sm font-medium text-brand-700 dark:text-brand-400">
            Distance is shown for your convenience only — every job is open to applicants from
            any city, with no location-based eligibility restriction.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className="flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-600"
            >
              Get started free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/jobs"
              className="flex items-center justify-center gap-2 rounded-lg border border-ink-200 bg-white px-6 py-3 text-sm font-semibold text-ink-700 hover:bg-ink-50 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100 dark:hover:bg-ink-800"
            >
              Browse jobs
            </Link>
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-3">
          <Feature
            icon={<MapPin className="h-5 w-5" />}
            title="Location-aware search"
            description="Use GPS or pick a city manually to see roles ranked by real distance, not guesswork."
          />
          <Feature
            icon={<Zap className="h-5 w-5" />}
            title="One-click apply"
            description="Save your profile and resume once. Apply to supported jobs instantly, no repeated forms."
          />
          <Feature
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Honest tracking"
            description="We only mark a job 'Applied' when it's actually submitted — external portals are tracked as in progress."
          />
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <h2 className="mb-5 font-display text-xl font-semibold text-ink-900 dark:text-ink-50">
          Explore by category
        </h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(categoryLabels).map(([key, label]) => (
            <Link
              key={key}
              href={`/jobs?category=${key}`}
              className="rounded-full border border-ink-200 bg-white px-4 py-2 text-sm font-medium text-ink-700 hover:border-brand-300 hover:text-brand-700 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100 dark:hover:text-brand-400"
            >
              {label}
            </Link>
          ))}
        </div>
        <div className="mt-8 flex items-center gap-2 text-sm text-ink-400">
          <Search className="h-4 w-4" />
          <span>Try searching "Frontend Developer Intern" or "Data Analyst" once you're in.</span>
        </div>
      </section>
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-ink-100 bg-white p-5 dark:border-ink-800 dark:bg-ink-900">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
        {icon}
      </div>
      <h3 className="mb-1 font-display text-base font-semibold text-ink-900 dark:text-ink-50">{title}</h3>
      <p className="text-sm text-ink-600 dark:text-ink-400">{description}</p>
    </div>
  );
}
