"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Briefcase, Bookmark, ListChecks, TrendingUp, ArrowRight } from "lucide-react";
import { useAppData } from "@/components/AppDataProvider";
import { jobs } from "@/lib/mockData";
import { JobCard } from "@/components/JobCard";
import { LocationBar } from "@/components/LocationBar";
import { haversineDistanceKm } from "@/lib/distance";
import { computeMatchScore } from "@/lib/matching";
import { useState } from "react";
import { ApplyModal } from "@/components/ApplyModal";
import { Job } from "@/types";

export default function DashboardPage() {
  const { profile, location, savedJobIds, applications, toggleSaveJob, applyToJob } = useAppData();
  const [applyingJob, setApplyingJob] = useState<Job | null>(null);

  const recommended = useMemo(() => {
    return jobs
      .map((job) => {
        const distanceKm =
          location.latitude !== null && location.longitude !== null
            ? haversineDistanceKm(location.latitude, location.longitude, job.latitude, job.longitude)
            : null;
        return { job, distanceKm, matchPercent: computeMatchScore(job, profile) };
      })
      .sort((a, b) => b.matchPercent - a.matchPercent)
      .slice(0, 6);
  }, [location, profile]);

  const stats = [
    { label: "Saved jobs", value: savedJobIds.length, icon: Bookmark, href: "/saved" },
    { label: "Applications", value: applications.length, icon: ListChecks, href: "/applications" },
    {
      label: "In review / shortlisted",
      value: applications.filter((a) => a.status === "under_review" || a.status === "shortlisted").length,
      icon: TrendingUp,
      href: "/applications",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-ink-50">
            Welcome back{profile ? `, ${profile.fullName.split(" ")[0]}` : ""}
          </h1>
          <p className="text-sm text-ink-600 dark:text-ink-400">Here's what's happening with your job search.</p>
        </div>
        <LocationBar />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center gap-4 rounded-xl border border-ink-100 bg-white p-5 hover:border-brand-200 dark:border-ink-800 dark:bg-ink-900"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-ink-900 dark:text-ink-50">{value}</p>
              <p className="text-sm text-ink-600 dark:text-ink-400">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      {!profile?.resumeFileName && (
        <div className="mb-8 flex items-center justify-between rounded-xl border border-brand-100 bg-brand-50 p-4 dark:border-brand-900 dark:bg-brand-950">
          <div className="flex items-center gap-3">
            <Briefcase className="h-5 w-5 text-brand-600 dark:text-brand-400" />
            <p className="text-sm text-brand-800 dark:text-brand-300">
              Complete your profile and upload a resume to unlock one-click apply and better matches.
            </p>
          </div>
          <Link href="/profile" className="shrink-0 text-sm font-semibold text-brand-700 hover:underline dark:text-brand-300">
            Complete profile
          </Link>
        </div>
      )}

      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-ink-900 dark:text-ink-50">Recommended for you</h2>
        <Link href="/jobs" className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:underline dark:text-brand-400">
          See all jobs <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {recommended.map(({ job, distanceKm, matchPercent }) => (
          <JobCard
            key={job.id}
            job={job}
            distanceKm={distanceKm}
            matchPercent={matchPercent}
            isSaved={savedJobIds.includes(job.id)}
            isApplied={applications.some((a) => a.jobId === job.id)}
            onToggleSave={toggleSaveJob}
            onApply={setApplyingJob}
          />
        ))}
      </div>

      {applyingJob && (
        <ApplyModal
          job={applyingJob}
          profile={profile}
          onClose={() => setApplyingJob(null)}
          onConfirmed={(job, method) => applyToJob(job.id, method)}
        />
      )}
    </div>
  );
}
