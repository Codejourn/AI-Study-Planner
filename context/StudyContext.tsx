"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useAuth } from "@/context/AuthContext";
import { emptyStudy, isStudyData, StudyData } from "@/lib/study";
import { apiConfigured, apiRequest } from "@/lib/api";

interface StudyContextValue {
  data: StudyData;
  update: (change: (current: StudyData) => StudyData) => void;
  storageError: string | null;
  cloud: boolean;
  saving: boolean;
  dirty: boolean;
  saveCloud: () => Promise<void>;
}
const StudyContext = createContext<StudyContextValue | null>(null);
function UserStudyProvider({
  storageKey,
  cloud,
  children,
}: {
  storageKey: string;
  cloud: boolean;
  children: ReactNode;
}) {
  const [data, setData] = useState<StudyData>(emptyStudy);
  const [ready, setReady] = useState(false);
  const [revision, setRevision] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedData, setSavedData] = useState<StudyData | null>(null);
  const [storageError, setStorageError] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    async function load() {
      await Promise.resolve();
      try {
        if (cloud) {
          const result = await apiRequest<{
            data: StudyData;
            revision: number;
          }>("/study");
          if (cancelled) return;
          if (!isStudyData(result.data))
            throw new Error("Cloud workspace has invalid data.");
          setData(result.data);
          setSavedData(result.data);
          setRevision(result.revision);
        } else {
          const raw = localStorage.getItem(storageKey);
          if (raw) {
            const stored: unknown = JSON.parse(raw);
            if (isStudyData(stored)) setData(stored);
            else
              throw new Error(
                "Saved data could not be read. Starting with an empty workspace.",
              );
          }
        }
      } catch (error) {
        if (!cancelled)
          setStorageError(
            error instanceof Error ? error.message : "Storage is unavailable.",
          );
      } finally {
        if (!cancelled) setReady(true);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [storageKey, cloud]);
  useEffect(() => {
    if (!ready || (cloud && revision === null)) return;
    let cancelled = false;
    async function cache() {
      await Promise.resolve();
      if (cancelled) return;
      try {
        localStorage.setItem(storageKey, JSON.stringify(data));
      } catch {
        setStorageError(
          "Your changes could not be cached. Browser storage may be full or disabled.",
        );
      }
    }
    void cache();
    return () => {
      cancelled = true;
    };
  }, [data, ready, storageKey, cloud, revision]);
  async function saveCloud() {
    if (!cloud || saving || revision === null) return;
    setSaving(true);
    setStorageError(null);
    try {
      const result = await apiRequest<{ revision: number }>(
        "/study",
        { data, revision },
        "PUT",
      );
      setRevision(result.revision);
      setSavedData(data);
    } catch (error) {
      setStorageError(
        error instanceof Error ? error.message : "Cloud save failed.",
      );
    } finally {
      setSaving(false);
    }
  }
  if (!ready)
    return (
      <p className="p-6" role="status">
        Loading your study workspace...
      </p>
    );
  if (cloud && revision === null)
    return (
      <div className="p-6">
        <p role="alert">Could not load your cloud workspace: {storageError}</p>
        <button
          className="action mt-4"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  return (
    <StudyContext.Provider
      value={{
        data,
        update: setData,
        storageError,
        cloud,
        saving,
        dirty: cloud && data !== savedData,
        saveCloud,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
}
export function StudyProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading || !user)
    return (
      <StudyContext.Provider
        value={{
          data: emptyStudy,
          update: () => {},
          storageError: null,
          cloud: false,
          saving: false,
          dirty: false,
          saveCloud: async () => {},
        }}
      >
        {children}
      </StudyContext.Provider>
    );
  const cloud = apiConfigured && !!user && user.username !== "local-demo";
  const storageKey = `focusgeek:study:v1:${cloud ? "cloud:" : ""}${user?.username ?? "guest"}`;
  return (
    <UserStudyProvider key={storageKey} storageKey={storageKey} cloud={cloud}>
      {children}
    </UserStudyProvider>
  );
}
export function useStudy() {
  const context = useContext(StudyContext);
  if (!context) throw new Error("useStudy must be used inside StudyProvider");
  return context;
}
