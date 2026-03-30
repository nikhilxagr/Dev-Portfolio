import Link from "next/link";

import { navigationItems } from "@/lib/navigation";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--border-soft)] bg-[color:rgba(234,251,244,0.86)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="min-w-max">
          <span className="font-[family-name:var(--font-heading)] text-lg font-bold tracking-tight text-[color:var(--text-primary-on-light)]">
            Nikhil Agrahari
          </span>
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-medium text-[color:var(--text-secondary-on-light)] lg:flex">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-[color:var(--text-primary-on-light)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <a
          href="https://drive.google.com/file/d/1-BUv73624cDLAwxRkLhZGQBkQqyJUVWG/view?usp=drive_link"
          target="_blank"
          rel="noreferrer"
          className="hidden rounded-full bg-[color:var(--bg-card)] px-4 py-2 text-sm font-semibold text-[color:var(--text-primary-on-dark)] shadow-[var(--shadow-card)] transition-transform hover:-translate-y-0.5 md:inline-flex"
        >
          Resume
        </a>
      </div>

      <div className="scrollbar-hide flex gap-3 overflow-x-auto px-5 pb-4 text-sm font-medium text-[color:var(--text-secondary-on-light)] lg:hidden">
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-full border border-[color:var(--border-soft)] bg-white px-3 py-2 whitespace-nowrap transition-colors hover:border-[color:var(--accent-primary)] hover:text-[color:var(--text-primary-on-light)]"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
