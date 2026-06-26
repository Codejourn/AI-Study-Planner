"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import {
  Upload,
  Send,
  FileText,
  Sparkles,
  Mic,
} from "lucide-react";

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
    <div className="flex min-h-screen bg-slate-50">

      <Sidebar />

      <main className="ml-64 flex-1 p-10">

        <div className="mb-10">

          <h1 className="text-4xl font-bold">
            Notes Assistant 📚
          </h1>

          <p className="text-gray-500 mt-2">
            Upload notes and chat with your personal AI tutor.
          </p>

        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Upload Section */}

          <div className="space-y-6">

            <div className="card">

              <h2 className="text-xl font-bold mb-5">
                Upload Notes
              </h2>

              <div className="border-2 border-dashed border-indigo-300 rounded-2xl p-10 text-center">

                <Upload
                  size={42}
                  className="mx-auto text-indigo-600"
                />

                <p className="mt-4 font-semibold">
                  Drag & Drop Notes
                </p>

                <p className="text-gray-500 mt-2 text-sm">
                  PDF, DOCX, PPT
                </p>

                <button className="mt-6 bg-indigo-600 text-white px-5 py-3 rounded-xl">
                  Upload
                </button>

              </div>

            </div>

            {/* Uploaded Files */}

            <div className="card">

              <h2 className="text-xl font-bold mb-6">
                Uploaded Notes
              </h2>

              {[
                "DBMS.pdf",
                "OperatingSystems.pdf",
                "CN_Notes.pdf",
              ].map((file) => (
                <div
                  key={file}
                  className="flex items-center gap-3 border rounded-xl p-4 mb-3"
                >
                  <FileText className="text-red-500" />

                  <span>{file}</span>

                </div>
              ))}

            </div>

          </div>

          {/* Chat */}

          <div className="lg:col-span-2 card flex flex-col h-[720px]">

            <div className="flex items-center gap-3 border-b pb-4">

              <Sparkles className="text-indigo-600" />

              <h2 className="text-2xl font-bold">
                AI Notes Chat
              </h2>

            </div>

            {/* Messages */}

            <div className="flex-1 overflow-y-auto py-6 space-y-5">

              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-lg px-5 py-4 rounded-2xl ${
                      msg.sender === "user"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

            </div>

            {/* Input */}

            <div className="border-t pt-5 flex gap-3">

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask something about your notes..."
                className="flex-1 border rounded-xl px-5 py-4 outline-none"
              />

              <button className="bg-gray-100 px-4 rounded-xl">

                <Mic />

              </button>

              <button
                onClick={sendMessage}
                className="bg-indigo-600 text-white px-6 rounded-xl"
              >
                <Send />
              </button>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}