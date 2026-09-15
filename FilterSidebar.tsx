"use client";

import { JobCategory, JobType, WorkMode } from "@/types";
import { categoryLabels } from "@/lib/mockData";
import { X } from "lucide-react";

export interface JobFilters {
  categories: JobCategory[];
  jobTypes: JobType[];
  workModes: WorkMode[];
  experience: string[];
  minSalary: number;
  maxDistanceKm: number | null;
  companies: string[];
}

export const defaultFilters: JobFilters = {
  categories: [],
  jobTypes: [],
  workModes: [],
  experience: [],
  minSalary: 0,
  maxDistanceKm: null,
  companies: [],
};

interface FilterSidebarProps {
  filters: JobFilters;
  onChange: (filters: JobFilters) => void;
  availableCompanies: string[];
  onClose?: () => void;
}

const jobTypeOptions: JobType[] = ["internship", "full-time", "part-time", "contract"];
const workModeOptions: WorkMode[] = ["remote", "on-site", "hybrid"];
const experienceOptions = ["fresher", "undergraduate", "0-1 years", "1-3 years", "3-5 years", "5+ years"];
const categoryOptions = Object.keys(categoryLabels) as JobCategory[];

function toggleValue<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];
}

export function FilterSidebar({ filters, onChange, availableCompanies, onClose }: FilterSidebarProps) {
  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-semibold text-ink-900 dark:text-ink-50">Filters</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onChange(defaultFilters)}
            className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400"
          >
            Clear all
          </button>
          {onClose && (
            <button onClick={onClose} aria-label="Close filters" className="rounded p-1 hover:bg-ink-50 dark:hover:bg-ink-800 md:hidden">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <FilterGroup title="Category">
        <div className="flex flex-wrap gap-1.5">
          {categoryOptions.map((c) => (
            <Chip
              key={c}
              label={categoryLabels[c]}
              active={filters.categories.includes(c)}
              onClick={() => onChange({ ...filters, categories: toggleValue(filters.categories, c) })}
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Job type">
        <div className="flex flex-col gap-2">
          {jobTypeOptions.map((t) => (
            <Checkbox
              key={t}
              label={t}
              checked={filters.jobTypes.includes(t)}
              onChange={() => onChange({ ...filters, jobTypes: toggleValue(filters.jobTypes, t) })}
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Work mode">
        <div className="flex flex-col gap-2">
          {workModeOptions.map((m) => (
            <Checkbox
              key={m}
              label={m}
              checked={filters.workModes.includes(m)}
              onChange={() => onChange({ ...filters, workModes: toggleValue(filters.workModes, m) })}
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Experience">
        <div className="flex flex-col gap-2">
          {experienceOptions.map((e) => (
            <Checkbox
              key={e}
              label={e}
              checked={filters.experience.includes(e)}
              onChange={() => onChange({ ...filters, experience: toggleValue(filters.experience, e) })}
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Minimum salary (₹/year equivalent)">
        <input
          type="range"
          min={0}
          max={2000000}
          step={50000}
          value={filters.minSalary}
          onChange={(e) => onChange({ ...filters, minSalary: Number(e.target.value) })}
          className="w-full accent-brand-500"
          aria-label="Minimum salary"
        />
        <p className="text-sm text-ink-600 dark:text-ink-400">
          ₹{(filters.minSalary / 100000).toFixed(1)}L+
        </p>
      </FilterGroup>

      <FilterGroup title="Distance">
        <select
          value={filters.maxDistanceKm ?? ""}
          onChange={(e) =>
            onChange({ ...filters, maxDistanceKm: e.target.value ? Number(e.target.value) : null })
          }
          className="w-full rounded-lg border border-ink-200 bg-white px-3 py-2 text-sm dark:border-ink-700 dark:bg-ink-900"
        >
          <option value="">Any distance</option>
          <option value="5">Within 5 km</option>
          <option value="10">Within 10 km</option>
          <option value="25">Within 25 km</option>
          <option value="50">Within 50 km</option>
        </select>
      </FilterGroup>

      <FilterGroup title="Company">
        <div className="flex flex-col gap-2">
          {availableCompanies.map((c) => (
            <Checkbox
              key={c}
              label={c}
              checked={filters.companies.includes(c)}
              onChange={() => onChange({ ...filters, companies: toggleValue(filters.companies, c) })}
            />
          ))}
        </div>
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-ink-900 dark:text-ink-50">{title}</h3>
      {children}
    </div>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2 text-sm capitalize text-ink-700 dark:text-ink-100">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-ink-300 text-brand-500 focus:ring-brand-500"
      />
      {label}
    </label>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={
        active
          ? "rounded-full bg-brand-500 px-3 py-1 text-xs font-medium text-white"
          : "rounded-full bg-ink-50 px-3 py-1 text-xs font-medium text-ink-700 hover:bg-ink-100 dark:bg-ink-800 dark:text-ink-100 dark:hover:bg-ink-700"
      }
    >
      {label}
    </button>
  );
}
