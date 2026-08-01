"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import { Upload, Send, FileText, Sparkles, Mic } from "lucide-react";

export default function NotesPage() {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "👋 Hi! Upload your notes and ask me anything.",
    },
  ]);

  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: input,
      },
      {
        sender: "ai",
        text: "This is a demo response. In the final version, Amazon Bedrock will answer using your uploaded notes.",
      },
    ]);

    setInput("");
  };

  return (
    <AppShell
      title="Notes Assistant"
      subtitle="Upload notes and chat with your personal AI tutor."
    >
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Upload Section */}
        <div className="space-y-4">
          <div className="card">
            <h2 className="text-sm font-bold mb-3">Upload Notes</h2>

            <div className="border-2 border-dashed border-luna-100/25 rounded-xl p-6 text-center">
              <Upload size={30} className="mx-auto text-luna-100" />

              <p className="mt-3 text-sm font-semibold">
                Drag &amp; Drop Notes
              </p>

              <p className="text-luna-100/50 mt-1 text-xs">PDF, DOCX, PPT</p>

              <button className="mt-4 bg-linear-to-br from-luna-200 to-luna-300 text-white text-xs font-semibold px-4 py-2 rounded-full hover:brightness-110 transition">
                Upload
              </button>
            </div>
          </div>

          {/* Uploaded Files */}
          <div className="card">
            <h2 className="text-sm font-bold mb-3">Uploaded Notes</h2>

            {["DBMS.pdf", "OperatingSystems.pdf", "CN_Notes.pdf"].map(
              (file) => (
                <div
                  key={file}
                  className="flex items-center gap-2.5 border border-luna-100/10 rounded-xl px-3 py-2.5 mb-2 text-sm"
                >
                  <FileText size={16} className="text-red-400 shrink-0" />
                  <span className="truncate">{file}</span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Chat */}
        <div className="lg:col-span-2 card flex flex-col h-[560px]">
          <div className="flex items-center gap-2.5 border-b border-luna-100/10 pb-3">
            <Sparkles size={17} className="text-luna-100" />
            <h2 className="text-base font-bold">AI Notes Chat</h2>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-md px-4 py-2.5 rounded-2xl text-sm leading-6 ${
                    msg.sender === "user"
                      ? "bg-linear-to-br from-luna-200 to-luna-300 text-white"
                      : "bg-white/5 border border-luna-100/10"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t border-luna-100/10 pt-4 flex gap-2.5">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask something about your notes..."
              className="flex-1 glass-input rounded-full px-4 py-2.5 text-sm"
            />

            <button className="bg-white/5 border border-luna-100/10 px-3.5 rounded-full hover:bg-white/10 transition">
              <Mic size={16} />
            </button>

            <button
              onClick={sendMessage}
              className="bg-linear-to-br from-luna-200 to-luna-300 text-white px-5 rounded-full hover:brightness-110 transition"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
