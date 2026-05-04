"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Today" },
  { href: "/history", label: "History" },
  { href: "/stats", label: "Stats" },
] as const;

export default function Nav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 bg-card/80 backdrop-blur border-b border-card-border">
      <nav className="max-w-3xl mx-auto px-4 flex items-center gap-1 h-14">
        <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-sm mr-4">
          🥗 Meal Tracker
        </span>
        {links.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={[
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                  : "text-muted hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800",
              ].join(" ")}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
