"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, Mail, Lock, User, ShieldCheck, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const {
    signup,
    confirmSignup,
    resendCode,
    error,
    clearError,
    user,
    loading: sessionLoading,
  } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<"details" | "confirm">("details");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionLoading && user) {
      router.replace("/dashboard");
    }
  }, [sessionLoading, user, router]);

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setNotice(null);

    if (password !== confirmPassword) {
      setNotice(null);
      clearError();
      setSubmitting(false);
      return;
    }

    setSubmitting(true);
    try {
      const { confirmationRequired } = await signup(email, password, name);
      if (confirmationRequired) {
        setStep("confirm");
      } else {
        router.push("/login");
      }
    } catch {
      // error surfaced via useAuth().error
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setSubmitting(true);

    try {
      await confirmSignup(email, code);
      router.push("/login?confirmed=1");
    } catch {
      // error surfaced via useAuth().error
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    clearError();
    setNotice(null);
    try {
      await resendCode(email);
      setNotice("A new code has been sent to your email.");
    } catch {
      // error surfaced via useAuth().error
    }
  };

  const passwordMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <div className="auth-page">
      <div className="card w-full max-w-md">
        <div className="text-center mb-6">
          <Link href="/" className="text-2xl font-bold text-gradient">
            FocusGeek
          </Link>
          <p className="text-muted text-sm mt-2">
            {step === "details"
              ? "Create your account to get started."
              : `Enter the code sent to ${email}.`}
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

        {notice && !error && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm rounded-xl px-4 py-3 mb-4">
            {notice}
          </div>
        )}

        {step === "details" ? (
          <form onSubmit={handleDetailsSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="text-xs text-muted">
                Name
              </label>
              <div className="flex items-center gap-2 glass-input rounded-full px-4 py-2.5 mt-1.5">
                <User size={16} className="text-muted shrink-0" />
                <input
                  id="name"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="bg-transparent outline-none text-sm w-full"
                />
              </div>
            </div>

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
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="bg-transparent outline-none text-sm w-full"
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="text-xs text-muted">
                Confirm Password
              </label>
              <div className="flex items-center gap-2 glass-input rounded-full px-4 py-2.5 mt-1.5">
                <Lock size={16} className="text-muted shrink-0" />
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="bg-transparent outline-none text-sm w-full"
                />
              </div>
              {passwordMismatch && (
                <p className="text-red-700 text-xs mt-1.5">
                  Passwords do not match.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting || passwordMismatch}
              className="w-full flex items-center justify-center gap-2 bg-linear-to-br from-luna-200 to-luna-300 text-white text-sm font-semibold px-5 py-3 rounded-full hover:brightness-110 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <UserPlus size={16} />
              )}
              {submitting ? "Creating account..." : "Sign Up"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleConfirmSubmit} className="space-y-4">
            <div>
              <label htmlFor="code" className="text-xs text-muted">
                Confirmation Code
              </label>
              <div className="flex items-center gap-2 glass-input rounded-full px-4 py-2.5 mt-1.5">
                <ShieldCheck size={16} className="text-muted shrink-0" />
                <input
                  id="code"
                  required
                  inputMode="numeric"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  className="bg-transparent outline-none text-sm w-full"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-linear-to-br from-luna-200 to-luna-300 text-white text-sm font-semibold px-5 py-3 rounded-full hover:brightness-110 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              {submitting ? "Confirming..." : "Confirm Account"}
            </button>

            <button
              type="button"
              onClick={handleResend}
              className="w-full text-center text-xs text-muted hover:text-luna-100 transition"
            >
              Resend code
            </button>
          </form>
        )}

        {step === "details" && (
          <p className="text-center text-sm text-muted mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-luna-100 font-semibold">
              Login
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
