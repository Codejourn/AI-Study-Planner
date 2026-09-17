"use client";
import Link from "next/link";
import { Sparkles } from "lucide-react";
export default function Navbar() {
  return (
    <nav className="public-nav" aria-label="Main navigation">
      <Link href="/" className="brand">
        <span className="brand-symbol">
          <Sparkles size={17} />
        </span>
        FocusGeek<span className="text-[#a18da4]">.</span>
      </Link>
      <div className="hidden md:flex gap-8 text-xs text-muted">
        <Link href="#features" className="hover:text-luna-300">
          The little things
        </Link>
        <Link href="#how-it-works" className="hover:text-luna-300">
          How it works
        </Link>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/login" className="text-xs text-muted">
          Log in
        </Link>
        <Link href="/signup" className="action">
          Get started <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </nav>
  );
}
