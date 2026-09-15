"use client";

import { BookOpen, Edit2, Film, Trash2, Tv } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type Item = {
  id: string;
  title: string;
  type: "movie" | "serial" | "book";
  status: "completed" | "in_progress" | "planned";
  plot?: string | null;
  coverUrl?: string | null;
};

const typeBadgeStyles: Record<Item["type"], string> = {
  movie: "bg-blue-950/80 text-blue-400 border-blue-800/40",
  serial: "bg-purple-950/80 text-purple-400 border-purple-800/40",
  book: "bg-emerald-950/80 text-emerald-400 border-emerald-800/40",
};

const statusBadgeStyles: Record<Item["status"], string> = {
  completed: "bg-emerald-950/40 text-emerald-500 border-emerald-900/50",
  in_progress: "bg-amber-950/40 text-amber-500 border-amber-900/50",
  planned: "bg-zinc-800/40 text-zinc-400 border-zinc-700/50",
};

export function ItemCard({
  item,
  viewMode = "grid",
}: {
  item: Item;
  viewMode?: "grid" | "list";
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(item.title);
  const router = useRouter();
  const t = useTranslations("ItemCard");

  const getStatusLabel = () => {
    if (item.status === "planned") return t("statusPlanned");
    if (item.status === "in_progress") {
      return item.type === "book" ? t("statusReading") : t("statusWatching");
    }
    if (item.status === "completed") {
      return item.type === "book" ? t("statusRead") : t("statusWatched");
    }
    return "";
  };

  async function handleDelete() {
    if (!confirm(t("confirmDelete"))) return;
    await fetch(`/api/items/${item.id}`, { method: "DELETE" });
    router.refresh();
  }

  async function handleSave() {
    await fetch(`/api/items/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, type: item.type }),
    });
    setIsEditing(false);
    router.refresh();
  }

  const TypeIcon = item.type === "book" ? BookOpen : item.type === "serial" ? Tv : Film;

  if (isEditing) {
    return (
      <div className="bg-[#121214] border border-zinc-800 rounded-xl p-4 flex gap-3 items-center">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-1.5 flex-1 focus:outline-none focus:border-zinc-500 text-sm"
        />
        <button
          onClick={handleSave}
          className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
        >
          {t("save")}
        </button>
        <button
          onClick={() => setIsEditing(false)}
          className="text-zinc-400 hover:text-zinc-200 text-sm transition-colors"
        >
          {t("cancel")}
        </button>
      </div>
    );
  }

  return (
    <div
      className={`bg-[#121214] border border-zinc-800/80 rounded-xl p-4 flex gap-4 transition-all hover:border-zinc-700/80 shadow-lg ${
        viewMode === "list" ? "items-center" : "items-start"
      }`}
    >
      <div className="w-16 h-22 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
        {item.coverUrl ? (
          <img src={item.coverUrl} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <TypeIcon className="w-6 h-6 text-zinc-600" />
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between h-full">
        <div>
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-semibold text-zinc-100 text-base leading-tight truncate">
              {item.title}
            </h3>
            <span
              className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${
                typeBadgeStyles[item.type] || typeBadgeStyles.movie
              }`}
            >
              {item.type}
            </span>
          </div>

          {item.plot && (
            <p className="text-xs text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed">
              {item.plot}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between mt-4">
          <span
            className={`text-xs font-medium px-2.5 py-1 rounded-md border ${
              statusBadgeStyles[item.status] || statusBadgeStyles.planned
            }`}
          >
            {getStatusLabel()}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 rounded-lg transition-colors"
              title={t("edit")}
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 text-zinc-400 hover:text-red-400 border border-zinc-800 hover:border-zinc-700 bg-zinc-900/50 rounded-lg transition-colors"
              title={t("delete")}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}