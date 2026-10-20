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
  fetchUserAttributes,
  updateUserAttribute,
} from "aws-amplify/auth";
import { isCognitoConfigured } from "@/lib/amplify-config";

interface AuthUser {
  username: string;
  email?: string;
  displayName?: string;
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
    name: string,
  ) => Promise<{ confirmationRequired: boolean }>;
  confirmSignup: (email: string, code: string) => Promise<void>;
  resendCode: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  getToken: () => Promise<string | null>;
  startDemo: () => void;
  saveDisplayName: (name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const localDemoAvailable = !isCognitoConfigured || process.env.NODE_ENV === "development";
const localDisplayNameKey = "focusgeek:local-display-name";

function localDisplayName() {
  try {
    return localStorage.getItem(localDisplayNameKey)?.trim() || "Student";
  } catch {
    return "Student";
  }
}

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
    await Promise.resolve();
    if (localDemoAvailable) {
      try {
        if (sessionStorage.getItem("focusgeek:demo") === "true") {
          setUser({ username: "local-demo", displayName: localDisplayName() });
          setLoading(false);
          return;
        }
      } catch {
        // Continue with Cognito, or an empty local session when it is disabled.
      }
    }
    if (!isCognitoConfigured) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const current = await getCurrentUser();
      let attributes: Awaited<ReturnType<typeof fetchUserAttributes>> = {};
      try {
        attributes = await fetchUserAttributes();
      } catch {
        // A temporary profile lookup error should not sign the student out.
      }
      setUser({
        username: current.username,
        email: attributes.email ?? current.signInDetails?.loginId,
        displayName: attributes.name?.trim() || "Student",
      });
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(refreshUser);
  }, [refreshUser]);

  const clearError = () => setError(null);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const result = await amplifySignIn({ username: email, password });
      if (!result.isSignedIn)
        throw new Error(
          `Additional sign-in step required: ${result.nextStep.signInStep}. Complete this step in Cognito before continuing.`,
        );
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
      const displayName = name.trim().replace(/\s+/g, " ");
      if (!displayName || displayName.length > 60)
        throw new Error("Enter a display name of 1 to 60 characters.");
      const result = await amplifySignUp({
        username: email,
        password,
        options: { userAttributes: { email, name: displayName } },
      });
      return {
        confirmationRequired: result.nextStep.signUpStep === "CONFIRM_SIGN_UP",
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
      sessionStorage.removeItem("focusgeek:demo");
      if (user?.username !== "local-demo" && isCognitoConfigured)
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

  const saveDisplayName = async (name: string) => {
    const displayName = name.trim().replace(/\s+/g, " ");
    if (!displayName || displayName.length > 60)
      throw new Error("Enter a display name of 1 to 60 characters.");
    if (!user) throw new Error("Sign in to change your display name.");
    if (user.username === "local-demo") {
      try {
        localStorage.setItem(localDisplayNameKey, displayName);
      } catch {
        throw new Error("Browser storage is unavailable. Your name was not saved.");
      }
    } else {
      const result = await updateUserAttribute({
        userAttribute: { attributeKey: "name", value: displayName },
      });
      if (result.nextStep.updateAttributeStep !== "DONE")
        throw new Error("The name change needs confirmation before it can be shown.");
    }
    setUser((current) =>
      current ? { ...current, displayName } : current,
    );
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
        saveDisplayName,
        startDemo: () => {
          try {
            sessionStorage.setItem("focusgeek:demo", "true");
          } catch {
            setError(
              "Session storage is disabled. This local session will end on reload.",
            );
          }
          setUser({ username: "local-demo", displayName: localDisplayName() });
        },
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
