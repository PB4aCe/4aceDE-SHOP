// components/BlackWeekBanner.tsx

export function BlackWeekBanner() {
  return (
    <div className="border border-red-600/60 rounded-2xl bg-gradient-to-r from-black via-slate-900 to-black px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[0_0_24px_rgba(248,113,113,0.35)]">
      <div className="flex items-center gap-3">
        <div className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full rounded-full bg-red-500/60 opacity-70 animate-ping" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] uppercase tracking-[0.35em] text-slate-300">
            4aCe Black Week
          </span>
          <span className="text-xs text-slate-300">
            Nur für kurze Zeit · Neueröffnung · Limitierte Kontingente
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center sm:items-end leading-tight text-slate-50">
        <span className="text-[10px] uppercase tracking-[0.25em] text-slate-400">
          BLACK WEEK
        </span>
        <div className="flex gap-2 items-baseline">
          <span className="text-xl font-extrabold bw-blink-1">BLACK</span>
          <span className="text-xl font-extrabold bw-blink-2">WEEK</span>
          <span className="text-sm uppercase tracking-[0.15em] text-slate-300 ml-1">
            bis zu
          </span>
          <span className="text-2xl font-extrabold text-red-400 bw-blink-3">
            -40%
          </span>
        </div>
      </div>
    </div>
  );
}
