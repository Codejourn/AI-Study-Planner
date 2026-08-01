"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-10 py-5 bg-luna-500/60 backdrop-blur-xl border-b border-luna-100/10 sticky top-0 z-50">
      <Link href="/" className="text-2xl font-bold text-gradient">
        FocusGeek
      </Link>

      <div className="hidden md:flex gap-8 text-luna-100/70">
        <Link href="/dashboard" className="hover:text-luna-100 transition">
          Dashboard
        </Link>
        <Link href="/planner" className="hover:text-luna-100 transition">
          Planner
        </Link>
        <Link href="/notes" className="hover:text-luna-100 transition">
          Notes
        </Link>
        <Link href="/focus" className="hover:text-luna-100 transition">
          Focus
        </Link>
        <Link href="/quiz" className="hover:text-luna-100 transition">
          Quiz
        </Link>
        <Link href="/analytics" className="hover:text-luna-100 transition">
          Analytics
        </Link>
      </div>

      <div className="flex gap-3">
        <Link
          href="/login"
          className="px-5 py-2 rounded-full text-luna-100/80 hover:text-luna-100 border border-luna-100/15 hover:bg-white/5 transition"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="px-5 py-2 rounded-full bg-linear-to-br from-luna-200 to-luna-300 text-white font-medium hover:brightness-110 transition"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
}
