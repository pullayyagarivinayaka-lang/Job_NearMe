import Link from "next/link";
import { MapPin, Zap, ShieldCheck, Users, Target, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <div className="mb-10 text-center">
        <h1 className="font-display text-3xl font-bold text-ink-900 dark:text-ink-50 sm:text-4xl">
          About JobNearMe
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-ink-600 dark:text-ink-400">
          A job-search platform built for the reality of looking for work today: too many tabs,
          too many repeated forms, and not enough clarity on what's actually nearby and actually
          worth your time.
        </p>
      </div>

      <section className="mb-10 rounded-2xl border border-ink-100 bg-white p-6 dark:border-ink-800 dark:bg-ink-900 sm:p-8">
        <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-ink-900 dark:text-ink-50">
          <Target className="h-5 w-5 text-brand-500" /> Why we built this
        </h2>
        <p className="text-sm leading-relaxed text-ink-600 dark:text-ink-400">
          Undergraduates hunting for their first internship, freshers chasing their first offer,
          and experienced professionals switching cities all run into the same wall: dozens of
          job boards, each asking for the same profile information again, with no easy way to
          tell how far a role actually is or how good a fit it really is. JobNearMe exists to
          collapse that into one profile, one search, and one click.
        </p>
      </section>

      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <AboutCard
          icon={<MapPin className="h-5 w-5" />}
          title="Location-first search"
          description="Use GPS or pick a city, and every job shows real distance — so 'near me' actually means near you."
        />
        <AboutCard
          icon={<Zap className="h-5 w-5" />}
          title="One-click apply"
          description="Build your profile and upload your resume once. Supported employers receive it instantly — no repeated forms."
        />
        <AboutCard
          icon={<ShieldCheck className="h-5 w-5" />}
          title="Honest tracking"
          description="We only ever mark a job 'Applied' when it's genuinely submitted. External portals are tracked as in progress until you finish there."
        />
      </div>

      <section className="mb-10 rounded-2xl border border-ink-100 bg-white p-6 dark:border-ink-800 dark:bg-ink-900 sm:p-8">
        <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-semibold text-ink-900 dark:text-ink-50">
          <Users className="h-5 w-5 text-brand-500" /> Who it's for
        </h2>
        <p className="text-sm leading-relaxed text-ink-600 dark:text-ink-400">
          Undergraduate students looking for internships, freshers applying for their first
          full-time role, graduates entering structured programs, and experienced professionals
          exploring a move — across internships, part-time and full-time work, remote roles, IT
          and software, data science and analytics, finance, marketing, design, customer support,
          and government jobs.
        </p>
      </section>

      <section className="mb-10 text-center">
        <h2 className="mb-3 flex items-center justify-center gap-2 font-display text-lg font-semibold text-ink-900 dark:text-ink-50">
          <Heart className="h-5 w-5 text-brand-500" /> Built by
        </h2>
        <p className="text-sm text-ink-600 dark:text-ink-400">
          JobNearMe is an independent project designed and built by Pullayyagari Vinayaka, aimed
          at making the first steps of a job search less repetitive and more honest about where
          things actually stand.
        </p>
      </section>

      <div className="text-center">
        <Link
          href="/jobs"
          className="inline-flex items-center justify-center rounded-lg bg-brand-500 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-600"
        >
          Browse jobs
        </Link>
      </div>
    </div>
  );
}

function AboutCard({
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
