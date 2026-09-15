import { Job, UserProfile } from "@/types";

/**
 * Computes a 0-100 match score between a candidate profile and a job.
 * Weighted blend of: skills overlap (45%), category/education fit (25%),
 * experience fit (15%), work-mode preference (10%), salary expectation (5%).
 *
 * IMPORTANT: distance/location is intentionally NOT a scoring factor and
 * NEVER gates apply eligibility. Every job on JobNearMe accepts applicants
 * from any city — proximity is surfaced only to help users prioritize,
 * never to restrict who is allowed to apply. Enforce this in the UI layer
 * too: the Apply Now button must stay enabled regardless of location state
 * (including when location permission is denied or unset).
 */
export function computeMatchScore(job: Job, profile: UserProfile | null): number {
  if (!profile) return 50; // neutral default when signed out

  let score = 0;

  // Skills overlap
  const jobSkills = job.skills.map((s) => s.toLowerCase());
  const userSkills = profile.skills.map((s) => s.toLowerCase());
  const overlap = jobSkills.filter((s) => userSkills.includes(s)).length;
  const skillScore = jobSkills.length
    ? Math.min(overlap / jobSkills.length, 1)
    : 0.5;
  score += skillScore * 45;

  // Category / education fit
  const categoryMatch = job.categories.some((c) =>
    profile.preferredCategories.includes(c)
  );
  score += (categoryMatch ? 1 : 0.3) * 25;

  // Experience fit
  const expScore = experienceFit(job.experience, profile.experienceYears);
  score += expScore * 15;

  // Work mode preference
  const modeMatch = profile.preferredWorkModes.includes(job.workMode);
  score += (modeMatch ? 1 : 0.4) * 10;

  // Salary expectation
  if (profile.expectedSalary) {
    const withinRange =
      profile.expectedSalary <= job.salaryMax * 1.15 &&
      profile.expectedSalary >= job.salaryMin * 0.7;
    score += (withinRange ? 1 : 0.3) * 5;
  } else {
    score += 3;
  }

  return Math.round(Math.max(5, Math.min(99, score)));
}

function experienceFit(required: string, years: number): number {
  const map: Record<string, [number, number]> = {
    fresher: [0, 0],
    undergraduate: [0, 0],
    "0-1 years": [0, 1],
    "1-3 years": [1, 3],
    "3-5 years": [3, 5],
    "5+ years": [5, 99],
  };
  const [min, max] = map[required] ?? [0, 99];
  if (years >= min && years <= max) return 1;
  const distance = years < min ? min - years : years - max;
  return Math.max(0, 1 - distance * 0.25);
}
