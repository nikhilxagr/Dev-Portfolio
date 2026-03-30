import Link from "next/link";

import { navigationItems } from "@/lib/navigation";

export function SiteFooter() {
  return (
    <footer className="border-t border-[color:var(--border-strong)] bg-[color:var(--bg-deep)] py-10 text-[color:var(--text-primary-on-dark)]">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 sm:px-6 lg:grid-cols-[1.4fr_1fr] lg:px-8">
        <div className="space-y-3">
          <p className="font-[family-name:var(--font-heading)] text-2xl font-bold">
            Nikhil Agrahari
          </p>
          <p className="max-w-xl text-sm leading-7 text-[color:var(--text-muted-on-dark)]">
            Building modern web applications, documenting cyber security
            learning, and growing through consistent hands-on work.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-sm text-[color:var(--text-muted-on-dark)]">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-[color:var(--text-primary-on-dark)]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
