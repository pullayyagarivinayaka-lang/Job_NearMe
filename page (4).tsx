"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Briefcase } from "lucide-react";
import { useAppData } from "@/components/AppDataProvider";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAppData();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("undergraduate");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // In production: supabase.auth.signUp({ email, password }) then insert into profiles.
    await new Promise((r) => setTimeout(r, 500));
    login(email || "student@example.com");
    setLoading(false);
    router.push("/profile");
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <Link href="/" className="mb-8 flex items-center justify-center gap-2 font-display text-xl font-bold text-brand-600 dark:text-brand-400">
        <Briefcase className="h-6 w-6" /> JobNearMe
      </Link>
      <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm dark:border-ink-800 dark:bg-ink-900 sm:p-8">
        <h1 className="mb-1 font-display text-2xl font-bold text-ink-900 dark:text-ink-50">Create your account</h1>
        <p className="mb-6 text-sm text-ink-600 dark:text-ink-400">
          One profile. Every job search, done faster.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm font-medium text-ink-700 dark:text-ink-100">
            Full name
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-sm dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50"
              placeholder="Your name"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium text-ink-700 dark:text-ink-100">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-sm dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50"
              placeholder="you@example.com"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium text-ink-700 dark:text-ink-100">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-sm dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50"
              placeholder="At least 8 characters"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium text-ink-700 dark:text-ink-100">
            I am a...
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-sm dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50"
            >
              <option value="undergraduate">Undergraduate student</option>
              <option value="graduate">Graduate</option>
              <option value="fresher">Fresher</option>
              <option value="experienced">Experienced professional</option>
            </select>
          </label>
          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-600 dark:text-ink-400">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
