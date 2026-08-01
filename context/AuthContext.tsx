"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  signIn as amplifySignIn,
  signUp as amplifySignUp,
  confirmSignUp as amplifyConfirmSignUp,
  resendSignUpCode as amplifyResendSignUpCode,
  signOut as amplifySignOut,
  getCurrentUser,
  fetchAuthSession,
} from "aws-amplify/auth";
import { isCognitoConfigured } from "@/lib/amplify-config";

interface AuthUser {
  username: string;
  email?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  isConfigured: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ confirmationRequired: boolean }>;
  confirmSignup: (email: string, code: string) => Promise<void>;
  resendCode: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function messageFor(err: unknown, fallback: string) {
  if (!isCognitoConfigured) {
    return "Authentication isn't configured yet. Ask your team to add the Cognito User Pool values to .env.local.";
  }
  return err instanceof Error ? err.message : fallback;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    if (!isCognitoConfigured) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const current = await getCurrentUser();
      setUser({
        username: current.username,
        email: current.signInDetails?.loginId,
      });
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const clearError = () => setError(null);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      await amplifySignIn({ username: email, password });
      await refreshUser();
    } catch (err) {
      const msg = messageFor(err, "Failed to sign in.");
      setError(msg);
      throw new Error(msg);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setError(null);
    try {
      const result = await amplifySignUp({
        username: email,
        password,
        options: { userAttributes: { email, name } },
      });
      return {
        confirmationRequired:
          result.nextStep.signUpStep === "CONFIRM_SIGN_UP",
      };
    } catch (err) {
      const msg = messageFor(err, "Failed to sign up.");
      setError(msg);
      throw new Error(msg);
    }
  };

  const confirmSignup = async (email: string, code: string) => {
    setError(null);
    try {
      await amplifyConfirmSignUp({ username: email, confirmationCode: code });
    } catch (err) {
      const msg = messageFor(err, "Invalid confirmation code.");
      setError(msg);
      throw new Error(msg);
    }
  };

  const resendCode = async (email: string) => {
    setError(null);
    try {
      await amplifyResendSignUpCode({ username: email });
    } catch (err) {
      const msg = messageFor(err, "Failed to resend the code.");
      setError(msg);
      throw new Error(msg);
    }
  };

  const logout = async () => {
    try {
      await amplifySignOut();
    } finally {
      setUser(null);
    }
  };

  const getToken = async () => {
    if (!isCognitoConfigured) return null;

    try {
      const session = await fetchAuthSession();
      return session.tokens?.idToken?.toString() ?? null;
    } catch {
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isConfigured: isCognitoConfigured,
        login,
        signup,
        confirmSignup,
        resendCode,
        logout,
        clearError,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
