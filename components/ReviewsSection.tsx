// components/ReviewsSection.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { StarRating } from "@/components/StarRating";
import { isValidEmail } from "@/lib/validators";

type Review = {
  id: string | number;
  productId?: string;
  rating: number;
  title?: string | null;
  text?: string | null;
  name?: string | null;
  email?: string | null;
  createdAt: string;
};

export function ReviewsSection({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Form
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const average = useMemo(() => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }, [reviews]);

  const localKey = useMemo(() => {
    const e = (email || "").trim().toLowerCase();
    // Falls keine Mail: trotzdem pro Produkt einen soft lock
    return e ? `reviewed_${productId}_${e}` : `reviewed_${productId}`;
  }, [productId, email]);

  async function load() {
    try {
      setLoading(true);
      setErr(null);

      const res = await fetch(
        `/api/reviews/list?productId=${encodeURIComponent(productId)}`
      );
      const json = await res.json();

      if (!res.ok || !json.success) throw new Error("list failed");
      setReviews((json.reviews ?? []) as Review[]);
    } catch {
      setErr("Bewertungen konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    const safeEmail = email.trim();

    // ✅ E-Mail Check (damit "aa" nicht zählt)
    if (!safeEmail) {
      setErr("Bitte gib eine E-Mail-Adresse an (für die 1x-Bewertung).");
      return;
    }
    if (!isValidEmail(safeEmail)) {
      setErr("Bitte gib eine gültige E-Mail-Adresse ein.");
      return;
    }

    // ✅ Local Soft-Lock (zusätzlich zur Server-Logik)
    if (typeof window !== "undefined") {
      const already = localStorage.getItem(localKey);
      if (already) {
        setErr("Du hast dieses Produkt bereits bewertet.");
        return;
      }
    }

    try {
      const res = await fetch("/api/reviews/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          rating,
          title,
          text,
          name,
          email: safeEmail,
        }),
      });

      if (res.status === 409) {
        setErr("Du hast dieses Produkt bereits bewertet.");
        return;
      }

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error("create failed");

      if (typeof window !== "undefined") {
        localStorage.setItem(localKey, "1");
      }

      // Reset
      setTitle("");
      setText("");
      // rating lassen wie gewählt
      // name/email lassen optional

      await load();
    } catch {
      setErr("Bewertung konnte nicht gespeichert werden.");
    }
  }

  return (
    <div className="border border-slate-800 rounded-2xl p-4 bg-black/60 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Bewertungen</h3>
          <div className="flex items-center gap-2 mt-1">
            <StarRating value={average} readonly size={14} />
            <span className="text-[11px] text-slate-400">
              {reviews.length} Rezension{reviews.length === 1 ? "" : "en"}
              {reviews.length ? ` · Ø ${average}` : ""}
            </span>
          </div>
        </div>
      </div>

      {loading && <p className="text-xs text-slate-500">Lade Bewertungen…</p>}
      {err && <p className="text-xs text-red-400">{err}</p>}

      {/* Liste */}
      {!loading && !reviews.length && (
        <p className="text-xs text-slate-500">Noch keine Bewertungen.</p>
      )}

      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="border border-slate-800 rounded-xl p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs text-slate-200 font-semibold">
                {r.title || "Bewertung"}
              </p>
              <p className="text-[10px] text-slate-500">
                {r.createdAt
                  ? new Date(r.createdAt).toLocaleDateString("de-DE")
                  : ""}
              </p>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] text-slate-400">
                {r.name || "Anonym"}
              </span>
              <span className="text-[10px] text-slate-600">•</span>
              <StarRating value={Number(r.rating) || 0} readonly size={14} />
            </div>

            {r.text && (
              <p className="text-[12px] text-slate-200 mt-2 whitespace-pre-line">
                {r.text}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="pt-3 border-t border-slate-800 space-y-3"
      >
        <p className="text-xs text-slate-300 font-semibold">Deine Bewertung</p>

        {/* Sterne */}
        <div className="flex items-center gap-2">
          <label className="text-[11px] text-slate-400">Deine Sterne:</label>
          <StarRating value={rating} onChange={setRating} />
        </div>

        <div className="grid sm:grid-cols-2 gap-2">
          <input
            className="rounded-md bg-slate-950 border border-slate-700 px-2 py-1 text-xs text-slate-100"
            placeholder="Name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="rounded-md bg-slate-950 border border-slate-700 px-2 py-1 text-xs text-slate-100"
            placeholder="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <input
          className="w-full rounded-md bg-slate-950 border border-slate-700 px-2 py-1 text-xs text-slate-100"
          placeholder="Titel (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full min-h-[90px] rounded-md bg-slate-950 border border-slate-700 px-2 py-1 text-xs text-slate-100"
          placeholder="Dein Text (optional)"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          className="text-xs px-4 py-2 rounded-full border border-white/80 bg-white text-black font-semibold tracking-wide uppercase hover:bg-transparent hover:text-white transition-all"
          type="submit"
        >
          Bewertung absenden
        </button>

        <p className="text-[10px] text-slate-500">
          Hinweis: Pro Produkt ist nur eine Bewertung pro E-Mail erlaubt.
        </p>
      </form>
    </div>
  );
}
