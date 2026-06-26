"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-10 py-5 bg-white shadow-sm">

      <Link
        href="/"
        className="text-2xl font-bold text-indigo-600"
      >
        FocusGeek
      </Link>

      <div className="flex gap-8">

        <Link href="/dashboard">Dashboard</Link>

        <Link href="/planner">Planner</Link>

        <Link href="/notes">Notes</Link>

        <Link href="/focus">Focus</Link>

        <Link href="/quiz">Quiz</Link>

        <Link href="/analytics">Analytics</Link>

      </div>

    </nav>
  );
}