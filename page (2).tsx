"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Upload, X, Save } from "lucide-react";
import { useAppData } from "@/components/AppDataProvider";
import { categoryLabels } from "@/lib/mockData";
import { JobCategory, WorkMode } from "@/types";

const workModeOptions: WorkMode[] = ["remote", "on-site", "hybrid"];

export default function ProfilePage() {
  const router = useRouter();
  const { profile, isAuthenticated, updateProfile } = useAppData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [skillInput, setSkillInput] = useState("");
  const [saved, setSaved] = useState(false);

  if (!isAuthenticated || !profile) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="mb-3 text-ink-700 dark:text-ink-100">Log in to manage your profile.</p>
        <button
          onClick={() => router.push("/login")}
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600"
        >
          Go to login
        </button>
      </div>
    );
  }

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // In production: upload to Supabase Storage and save the returned public URL.
    updateProfile({ resumeFileName: file.name, resumeUrl: URL.createObjectURL(file) });
  };

  const addSkill = () => {
    const skill = skillInput.trim();
    if (!skill || profile.skills.includes(skill)) return;
    updateProfile({ skills: [...profile.skills, skill] });
    setSkillInput("");
  };

  const removeSkill = (skill: string) => {
    updateProfile({ skills: profile.skills.filter((s) => s !== skill) });
  };

  const toggleCategory = (cat: JobCategory) => {
    const has = profile.preferredCategories.includes(cat);
    updateProfile({
      preferredCategories: has
        ? profile.preferredCategories.filter((c) => c !== cat)
        : [...profile.preferredCategories, cat],
    });
  };

  const toggleWorkMode = (mode: WorkMode) => {
    const has = profile.preferredWorkModes.includes(mode);
    updateProfile({
      preferredWorkModes: has
        ? profile.preferredWorkModes.filter((m) => m !== mode)
        : [...profile.preferredWorkModes, mode],
    });
  };

  const handleSaveNotice = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900 dark:text-ink-50">Profile & resume</h1>
          <p className="text-sm text-ink-600 dark:text-ink-400">
            Fill this out once — it powers one-click apply and your match scores.
          </p>
        </div>
        {saved && <span className="text-sm font-medium text-emerald-600">Saved</span>}
      </div>

      <div className="flex flex-col gap-6">
        {/* Resume */}
        <section className="rounded-xl border border-ink-100 bg-white p-5 dark:border-ink-800 dark:bg-ink-900">
          <h2 className="mb-3 font-display text-base font-semibold text-ink-900 dark:text-ink-50">Resume</h2>
          {profile.resumeFileName ? (
            <div className="flex items-center justify-between rounded-lg border border-ink-100 p-3 dark:border-ink-800">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-brand-500" />
                <span className="text-sm font-medium text-ink-900 dark:text-ink-50">{profile.resumeFileName}</span>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-sm font-medium text-brand-600 hover:underline dark:text-brand-400"
              >
                Replace
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full flex-col items-center gap-2 rounded-lg border-2 border-dashed border-ink-200 py-8 text-sm text-ink-500 hover:border-brand-300 dark:border-ink-700"
            >
              <Upload className="h-6 w-6" />
              Click to upload your resume (PDF, DOC)
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={handleResumeUpload}
          />
        </section>

        {/* Basic info */}
        <section className="rounded-xl border border-ink-100 bg-white p-5 dark:border-ink-800 dark:bg-ink-900">
          <h2 className="mb-3 font-display text-base font-semibold text-ink-900 dark:text-ink-50">Basic information</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField label="Full name" value={profile.fullName} onChange={(v) => updateProfile({ fullName: v })} />
            <TextField label="Email" value={profile.email} onChange={(v) => updateProfile({ email: v })} type="email" />
            <TextField label="Phone" value={profile.phone ?? ""} onChange={(v) => updateProfile({ phone: v })} />
            <TextField label="Headline" value={profile.headline ?? ""} onChange={(v) => updateProfile({ headline: v })} />
            <TextField label="Education level" value={profile.educationLevel} onChange={(v) => updateProfile({ educationLevel: v })} />
            <TextField label="Field of study" value={profile.fieldOfStudy ?? ""} onChange={(v) => updateProfile({ fieldOfStudy: v })} />
            <TextField
              label="Graduation year"
              value={String(profile.graduationYear ?? "")}
              onChange={(v) => updateProfile({ graduationYear: Number(v) || undefined })}
              type="number"
            />
            <TextField
              label="Experience (years)"
              value={String(profile.experienceYears)}
              onChange={(v) => updateProfile({ experienceYears: Number(v) || 0 })}
              type="number"
            />
            <TextField
              label="Expected salary (₹/year)"
              value={String(profile.expectedSalary ?? "")}
              onChange={(v) => updateProfile({ expectedSalary: Number(v) || undefined })}
              type="number"
            />
            <TextField label="City" value={profile.city ?? ""} onChange={(v) => updateProfile({ city: v })} />
          </div>
        </section>

        {/* Skills */}
        <section className="rounded-xl border border-ink-100 bg-white p-5 dark:border-ink-800 dark:bg-ink-900">
          <h2 className="mb-3 font-display text-base font-semibold text-ink-900 dark:text-ink-50">Skills</h2>
          <div className="mb-3 flex flex-wrap gap-2">
            {profile.skills.map((s) => (
              <span
                key={s}
                className="flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-brand-950 dark:text-brand-300"
              >
                {s}
                <button onClick={() => removeSkill(s)} aria-label={`Remove ${s}`}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
              placeholder="Add a skill and press Enter"
              className="flex-1 rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50"
            />
            <button onClick={addSkill} className="rounded-lg bg-ink-50 px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-100 dark:bg-ink-800 dark:text-ink-100">
              Add
            </button>
          </div>
        </section>

        {/* Preferences */}
        <section className="rounded-xl border border-ink-100 bg-white p-5 dark:border-ink-800 dark:bg-ink-900">
          <h2 className="mb-3 font-display text-base font-semibold text-ink-900 dark:text-ink-50">Job preferences</h2>
          <p className="mb-2 text-sm font-medium text-ink-700 dark:text-ink-100">Preferred categories</p>
          <div className="mb-4 flex flex-wrap gap-2">
            {(Object.keys(categoryLabels) as JobCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={
                  profile.preferredCategories.includes(cat)
                    ? "rounded-full bg-brand-500 px-3 py-1 text-xs font-medium text-white"
                    : "rounded-full bg-ink-50 px-3 py-1 text-xs font-medium text-ink-700 dark:bg-ink-800 dark:text-ink-100"
                }
              >
                {categoryLabels[cat]}
              </button>
            ))}
          </div>
          <p className="mb-2 text-sm font-medium text-ink-700 dark:text-ink-100">Preferred work mode</p>
          <div className="flex flex-wrap gap-2">
            {workModeOptions.map((mode) => (
              <button
                key={mode}
                onClick={() => toggleWorkMode(mode)}
                className={
                  profile.preferredWorkModes.includes(mode)
                    ? "rounded-full bg-brand-500 px-3 py-1 text-xs font-medium capitalize text-white"
                    : "rounded-full bg-ink-50 px-3 py-1 text-xs font-medium capitalize text-ink-700 dark:bg-ink-800 dark:text-ink-100"
                }
              >
                {mode}
              </button>
            ))}
          </div>
        </section>

        <button
          onClick={handleSaveNotice}
          className="flex items-center justify-center gap-2 self-start rounded-lg bg-brand-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
        >
          <Save className="h-4 w-4" /> Save profile
        </button>
      </div>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium text-ink-700 dark:text-ink-100">
      {label}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50"
      />
    </label>
  );
}
