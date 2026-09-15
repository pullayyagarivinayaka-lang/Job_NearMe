"use client";

import { useMemo, useState } from "react";
import { Bookmark } from "lucide-react";
import Link from "next/link";
import { useAppData } from "@/components/AppDataProvider";
import { jobs } from "@/lib/mockData";
import { JobCard } from "@/components/JobCard";
import { haversineDistanceKm } from "@/lib/distance";
import { computeMatchScore } from "@/lib/matching";
import { ApplyModal } from "@/components/ApplyModal";
import { Job } from "@/types";

export default function SavedJobsPage() {
  const { profile, location, savedJobIds, applications, toggleSaveJob, applyToJob } = useAppData();
  const [applyingJob, setApplyingJob] = useState<Job | null>(null);

  const savedJobs = useMemo(
    () =>
      jobs
        .filter((j) => savedJobIds.includes(j.id))
        .map((job) => {
          const distanceKm =
            location.latitude !== null && location.longitude !== null
              ? haversineDistanceKm(location.latitude, location.longitude, job.latitude, job.longitude)
              : null;
          return { job, distanceKm, matchPercent: computeMatchScore(job, profile) };
        }),
    [savedJobIds, location, profile]
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <h1 className="mb-1 font-display text-2xl font-bold text-ink-900 dark:text-ink-50">Saved jobs</h1>
      <p className="mb-6 text-sm text-ink-600 dark:text-ink-400">
        {savedJobs.length} job{savedJobs.length === 1 ? "" : "s"} saved for later
      </p>

      {savedJobs.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-ink-200 py-20 text-center dark:border-ink-700">
          <Bookmark className="h-8 w-8 text-ink-300" />
          <p className="font-medium text-ink-700 dark:text-ink-100">No saved jobs yet</p>
          <p className="mb-3 text-sm text-ink-400">Tap the save icon on any job to keep it here.</p>
          <Link href="/jobs" className="text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400">
            Browse jobs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {savedJobs.map(({ job, distanceKm, matchPercent }) => (
            <JobCard
              key={job.id}
              job={job}
              distanceKm={distanceKm}
              matchPercent={matchPercent}
              isSaved
              isApplied={applications.some((a) => a.jobId === job.id)}
              onToggleSave={toggleSaveJob}
              onApply={setApplyingJob}
            />
          ))}
        </div>
      )}

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
