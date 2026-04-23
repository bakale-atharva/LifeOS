"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function Home() {
  const [dummyData, setDummyData] = useState("");
  const [status, setStatus] = useState<{ type: "idle" | "loading" | "success" | "error"; message: string }>({
    type: "idle",
    message: "",
  });

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dummyData.trim()) return;

    setStatus({ type: "loading", message: "INITIALIZING UPLOAD..." });

    try {
      await addDoc(collection(db, "dummy_data"), {
        content: dummyData,
        timestamp: serverTimestamp(),
      });
      setStatus({ type: "success", message: "DATA SYNC COMPLETE" });
      setDummyData("");
      setTimeout(() => setStatus({ type: "idle", message: "" }), 3000);
    } catch (error) {
      console.error("Firebase Error:", error);
      setStatus({ type: "error", message: "SYNC FAILED: CHECK CONFIG" });
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
      <div className="max-w-2xl w-full text-center space-y-12">
        {/* Header Section */}
        <header className="relative py-8">
          <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full" />
          <h1 className="text-7xl font-black italic tracking-tighter neon-text text-white relative">
            LIFE<span className="text-[var(--neon-pink)]">OS</span>
          </h1>
          <p className="text-gray-400 mt-2 font-bold tracking-widest uppercase text-sm">
            Phase 01: Database Link Established
          </p>
        </header>

        {/* Connection Form Section */}
        <section className="gamified-card p-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 text-[10px] text-gray-600 font-mono uppercase">
            System Status: Online
          </div>
          
          <form onSubmit={handleUpload} className="space-y-8 relative z-10">
            <div className="flex flex-col space-y-2">
              <label className="text-left text-xs font-bold text-[var(--neon-blue)] uppercase tracking-widest ml-1">
                Input Dummy Data
              </label>
              <input
                type="text"
                value={dummyData}
                onChange={(e) => setDummyData(e.target.value)}
                placeholder="TYPE SOMETHING TO TEST THE SYNC..."
                className="gamified-input text-lg font-bold"
              />
            </div>

            <button
              type="submit"
              disabled={status.type === "loading"}
              className={`neon-button w-full py-4 px-8 text-xl ${
                status.type === "loading" ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {status.type === "loading" ? "SYNCING..." : "UPLOAD DATA"}
            </button>

            {status.message && (
              <div className={`text-sm font-bold uppercase tracking-widest ${
                status.type === "success" ? "text-green-400" : 
                status.type === "error" ? "text-red-400" : "text-blue-400"
              }`}>
                {status.message}
              </div>
            )}
          </form>

          {/* Decorative Elements */}
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[var(--neon-pink)] opacity-5 blur-3xl rounded-full" />
        </section>

        {/* Footer Info */}
        <footer className="text-[10px] text-gray-500 font-mono flex justify-between w-full border-t border-white/5 pt-4">
          <span>COORDINATES: FIREBASE_FIRESTORE</span>
          <span>STABILITY: EXPERIMENTAL_BUILD</span>
        </footer>
      </div>
    </main>
  );
}
