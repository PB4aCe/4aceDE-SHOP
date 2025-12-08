"use client";

import React from "react";

type StarRatingProps = {
  value: number; // 0-5
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: number; // px
  className?: string;
};

const STAR_PATH =
  "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";

export function StarRating({
  value,
  onChange,
  readonly = false,
  size = 18,
  className = "",
}: StarRatingProps) {
  const rounded = Math.max(0, Math.min(5, value));

  function handleClick(i: number) {
    if (readonly) return;
    onChange?.(i);
  }

  function handleKey(e: React.KeyboardEvent<HTMLButtonElement>, i: number) {
    if (readonly) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onChange?.(i);
    }
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= rounded;

        return (
          <button
            key={i}
            type="button"
            aria-label={`${i} Sterne`}
            onClick={() => handleClick(i)}
            onKeyDown={(e) => handleKey(e, i)}
            disabled={readonly}
            className={[
              "transition-transform",
              readonly ? "cursor-default" : "cursor-pointer hover:scale-105",
              "focus:outline-none focus:ring-1 focus:ring-white/30 rounded-sm",
            ].join(" ")}
            style={{ lineHeight: 0 }}
          >
            <svg
              width={size}
              height={size}
              viewBox="0 0 24 24"
              className={filled ? "text-amber-400" : "text-slate-600"}
              fill="currentColor"
            >
              <path d={STAR_PATH} />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
