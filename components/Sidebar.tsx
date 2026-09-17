"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStudy } from "@/context/StudyContext";
import { useAuth } from "@/context/AuthContext";
import { studyMetrics } from "@/lib/study";
import {
  LayoutDashboard,
  CalendarDays,
  Notebook,
  Timer,
  Brain,
  ChartNoAxesCombined,
  Flame,
  LogOut,
  Sparkles,
} from "lucide-react";
const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/planner", label: "Planner", icon: CalendarDays },
  { href: "/notes", label: "Notes AI", icon: Notebook },
  { href: "/focus", label: "Focus Mode", icon: Timer },
  { href: "/quiz", label: "Quiz", icon: Brain },
  { href: "/analytics", label: "Analytics", icon: ChartNoAxesCombined },
];
export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data } = useStudy();
  const { user, logout } = useAuth();
  const { streak } = studyMetrics(data);
  const name = user?.email?.split("@")[0] ?? "Student";
  return (
    <aside className="sidebar">
      <Link href="/" className="brand px-2">
        <span className="brand-symbol">
          <Sparkles size={17} strokeWidth={1.7} />
        </span>
        FocusGeek<span className="text-[#a18da4]">.</span>
      </Link>
      <div className="sidebar-profile">
        <div className="avatar">{name[0].toUpperCase()}</div>
        <div className="min-w-0">
          <p className="text-[13px] font-semibold capitalize truncate">
            {name}
          </p>
          <p className="text-[11px] text-muted mt-1">A curious mind</p>
        </div>
      </div>
      <nav aria-label="Main navigation" className="space-y-1">
        {navItems.map((item) => (
          <Link
            className={`side-link ${pathname === item.href ? "active" : ""}`}
            aria-current={pathname === item.href ? "page" : undefined}
            key={item.href}
            href={item.href}
          >
            <item.icon size={18} strokeWidth={1.8} />
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="border-t border-[#cfc1cc] pt-5 mb-7">
          <div className="flex items-center gap-2">
            <Flame size={16} className="text-[#b68469]" />
            <p className="text-xs font-semibold">{streak} day study streak</p>
          </div>
          <p className="text-[11px] text-muted mt-2 leading-relaxed">
            Small steps, every day.
            <br />
            You&apos;re building something good.
          </p>
        </div>
        <button
          className="flex items-center gap-2 text-xs text-muted hover:text-luna-300"
          onClick={async () => {
            await logout();
            router.push("/login");
          }}
        >
          <LogOut size={16} />
          Log out
        </button>
      </div>
    </aside>
  );
}
