"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { jobs } from "@/lib/mockData";
import { Job } from "@/types";
import { JobCard } from "@/components/JobCard";
import { FilterSidebar, JobFilters, defaultFilters } from "@/components/FilterSidebar";
import { LocationBar } from "@/components/LocationBar";
import { ApplyModal } from "@/components/ApplyModal";
import { useAppData } from "@/components/AppDataProvider";
import { haversineDistanceKm } from "@/lib/distance";
import { computeMatchScore } from "@/lib/matching";

function JobsPageInner() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");

  const { profile, location, savedJobIds, applications, toggleSaveJob, applyToJob } = useAppData();
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"match" | "distance" | "recent" | "salary">("match");
  const [filters, setFilters] = useState<JobFilters>(
    initialCategory
      ? { ...defaultFilters, categories: [initialCategory as JobFilters["categories"][number]] }
      : defaultFilters
  );
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [applyingJob, setApplyingJob] = useState<Job | null>(null);

  const availableCompanies = useMemo(
    () => Array.from(new Set(jobs.map((j) => j.company))).sort(),
    []
  );

  const enrichedJobs = useMemo(() => {
    return jobs.map((job) => {
      const distanceKm =
        location.latitude !== null && location.longitude !== null
          ? haversineDistanceKm(location.latitude, location.longitude, job.latitude, job.longitude)
          : null;
      const matchPercent = computeMatchScore(job, profile);
      return { job, distanceKm, matchPercent };
    });
  }, [location, profile]);

  const filtered = useMemo(() => {
    let result = enrichedJobs.filter(({ job, distanceKm }) => {
      if (query) {
        const q = query.toLowerCase();
        const haystack = `${job.title} ${job.company} ${job.skills.join(" ")}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (filters.categories.length && !job.categories.some((c) => filters.categories.includes(c)))
        return false;
      if (filters.jobTypes.length && !filters.jobTypes.includes(job.jobType)) return false;
      if (filters.workModes.length && !filters.workModes.includes(job.workMode)) return false;
      if (filters.experience.length && !filters.experience.includes(job.experience)) return false;
      if (filters.companies.length && !filters.companies.includes(job.company)) return false;
      if (job.salaryMax * (job.salaryPeriod === "month" ? 12 : 1) < filters.minSalary) return false;
      if (filters.maxDistanceKm !== null) {
        if (distanceKm === null || distanceKm > filters.maxDistanceKm) return false;
      }
      return true;
    });

    result = result.sort((a, b) => {
      if (sortBy === "match") return b.matchPercent - a.matchPercent;
      if (sortBy === "distance") {
        if (a.distanceKm === null) return 1;
        if (b.distanceKm === null) return -1;
        return a.distanceKm - b.distanceKm;
      }
      if (sortBy === "recent")
        return new Date(b.job.postedDate).getTime() - new Date(a.job.postedDate).getTime();
      if (sortBy === "salary") return b.job.salaryMax - a.job.salaryMax;
      return 0;
    });

    return result;
  }, [enrichedJobs, query, filters, sortBy]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search job title, company, or skill..."
              aria-label="Search jobs"
              className="w-full rounded-lg border border-ink-200 bg-white py-2.5 pl-9 pr-3 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50"
            />
          </div>
          <LocationBar />
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center justify-center gap-2 rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-sm font-medium text-ink-700 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-100 md:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-ink-600 dark:text-ink-400">
            {filtered.length} job{filtered.length === 1 ? "" : "s"} found
            <span className="ml-2 hidden text-ink-400 sm:inline">
              · Open to applicants from any location — distance is shown for convenience only
            </span>
          </p>
          <label className="flex items-center gap-2 text-sm text-ink-600 dark:text-ink-400">
            Sort by
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="rounded-lg border border-ink-200 bg-white px-2 py-1.5 text-sm dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50"
            >
              <option value="match">Best match</option>
              <option value="distance">Nearest</option>
              <option value="recent">Most recent</option>
              <option value="salary">Highest salary</option>
            </select>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[260px_1fr]">
        <aside className="hidden rounded-xl border border-ink-100 dark:border-ink-800 md:block">
          <FilterSidebar filters={filters} onChange={setFilters} availableCompanies={availableCompanies} />
        </aside>

        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-40 flex md:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
            <div className="relative ml-auto h-full w-80 max-w-[85vw] bg-white dark:bg-ink-900">
              <FilterSidebar
                filters={filters}
                onChange={setFilters}
                availableCompanies={availableCompanies}
                onClose={() => setMobileFiltersOpen(false)}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.length === 0 ? (
            <div className="col-span-full flex flex-col items-center gap-2 rounded-xl border border-dashed border-ink-200 py-16 text-center dark:border-ink-700">
              <X className="h-8 w-8 text-ink-300" />
              <p className="font-medium text-ink-700 dark:text-ink-100">No jobs match your filters</p>
              <p className="text-sm text-ink-400">Try widening your distance range or clearing a filter.</p>
            </div>
          ) : (
            filtered.map(({ job, distanceKm, matchPercent }) => (
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
            ))
          )}
        </div>
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

export default function JobsPage() {
  return (
    <Suspense fallback={null}>
      <JobsPageInner />
    </Suspense>
  );
}
