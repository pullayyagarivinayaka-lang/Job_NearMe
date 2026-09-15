import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-ink-100 py-6 dark:border-ink-800">
      <div className="mb-2 flex justify-center gap-4 text-xs text-ink-400">
        <Link href="/about" className="hover:text-brand-600 dark:hover:text-brand-400">
          About the project
        </Link>
      </div>
      <p className="text-center text-sm text-ink-400">
        Made with ❤️ by Pullayyagari Vinayaka
      </p>
    </footer>
  );
}
