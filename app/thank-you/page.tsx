// app/thank-you/page.tsx
import { Suspense } from "react";
import { ThankYouContent } from "./ThankYouContent";

export default function ThankYouPage() {
  return (
    <div className="max-w-4xl space-y-4">
      <Suspense
        fallback={
          <p className="text-sm text-slate-300">
            Deine Bestelldaten werden geladen...
          </p>
        }
      >
        <ThankYouContent />
      </Suspense>
    </div>
  );
}
