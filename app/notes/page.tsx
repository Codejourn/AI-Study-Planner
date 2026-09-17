"use client";
import { useState } from "react";
import AppShell from "@/components/AppShell";
import { useStudy } from "@/context/StudyContext";
import { apiRequest } from "@/lib/api";
import { Note } from "@/lib/study";
export default function NotesPage() {
  const { data, update, cloud } = useStudy();
  const [busy, setBusy] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [selected, setSelected] = useState("");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const note = data.notes.find((n) => n.id === selected);
  const matches =
    query.trim() && note
      ? note.content
          .split(/\n\s*\n/)
          .filter((p) => p.toLowerCase().includes(query.toLowerCase()))
          .slice(0, 5)
      : [];
  async function upload(file?: File) {
    if (!file) return;
    if (cloud) {
      if (file.size > 2 * 1024 * 1024) {
        setNotice("Choose a file under 2 MB.");
        return;
      }
      setBusy(true);
      try {
        const encoded = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result).split(",")[1]);
          reader.onerror = () => reject(new Error("Could not read the file."));
          reader.readAsDataURL(file);
        });
        const uploaded = await apiRequest<Note & { truncated: boolean }>(
          "/notes/upload",
          { name: file.name, file: encoded },
        );
        update((d) => ({
          ...d,
          notes: [
            ...d.notes,
            { id: uploaded.id, name: uploaded.name, content: uploaded.content },
          ],
        }));
        setSelected(uploaded.id);
        setAnswer("");
        setNotice(
          `Original stored in S3. Save your workspace to cloud to keep this note's extract.${uploaded.truncated ? " The extract is limited to the first 20,000 characters." : ""}`,
        );
      } catch (e) {
        setNotice(e instanceof Error ? e.message : "Upload failed.");
      } finally {
        setBusy(false);
      }
      return;
    }
    if (!/\.(txt|md)$/i.test(file.name)) {
      setNotice(
        "Local mode supports TXT and Markdown. PDF processing requires cloud setup.",
      );
      return;
    }
    if (file.size > 200000) {
      setNotice("Choose a text file under 200 KB.");
      return;
    }
    try {
      const content = await file.text();
      const id = crypto.randomUUID();
      update((d) => ({
        ...d,
        notes: [...d.notes, { id, name: file.name, content }],
      }));
      setSelected(id);
      setNotice("Note saved in this browser.");
    } catch {
      setNotice("Could not read this file. Please try again.");
    }
  }
  async function ask(e: React.FormEvent) {
    e.preventDefault();
    if (!note || !question.trim()) return;
    setBusy(true);
    setAnswer("");
    try {
      const result = await apiRequest<{ answer: string }>("/notes/ask", {
        content: note.content.slice(0, 20000),
        question,
      });
      setAnswer(result.answer);
    } catch (error) {
      setNotice(
        error instanceof Error
          ? error.message
          : "Could not answer the question.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <AppShell
      title="Notes Assistant"
      subtitle="Keep study notes together and find relevant passages."
    >
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="card space-y-4">
          <h2 className="font-bold">Upload notes</h2>
          <label className="block text-sm">
            {cloud
              ? "PDF, TXT or Markdown · Up to 2 MB"
              : "TXT or Markdown · Up to 200 KB"}
            <input
              className="field"
              disabled={busy}
              type="file"
              accept={cloud ? ".pdf,.txt,.md" : ".txt,.md"}
              onChange={(e) => {
                void upload(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </label>
          {notice && (
            <p role="status" className="text-sm">
              {notice}
            </p>
          )}
          <h2 className="font-bold">Saved notes</h2>
          {!data.notes.length && (
            <p className="text-sm text-muted">
              Upload your first note to get started.
            </p>
          )}
          {data.notes.map((n) => (
            <div key={n.id} className="flex gap-2 justify-between">
              <button
                disabled={busy}
                className={`text-sm truncate ${selected === n.id ? "text-luna-100 font-bold" : ""}`}
                onClick={() => {
                  setSelected(n.id);
                  setQuery("");
                  setAnswer("");
                }}
              >
                {n.name}
              </button>
              <button
                disabled={busy}
                className="text-xs text-red-700"
                onClick={() =>
                  update((d) => ({
                    ...d,
                    notes: d.notes.filter((x) => x.id !== n.id),
                  }))
                }
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="card lg:col-span-2 space-y-4">
          <h2 className="font-bold">{note?.name ?? "Select a note"}</h2>
          <p className="text-sm text-muted">
            {cloud
              ? "Ask Bedrock about the selected note's extracted text."
              : "Local mode shows matching passages from your note. AI explanations and PDF support require Bedrock and S3."}
          </p>
          {cloud && (
            <form onSubmit={ask} className="space-y-3">
              <label className="block text-sm">
                Ask about your notes
                <input
                  className="field"
                  required
                  maxLength={1000}
                  disabled={!note || busy}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </label>
              <button className="action" disabled={!note || busy}>
                {busy ? "Working..." : "Ask AI"}
              </button>
              {answer && (
                <p
                  role="status"
                  className="text-sm whitespace-pre-wrap rounded-xl bg-white/5 p-4"
                >
                  {answer}
                </p>
              )}
            </form>
          )}
          <label className="block text-sm">
            Find a word or phrase
            <input
              className="field"
              disabled={!note}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. normalization"
            />
          </label>
          {query.trim() && note ? (
            matches.length ? (
              matches.map((p, i) => (
                <p
                  className="border border-luna-100/10 rounded-xl p-4 text-sm whitespace-pre-wrap"
                  key={i}
                >
                  {p}
                </p>
              ))
            ) : (
              <p className="text-sm">No matching passages found.</p>
            )
          ) : (
            <pre className="text-sm whitespace-pre-wrap max-h-[500px] overflow-auto">
              {note?.content}
            </pre>
          )}
        </div>
      </div>
    </AppShell>
  );
}
