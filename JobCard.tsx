"use client";

import Link from "next/link";
import Image from "next/image";
import { Job } from "@/types";
import { formatDistance } from "@/lib/distance";
import { Bookmark, BookmarkCheck, MapPin, Clock, GraduationCap, Briefcase, ExternalLink, Zap } from "lucide-react";
import clsx from "clsx";

interface JobCardProps {
  job: Job;
  distanceKm: number | null;
  matchPercent: number;
  isSaved: boolean;
  isApplied: boolean;
  onToggleSave: (jobId: string) => void;
  onApply: (job: Job) => void;
}

function formatSalary(min: number, max: number, period: "month" | "year") {
  const fmt = (n: number) =>
    n >= 100000 ? `${(n / 100000).toFixed(1)}L` : `${Math.round(n / 1000)}K`;
  return `₹${fmt(min)} - ₹${fmt(max)} / ${period}`;
}

function daysUntil(deadline: string) {
  const diff = Math.ceil(
    (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  if (diff < 0) return "Closed";
  if (diff === 0) return "Closes today";
  return `${diff} day${diff === 1 ? "" : "s"} left`;
}

function timeAgo(dateStr: string) {
  const diff = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diff === 0) return "Posted today";
  if (diff === 1) return "Posted yesterday";
  return `Posted ${diff} days ago`;
}

export function JobCard({
  job,
  distanceKm,
  matchPercent,
  isSaved,
  isApplied,
  onToggleSave,
  onApply,
}: JobCardProps) {
  const matchColor =
    matchPercent >= 75
      ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400"
      : matchPercent >= 50
      ? "text-brand-600 bg-brand-50 dark:bg-brand-950 dark:text-brand-400"
      : "text-ink-600 bg-ink-50 dark:bg-ink-800 dark:text-ink-100";

  return (
    <article className="group flex flex-col gap-3 rounded-xl border border-ink-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-ink-800 dark:bg-ink-900 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-ink-50 dark:bg-ink-800">
            {job.companyLogo ? (
              <Image
                src={job.companyLogo}
                alt={`${job.company} logo`}
                width={44}
                height={44}
                className="object-contain"
              />
            ) : (
              <Briefcase className="h-5 w-5 text-ink-400" aria-hidden />
            )}
          </div>
          <div className="min-w-0">
            <Link
              href={`/jobs/${job.id}`}
              className="block truncate font-display text-base font-semibold text-ink-900 hover:text-brand-600 dark:text-ink-50 dark:hover:text-brand-400"
            >
              {job.title}
            </Link>
            <p className="truncate text-sm text-ink-600 dark:text-ink-400">{job.company}</p>
          </div>
        </div>
        <span
          className={clsx("shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold", matchColor)}
          title="How closely this job matches your profile"
        >
          {matchPercent}% match
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-ink-600 dark:text-ink-400">
        <span className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" aria-hidden />
          {job.location}
          {distanceKm !== null && <span className="text-ink-400"> · {formatDistance(distanceKm)}</span>}
        </span>
        <span className="flex items-center gap-1">
          <GraduationCap className="h-3.5 w-3.5" aria-hidden />
          {job.education}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <span className="rounded-md bg-ink-50 px-2 py-1 text-xs font-medium capitalize text-ink-700 dark:bg-ink-800 dark:text-ink-100">
          {job.jobType}
        </span>
        <span className="rounded-md bg-ink-50 px-2 py-1 text-xs font-medium capitalize text-ink-700 dark:bg-ink-800 dark:text-ink-100">
          {job.workMode}
        </span>
        <span className="rounded-md bg-ink-50 px-2 py-1 text-xs font-medium text-ink-700 dark:bg-ink-800 dark:text-ink-100">
          {job.experience}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-ink-900 dark:text-ink-50">
          {formatSalary(job.salaryMin, job.salaryMax, job.salaryPeriod)}
        </span>
        <span className="flex items-center gap-1 text-xs text-ink-400">
          <Clock className="h-3.5 w-3.5" aria-hidden />
          {timeAgo(job.postedDate)} · {daysUntil(job.deadline)}
        </span>
      </div>

      <div className="mt-1 flex items-center gap-2 border-t border-ink-100 pt-3 dark:border-ink-800">
        <button
          onClick={() => onToggleSave(job.id)}
          aria-pressed={isSaved}
          aria-label={isSaved ? "Remove from saved jobs" : "Save job"}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-ink-200 px-3 py-2 text-sm font-medium text-ink-700 hover:bg-ink-50 dark:border-ink-700 dark:text-ink-100 dark:hover:bg-ink-800"
        >
          {isSaved ? <BookmarkCheck className="h-4 w-4 text-brand-500" /> : <Bookmark className="h-4 w-4" />}
          <span className="hidden sm:inline">{isSaved ? "Saved" : "Save"}</span>
        </button>
        <button
          onClick={() => onApply(job)}
          disabled={isApplied}
          className={clsx(
            "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
            isApplied
              ? "cursor-not-allowed bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400"
              : "bg-brand-500 text-white hover:bg-brand-600"
          )}
        >
          {isApplied ? (
            "Applied"
          ) : job.applyMethod === "one-click" ? (
            <>
              <Zap className="h-4 w-4" aria-hidden /> Apply Now
            </>
          ) : (
            <>
              <ExternalLink className="h-4 w-4" aria-hidden /> Apply Now
            </>
          )}
        </button>
      </div>
    </article>
  );
}
