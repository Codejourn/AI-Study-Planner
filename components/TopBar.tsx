"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useClickOutside } from "@/hooks/useClickOutside";

interface Props {
  title?: string;
  subtitle?: string;
}

export default function TopBar({ title, subtitle }: Props) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => setMenuOpen(false));

  const initial = (user?.email ?? user?.username ?? "?").charAt(0).toUpperCase();

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    router.push("/login");
  };

  return (
    <header className="flex items-center justify-between gap-4 mb-5 flex-wrap">
      <div>
        {title && <h1 className="text-xl font-bold">{title}</h1>}
        {subtitle && (
          <p className="text-xs text-luna-100/50 mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-2.5">
        <div className="hidden sm:flex items-center gap-2 glass-input rounded-full px-3.5 py-2 w-56 lg:w-64">
          <Search size={15} className="text-luna-100/40 shrink-0" />
          <input
            placeholder="Search subjects, notes..."
            className="bg-transparent outline-none text-sm w-full placeholder:text-luna-100/40"
          />
        </div>

        <button
          aria-label="Notifications"
          className="relative w-9 h-9 rounded-full bg-white/5 border border-luna-100/10 flex items-center justify-center hover:bg-white/10 transition"
        >
          <Bell size={15} className="text-luna-100/70" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[9px] font-semibold flex items-center justify-center">
            3
          </span>
        </button>

        <div className="relative" ref={menuRef}>
          <button
            aria-label="Account menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
            className="w-9 h-9 rounded-full bg-linear-to-br from-luna-200 to-luna-300 flex items-center justify-center text-white text-xs font-bold"
          >
            {initial}
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-52 card p-2! z-50">
              <div className="px-2.5 py-2 border-b border-luna-100/10 mb-1">
                <p className="text-sm font-semibold truncate">
                  {user?.email ?? user?.username ?? "Guest"}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm text-red-300 hover:bg-red-500/10 transition"
              >
                <LogOut size={15} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
