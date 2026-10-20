"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Search, ChevronDown, BookOpen, FileText, Pencil } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useStudy } from "@/context/StudyContext";
import { useClickOutside } from "@/hooks/useClickOutside";
interface Props {
  title?: string;
  subtitle?: string;
}
export default function TopBar({ title, subtitle }: Props) {
  const { user, logout, saveDisplayName } = useAuth();
  const { data } = useStudy();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [query, setQuery] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  useClickOutside(menuRef, () => setMenuOpen(false));
  useClickOutside(searchRef, () => setQuery(""));
  const name = user?.displayName?.trim() || "Student";
  async function handleNameSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingName(true);
    setProfileMessage("");
    try {
      await saveDisplayName(draftName);
      setEditingName(false);
      setProfileMessage("Display name saved.");
    } catch (error) {
      setProfileMessage(error instanceof Error ? error.message : "Could not save your display name.");
    } finally {
      setSavingName(false);
    }
  }
  const matches = query.trim()
    ? [
        ...data.subjects.map((s) => ({
          id: s.id,
          name: s.name,
          kind: "Subject",
          href: "/planner",
        })),
        ...data.notes.map((n) => ({
          id: n.id,
          name: n.name,
          kind: "Note",
          href: "/notes",
        })),
      ]
        .filter((r) =>
          r.name.toLowerCase().includes(query.trim().toLowerCase()),
        )
        .slice(0, 6)
    : [];
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow mb-2">
          {title === "Dashboard"
            ? "Make room for a good day"
            : "Your learning workspace"}
        </p>
        <h1 aria-label={title}>
          {title === "Dashboard" ? `HELLO, ${name.toUpperCase()}!` : title}
        </h1>
        {subtitle && title !== "Dashboard" && (
          <p className="text-xs text-muted mt-1.5">{subtitle}</p>
        )}
      </div>
      <div className="topbar-actions">
        <div className="workspace-search" ref={searchRef}>
          <label className="search-pill">
            <Search size={15} className="text-muted shrink-0" />
            <input
              aria-label="Search subjects and notes"
              placeholder="Search your workspace"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setQuery("");
              }}
              className="bg-transparent outline-none text-xs w-full min-w-0 placeholder:text-[#9b8e9c]"
            />
          </label>
          {query.trim() && (
            <div className="search-results">
              {matches.length ? (
                matches.map((r) => (
                  <Link
                    key={`${r.kind}-${r.id}`}
                    href={r.href}
                    onClick={() => setQuery("")}
                    className="flex items-center gap-2 rounded-xl p-2.5 hover:bg-[#e9dfe8]"
                  >
                    {r.kind === "Subject" ? (
                      <BookOpen size={14} />
                    ) : (
                      <FileText size={14} />
                    )}
                    <span className="text-xs truncate flex-1">{r.name}</span>
                    <span className="text-[9px] text-muted">{r.kind}</span>
                  </Link>
                ))
              ) : (
                <p className="text-xs text-muted p-3">
                  No subjects or notes found.
                </p>
              )}
            </div>
          )}
        </div>
        <div className="relative" ref={menuRef}>
          <button
            aria-label="Account menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((p) => !p)}
            className="flex items-center gap-1.5"
          >
            <span className="avatar w-8! h-8! border-2! text-sm!">
              {name[0].toUpperCase()}
            </span>
            <ChevronDown size={12} className="text-muted" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-3 w-64 max-w-[calc(100vw-24px)] bg-[#f8f4ec] border border-[#d6cad6] rounded-2xl p-2 z-50 shadow-lg">
              <div className="px-3 py-3 border-b border-[#e1d6df]">
                <p className="text-xs font-semibold truncate">{name}</p>
                <p className="text-[11px] truncate text-muted mt-1">{user?.email ?? "Local workspace"}</p>
              </div>
              {editingName ? (
                <form onSubmit={(event) => void handleNameSave(event)} className="px-3 py-3 space-y-2">
                  <label htmlFor="profile-display-name" className="text-xs font-medium">Display name</label>
                  <input
                    id="profile-display-name"
                    className="field mt-1"
                    required
                    autoFocus
                    maxLength={60}
                    value={draftName}
                    onChange={(event) => setDraftName(event.target.value)}
                  />
                  <div className="flex items-center gap-3">
                    <button className="action" type="submit" disabled={savingName}>{savingName ? "Saving..." : "Save name"}</button>
                    <button type="button" className="text-xs text-muted" onClick={() => { setEditingName(false); setProfileMessage(""); }}>Cancel</button>
                  </div>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => { setDraftName(name); setEditingName(true); setProfileMessage(""); }}
                  className="flex items-center gap-2 px-3 py-3 w-full rounded-xl text-xs hover:bg-[#e9dfe8]"
                >
                  <Pencil size={14} />
                  Edit display name
                </button>
              )}
              {profileMessage && <p role="status" className="px-3 pb-2 text-xs text-[#755b79]">{profileMessage}</p>}
              <button
                onClick={async () => {
                  await logout();
                  router.push("/login");
                }}
                className="flex items-center gap-2 px-3 py-3 w-full rounded-xl text-xs hover:bg-[#e9dfe8]"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
