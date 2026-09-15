"use client";

import { Loader2, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ItemForm() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"movie" | "serial" | "book">("movie");
  const [loading, setLoading] = useState(false);
  const t = useTranslations("ItemForm");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);

    let coverUrl: string | null = null;
    let plot: string | null = null;
    let finalTitle = title;

    try {
      if (type === "movie" || type === "serial") {
        const res = await fetch(`/api/omdb?title=${encodeURIComponent(title)}&type=${type}`);
        const data = await res.json();
        if (data.Response !== "False") {
          finalTitle = data.Title || title;
          coverUrl = data.Poster && data.Poster !== "N/A" ? data.Poster.replace(/^http:/, "https:") : null;
          plot = data.Plot !== "N/A" ? data.Plot : null;
        }
      } else if (type === "book") {
        const res = await fetch(`/api/openlibrary?title=${encodeURIComponent(title)}`);
        if (res.ok) {
          const data = await res.json();
          coverUrl = data.coverUrl;
          plot = data.plot;
        }
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }

    await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: finalTitle, type, coverUrl, plot, status: "planned" }),
    });

    setTitle("");
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={t(`placeholder_${type}`)}
        className="bg-[#121214] border border-zinc-800 text-zinc-100 placeholder-zinc-500 rounded-lg px-4 py-2 flex-1 focus:outline-none focus:border-zinc-600 text-sm transition-colors"
        disabled={loading}
      />
      
      <select
        value={type}
        onChange={(e) => setType(e.target.value as "movie" | "serial" | "book")}
        className="bg-[#121214] border border-zinc-800 text-zinc-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-zinc-600 cursor-pointer"
        disabled={loading}
      >
        <option value="movie">{t("movie")}</option>
        <option value="serial">{t("serial")}</option>
        <option value="book">{t("book")}</option>
      </select>

      <button
        type="submit"
        disabled={loading}
        className="bg-zinc-100 hover:bg-white text-zinc-950 font-medium px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
        {loading ? t("searching") : t("addButton")}
      </button>
    </form>
  );
}