// app/mollie/return/page.tsx
import { Suspense } from "react";
import MollieReturnClient from "./MollieReturnClient";

export const dynamic = "force-dynamic";

export default function MollieReturnPage() {
  return (
    <div className="max-w-2xl space-y-3">
      <Suspense
        fallback={
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-white">
              Zahlung wird geprüft
            </h1>
            <p className="text-sm text-slate-300">
              Bitte einen Moment...
            </p>
          </div>
        }
      >
        <MollieReturnClient />
      </Suspense>
    </div>
  );
}
