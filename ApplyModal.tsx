"use client";

import { useState } from "react";
import { Job, UserProfile } from "@/types";
import { X, CheckCircle2, ExternalLink, FileText, AlertTriangle } from "lucide-react";

interface ApplyModalProps {
  job: Job;
  profile: UserProfile | null;
  onClose: () => void;
  onConfirmed: (job: Job, method: "one-click" | "external") => void;
}

export function ApplyModal({ job, profile, onClose, onConfirmed }: ApplyModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const hasResume = Boolean(profile?.resumeFileName);

  const handleOneClickApply = async () => {
    setSubmitting(true);
    // In production: POST profile + resume to the employer's ATS via API/webhook.
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    setSubmitted(true);
    onConfirmed(job, "one-click");
  };

  const handleExternalApply = () => {
    // We never mark this as "applied" until the user actually completes it
    // on the employer's site — this only records intent and opens the portal.
    onConfirmed(job, "external");
    if (job.externalApplyUrl) {
      window.open(job.externalApplyUrl, "_blank", "noopener,noreferrer");
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="apply-modal-title"
    >
      <div className="w-full max-w-md rounded-t-2xl bg-white p-6 shadow-xl dark:bg-ink-900 sm:rounded-2xl">
        <div className="mb-4 flex items-start justify-between">
          <h2 id="apply-modal-title" className="font-display text-lg font-semibold text-ink-900 dark:text-ink-50">
            {submitted ? "Application submitted" : `Apply to ${job.title}`}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <CheckCircle2 className="h-12 w-12 text-emerald-500" aria-hidden />
            <p className="text-sm text-ink-600 dark:text-ink-400">
              Your profile and resume were sent to <strong>{job.company}</strong> for{" "}
              <strong>{job.title}</strong>. Track its status from your Applications page.
            </p>
            <button
              onClick={onClose}
              className="mt-2 w-full rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
            >
              Done
            </button>
          </div>
        ) : job.applyMethod === "one-click" ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-ink-600 dark:text-ink-400">
              We'll submit your saved profile and resume directly to {job.company}.
            </p>
            <p className="text-xs font-medium text-brand-600 dark:text-brand-400">
              This job is open to applicants from anywhere — your location never affects
              eligibility, only whether we can show you a distance estimate.
            </p>
            <div className="flex items-center gap-3 rounded-lg border border-ink-100 p-3 dark:border-ink-800">
              <FileText className="h-5 w-5 shrink-0 text-brand-500" aria-hidden />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-ink-900 dark:text-ink-50">
                  {profile?.fullName ?? "Your profile"}
                </p>
                <p className="truncate text-xs text-ink-400">
                  {hasResume ? profile?.resumeFileName : "No resume uploaded"}
                </p>
              </div>
            </div>
            {!hasResume && (
              <p className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                You haven't uploaded a resume yet. Some employers require one — add it in your
                Profile for a stronger application.
              </p>
            )}
            <button
              onClick={handleOneClickApply}
              disabled={submitting}
              className="w-full rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Confirm & Submit"}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-ink-600 dark:text-ink-400">
              {job.company} accepts applications only through their official careers portal.
              We'll open it in a new tab. Where possible we'll try to prefill your details, but
              you'll need to complete and submit the application yourself on their site.
            </p>
            <p className="flex items-start gap-2 rounded-lg bg-brand-50 p-3 text-xs text-brand-700 dark:bg-brand-950 dark:text-brand-300">
              <ExternalLink className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              We'll mark this as "In progress" in your tracker — not "Applied" — until you finish
              on the employer's site.
            </p>
            <button
              onClick={handleExternalApply}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
            >
              <ExternalLink className="h-4 w-4" aria-hidden />
              Continue to {job.company}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
