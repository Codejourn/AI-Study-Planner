"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import { useStudy } from "@/context/StudyContext";

interface Props {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AppShell({ children, title, subtitle }: Props) {
  const { user, loading } = useAuth();
  const { data, storageError, cloud, saving, dirty, saveCloud } = useStudy();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          role="status"
          aria-label="Loading"
          className="w-8 h-8 rounded-full border-2 border-luna-100/20 border-t-luna-100 animate-spin"
        />
      </div>
    );
  }

  return (
    <div className="app-frame">
      <Sidebar />
      <div className="app-content">
        <TopBar title={title} subtitle={subtitle} />
        <div className="save-bar">
          <p className="text-[10px] text-muted">
            {cloud
              ? dirty
                ? "You have unsaved changes"
                : "Everything is up to date"
              : "Saved on this device"}
          </p>
          {cloud && (
            <button
              className="action shrink-0"
              disabled={saving || !dirty}
              onClick={() => void saveCloud()}
            >
              {saving
                ? "Saving..."
                : dirty
                  ? "Save to cloud"
                  : "Saved to cloud"}
            </button>
          )}
        </div>
        {storageError && (
          <div className="mb-4">
            <p role="alert" className="text-[#926331]">
              {storageError}
            </p>
            <button
              className="action mt-2"
              onClick={() => {
                const url = URL.createObjectURL(
                  new Blob([JSON.stringify(data, null, 2)], {
                    type: "application/json",
                  }),
                );
                const link = document.createElement("a");
                link.href = url;
                link.download = "focusgeek-workspace.json";
                link.click();
                URL.revokeObjectURL(url);
              }}
            >
              Export current workspace
            </button>
          </div>
        )}
        <main>{children}</main>
      </div>
    </div>
  );
}
