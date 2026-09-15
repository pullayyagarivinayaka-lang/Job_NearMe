export type JobType = "internship" | "full-time" | "part-time" | "contract";
export type WorkMode = "remote" | "on-site" | "hybrid";
export type ExperienceLevel =
  | "fresher"
  | "undergraduate"
  | "0-1 years"
  | "1-3 years"
  | "3-5 years"
  | "5+ years";

export type JobCategory =
  | "internships"
  | "fresher"
  | "undergraduate"
  | "graduate"
  | "part-time"
  | "full-time"
  | "remote"
  | "it-software"
  | "data-science"
  | "analytics"
  | "finance"
  | "marketing"
  | "design"
  | "customer-support"
  | "government";

export type ApplyMethod = "one-click" | "external";

export interface Job {
  id: string;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  latitude: number;
  longitude: number;
  salaryMin: number;
  salaryMax: number;
  salaryPeriod: "month" | "year";
  experience: ExperienceLevel;
  education: string;
  jobType: JobType;
  workMode: WorkMode;
  categories: JobCategory[];
  postedDate: string; // ISO
  deadline: string; // ISO
  description: string;
  responsibilities: string[];
  requirements: string[];
  skills: string[];
  applyMethod: ApplyMethod;
  externalApplyUrl?: string; // required if applyMethod === "external"
}

export type ApplicationStatus =
  | "redirected" // sent to external portal, completion on employer site not yet confirmed
  | "applied"
  | "under_review"
  | "shortlisted"
  | "interview"
  | "rejected"
  | "offer";

export interface Application {
  id: string;
  jobId: string;
  appliedDate: string;
  status: ApplicationStatus;
  method: ApplyMethod;
  notes?: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  headline?: string;
  educationLevel: string;
  fieldOfStudy?: string;
  graduationYear?: number;
  experienceYears: number;
  skills: string[];
  preferredCategories: JobCategory[];
  preferredWorkModes: WorkMode[];
  expectedSalary?: number;
  resumeFileName?: string;
  resumeUrl?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  avatarUrl?: string;
}
