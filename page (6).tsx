"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Briefcase } from "lucide-react";
import { useAppData } from "@/components/AppDataProvider";
import { isSupabaseConfigured } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAppData();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // In production: supabase.auth.signInWithPassword({ email, password })
    await new Promise((r) => setTimeout(r, 500));
    login(email || "student@example.com");
    setLoading(false);
    router.push("/dashboard");
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <Link href="/" className="mb-8 flex items-center justify-center gap-2 font-display text-xl font-bold text-brand-600 dark:text-brand-400">
        <Briefcase className="h-6 w-6" /> JobNearMe
      </Link>
      <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-sm dark:border-ink-800 dark:bg-ink-900 sm:p-8">
        <h1 className="mb-1 font-display text-2xl font-bold text-ink-900 dark:text-ink-50">Welcome back</h1>
        <p className="mb-6 text-sm text-ink-600 dark:text-ink-400">Log in to continue your job search.</p>

        {!isSupabaseConfigured && (
          <p className="mb-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-700 dark:bg-amber-950 dark:text-amber-400">
            Demo mode: any email/password logs you in with a sample profile. Connect Supabase to
            enable real authentication.
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field label="Email" type="email" value={email} onChange={setEmail} required placeholder="you@example.com" />
          <Field label="Password" type="password" value={password} onChange={setPassword} required placeholder="••••••••" />
          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-600 dark:text-ink-400">
          New here?{" "}
          <Link href="/register" className="font-medium text-brand-600 hover:underline dark:text-brand-400">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  required,
  placeholder,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium text-ink-700 dark:text-ink-100">
      {label}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="rounded-lg border border-ink-200 bg-white px-3 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50"
      />
    </label>
  );
}
