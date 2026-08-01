"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Notebook,
  Timer,
  Brain,
  BarChart3,
  Flame,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/planner", label: "Planner", icon: Calendar },
  { href: "/notes", label: "Notes AI", icon: Notebook },
  { href: "/focus", label: "Focus Mode", icon: Timer },
  { href: "/quiz", label: "Quiz", icon: Brain },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 h-screen fixed left-0 top-0 flex flex-col bg-luna-500/60 backdrop-blur-xl border-r border-luna-100/10 p-4">
      <Link href="/" className="flex items-center gap-2 mb-6 px-1">
        <div className="w-8 h-8 rounded-full bg-linear-to-br from-luna-200 to-luna-300 flex items-center justify-center text-white font-bold text-sm shrink-0">
          F
        </div>
        <span className="text-base font-bold text-gradient truncate">
          FocusGeek
        </span>
      </Link>

      <nav className="flex flex-col gap-1 flex-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition ${
                active
                  ? "bg-linear-to-br from-luna-200 to-luna-300 text-white shadow-lg"
                  : "text-luna-100/60 hover:bg-white/5 hover:text-luna-100"
              }`}
            >
              <Icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="rounded-2xl bg-linear-to-br from-luna-300 to-luna-400 p-3.5 border border-luna-100/10">
        <Flame className="text-amber-300" size={20} />
        <p className="font-semibold mt-2 text-sm">14 Day Streak</p>
        <p className="text-xs text-luna-100/60 mt-1 leading-snug">
          Keep it up to boost your readiness score.
        </p>
        <Link
          href="/analytics"
          className="block text-center mt-3 bg-white/10 hover:bg-white/20 text-xs font-semibold py-2 rounded-full transition"
        >
          View Progress
        </Link>
      </div>
    </aside>
  );
}
