"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, Mail, Lock, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const {
    login,
    startDemo,
    isConfigured,
    error,
    clearError,
    user,
    loading: sessionLoading,
  } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!sessionLoading && user) {
      router.replace("/dashboard");
    }
  }, [sessionLoading, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSubmitting(true);

    try {
      await login(email, password);
      router.push("/dashboard");
    } catch {
      // error is surfaced via useAuth().error
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="card w-full max-w-md">
        <div className="text-center mb-6">
          <Link href="/" className="text-2xl font-bold text-gradient">
            FocusGeek
          </Link>
          <p className="text-muted text-sm mt-2">
            Welcome back. Sign in to continue.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="bg-red-500/10 border border-red-500/30 text-red-700 text-sm rounded-xl px-4 py-3 mb-4"
          >
            {error}
          </div>
        )}

        {!isConfigured && (
          <div className="mb-5 space-y-3 text-sm">
            <p>
              Cloud sign-in is not configured. Try a local workspace; your study
              data stays in this browser.
            </p>
            <button
              className="action"
              onClick={() => {
                startDemo();
                router.push("/dashboard");
              }}
            >
              Try FocusGeek locally
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="text-xs text-muted">
              Email
            </label>
            <div className="flex items-center gap-2 glass-input rounded-full px-4 py-2.5 mt-1.5">
              <Mail size={16} className="text-muted shrink-0" />
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="text-xs text-muted">
              Password
            </label>
            <div className="flex items-center gap-2 glass-input rounded-full px-4 py-2.5 mt-1.5">
              <Lock size={16} className="text-muted shrink-0" />
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || !isConfigured}
            className="w-full flex items-center justify-center gap-2 bg-linear-to-br from-luna-200 to-luna-300 text-white text-sm font-semibold px-5 py-3 rounded-full hover:brightness-110 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <LogIn size={16} />
            )}
            {submitting ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-luna-100 font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
