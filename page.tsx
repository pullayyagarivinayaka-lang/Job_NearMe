"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  GraduationCap,
  Briefcase,
  Calendar,
  Clock,
  Bookmark,
  BookmarkCheck,
  Zap,
  ExternalLink,
} from "lucide-react";
import { jobs, categoryLabels } from "@/lib/mockData";
import { useAppData } from "@/components/AppDataProvider";
import { haversineDistanceKm, formatDistance } from "@/lib/distance";
import { computeMatchScore } from "@/lib/matching";
import { ApplyModal } from "@/components/ApplyModal";

function formatSalary(min: number, max: number, period: "month" | "year") {
  const fmt = (n: number) => `₹${(n / 100000).toFixed(1)}L`;
  const fmtSmall = (n: number) => `₹${Math.round(n / 1000)}K`;
  const f = min >= 100000 ? fmt : fmtSmall;
  return `${f(min)} - ${f(max)} per ${period}`;
}

export default function JobDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const job = jobs.find((j) => j.id === params.id);
  const { profile, location, savedJobIds, applications, toggleSaveJob, applyToJob } = useAppData();
  const [applying, setApplying] = useState(false);

  if (!job) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-lg font-semibold text-ink-900 dark:text-ink-50">Job not found</p>
        <Link href="/jobs" className="mt-3 inline-block text-brand-600 hover:underline dark:text-brand-400">
          Back to job search
        </Link>
      </div>
    );
  }

  const distanceKm =
    location.latitude !== null && location.longitude !== null
      ? haversineDistanceKm(location.latitude, location.longitude, job.latitude, job.longitude)
      : null;
  const matchPercent = computeMatchScore(job, profile);
  const isSaved = savedJobIds.includes(job.id);
  const isApplied = applications.some((a) => a.jobId === job.id);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
      <button
        onClick={() => router.back()}
        className="mb-4 flex items-center gap-1.5 text-sm font-medium text-ink-600 hover:text-brand-600 dark:text-ink-400 dark:hover:text-brand-400"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      <div className="rounded-2xl border border-ink-100 bg-white p-5 dark:border-ink-800 dark:bg-ink-900 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-ink-50 dark:bg-ink-800">
              {job.companyLogo ? (
                <Image src={job.companyLogo} alt={`${job.company} logo`} width={56} height={56} className="object-contain" />
              ) : (
                <Briefcase className="h-6 w-6 text-ink-400" />
              )}
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-ink-50">{job.title}</h1>
              <p className="text-ink-600 dark:text-ink-400">{job.company}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-500 dark:text-ink-400">
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>
                {distanceKm !== null && <span>· {formatDistance(distanceKm)}</span>}
              </div>
            </div>
          </div>
          <span className="inline-flex w-fit items-center rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
            {matchPercent}% match
          </span>
        </div>

        <div className="my-6 grid grid-cols-2 gap-4 rounded-xl bg-ink-50 p-4 dark:bg-ink-800 sm:grid-cols-4">
          <Stat label="Salary" value={formatSalary(job.salaryMin, job.salaryMax, job.salaryPeriod)} />
          <Stat label="Experience" value={job.experience} />
          <Stat label="Job type" value={job.jobType} />
          <Stat label="Work mode" value={job.workMode} />
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-500 dark:text-ink-400">
          <span className="flex items-center gap-1.5"><GraduationCap className="h-4 w-4" /> {job.education}</span>
          <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Posted {new Date(job.postedDate).toLocaleDateString()}</span>
          <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> Apply by {new Date(job.deadline).toLocaleDateString()}</span>
        </div>

        <div className="flex flex-col gap-3 border-b border-ink-100 pb-6 dark:border-ink-800 sm:flex-row">
          <button
            onClick={() => toggleSaveJob(job.id)}
            className="flex items-center justify-center gap-2 rounded-lg border border-ink-200 px-5 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50 dark:border-ink-700 dark:text-ink-100 dark:hover:bg-ink-800"
          >
            {isSaved ? <BookmarkCheck className="h-4 w-4 text-brand-500" /> : <Bookmark className="h-4 w-4" />}
            {isSaved ? "Saved" : "Save job"}
          </button>
          <button
            onClick={() => setApplying(true)}
            disabled={isApplied}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isApplied ? (
              "Applied"
            ) : job.applyMethod === "one-click" ? (
              <><Zap className="h-4 w-4" /> One-click apply</>
            ) : (
              <><ExternalLink className="h-4 w-4" /> Apply on company site</>
            )}
          </button>
        </div>

        <section className="mt-6 space-y-6">
          <div>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink-900 dark:text-ink-50">About the role</h2>
            <p className="text-sm leading-relaxed text-ink-600 dark:text-ink-400">{job.description}</p>
          </div>
          <div>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink-900 dark:text-ink-50">Responsibilities</h2>
            <ul className="list-disc space-y-1 pl-5 text-sm text-ink-600 dark:text-ink-400">
              {job.responsibilities.map((r) => <li key={r}>{r}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink-900 dark:text-ink-50">Requirements</h2>
            <ul className="list-disc space-y-1 pl-5 text-sm text-ink-600 dark:text-ink-400">
              {job.requirements.map((r) => <li key={r}>{r}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink-900 dark:text-ink-50">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((s) => (
                <span key={s} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                  {s}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h2 className="mb-2 font-display text-lg font-semibold text-ink-900 dark:text-ink-50">Categories</h2>
            <div className="flex flex-wrap gap-2">
              {job.categories.map((c) => (
                <span key={c} className="rounded-full bg-ink-50 px-3 py-1 text-xs font-medium text-ink-700 dark:bg-ink-800 dark:text-ink-100">
                  {categoryLabels[c]}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>

      {applying && (
        <ApplyModal
          job={job}
          profile={profile}
          onClose={() => setApplying(false)}
          onConfirmed={(j, method) => applyToJob(j.id, method)}
        />
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-ink-400">{label}</p>
      <p className="mt-0.5 text-sm font-semibold capitalize text-ink-900 dark:text-ink-50">{value}</p>
    </div>
  );
}
