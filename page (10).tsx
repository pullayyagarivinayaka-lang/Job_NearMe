"use client";

import Link from "next/link";
import { ListChecks, ExternalLink } from "lucide-react";
import { useAppData } from "@/components/AppDataProvider";
import { jobs } from "@/lib/mockData";
import { ApplicationStatus } from "@/types";
import clsx from "clsx";

const statusConfig: Record<ApplicationStatus, { label: string; className: string }> = {
  redirected: {
    label: "In progress (external)",
    className: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  },
  applied: {
    label: "Applied",
    className: "bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300",
  },
  under_review: {
    label: "Under review",
    className: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  },
  shortlisted: {
    label: "Shortlisted",
    className: "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  },
  interview: {
    label: "Interview",
    className: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
  },
  offer: {
    label: "Offer received",
    className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  },
  rejected: {
    label: "Not selected",
    className: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-400",
  },
};

export default function ApplicationsPage() {
  const { applications, updateApplicationStatus } = useAppData();

  const rows = applications
    .map((app) => ({ app, job: jobs.find((j) => j.id === app.jobId) }))
    .filter((r) => r.job)
    .sort((a, b) => new Date(b.app.appliedDate).getTime() - new Date(a.app.appliedDate).getTime());

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      <h1 className="mb-1 font-display text-2xl font-bold text-ink-900 dark:text-ink-50">Applications</h1>
      <p className="mb-6 text-sm text-ink-600 dark:text-ink-400">
        Track every application you've started, whether submitted instantly or through an external portal.
      </p>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-ink-200 py-20 text-center dark:border-ink-700">
          <ListChecks className="h-8 w-8 text-ink-300" />
          <p className="font-medium text-ink-700 dark:text-ink-100">No applications yet</p>
          <Link href="/jobs" className="mt-1 text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400">
            Find jobs to apply to
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {rows.map(({ app, job }) => (
            <div
              key={app.id}
              className="flex flex-col gap-3 rounded-xl border border-ink-100 bg-white p-4 dark:border-ink-800 dark:bg-ink-900 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <Link href={`/jobs/${job!.id}`} className="font-semibold text-ink-900 hover:text-brand-600 dark:text-ink-50 dark:hover:text-brand-400">
                  {job!.title}
                </Link>
                <p className="text-sm text-ink-600 dark:text-ink-400">{job!.company}</p>
                <p className="mt-1 text-xs text-ink-400">
                  {app.method === "one-click" ? "One-click apply" : "External portal"} · Started{" "}
                  {new Date(app.appliedDate).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {app.status === "redirected" && (
                  <button
                    onClick={() => updateApplicationStatus(app.id, "applied")}
                    className="flex items-center gap-1 rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-medium text-ink-700 hover:bg-ink-50 dark:border-ink-700 dark:text-ink-100 dark:hover:bg-ink-800"
                    title="Confirm you completed the application on the employer's site"
                  >
                    Mark as completed
                  </button>
                )}
                {job!.applyMethod === "external" && job!.externalApplyUrl && (
                  <a
                    href={job!.externalApplyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-medium text-ink-700 hover:bg-ink-50 dark:border-ink-700 dark:text-ink-100 dark:hover:bg-ink-800"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Portal
                  </a>
                )}
                <label className="sr-only" htmlFor={`status-${app.id}`}>
                  Update status
                </label>
                <select
                  id={`status-${app.id}`}
                  value={app.status}
                  onChange={(e) => updateApplicationStatus(app.id, e.target.value as ApplicationStatus)}
                  className={clsx(
                    "rounded-full border-0 px-3 py-1.5 text-xs font-semibold",
                    statusConfig[app.status].className
                  )}
                >
                  {Object.entries(statusConfig).map(([key, cfg]) => (
                    <option key={key} value={key}>
                      {cfg.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
