"use client";

import { useEffect, useMemo, useState } from "react";

type Order = {
  id: number;
  order_number: string;
  payment_method: string;
  status: string;
  total_amount: number | null;
  currency: string | null;
  billing_first_name: string | null;
  billing_last_name: string | null;
  billing_email: string | null;
  created_at?: string;
};

export default function AdminOrdersPage() {
  const [keyInput, setKeyInput] = useState("");
  const [adminKey, setAdminKey] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sobald adminKey gesetzt → Bestellungen laden
  useEffect(() => {
    if (!adminKey) return;

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/admin/orders?limit=200", {
          headers: {
            "x-admin-key": adminKey,
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            setError("Falscher Admin-Key.");
            setAdminKey(null);
            return;
          }
          throw new Error("Fehler beim Laden der Bestellungen.");
        }

        const json = await res.json();
        setOrders(json.orders ?? []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Unbekannter Fehler.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [adminKey]);

  // Kennzahlen berechnen
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const paidOrders = orders.filter((o) => o.status === "paid").length;
    const pendingOrders = orders.filter((o) => o.status !== "paid").length;
    const totalRevenue = orders.reduce((sum, o) => {
      if (o.status === "paid" && typeof o.total_amount === "number") {
        return sum + o.total_amount;
      }
      return sum;
    }, 0);

    return { totalOrders, paidOrders, pendingOrders, totalRevenue };
  }, [orders]);

  // Noch nicht „eingeloggt“ → Admin-Key abfragen
  if (!adminKey) {
    return (
      <div className="max-w-sm mx-auto space-y-4">
        <h1 className="text-2xl font-bold">Admin – Bestellungen</h1>
        <p className="text-sm text-slate-300">
          Bitte Admin-Schlüssel eingeben, um die Bestellungen einzusehen.
        </p>
        <input
          type="password"
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
          className="w-full rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-slate-100"
          placeholder="Admin-Key"
        />
        <button
          onClick={() => {
            if (!keyInput.trim()) return;
            setAdminKey(keyInput.trim());
          }}
          className="text-xs px-4 py-2 rounded-full border border-white bg-white text-black font-semibold tracking-wide uppercase hover:bg-transparent hover:text-white transition-all"
        >
          Anmelden
        </button>
        {error && (
          <p className="text-xs text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }

  // Admin-Ansicht
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Bestellübersicht</h1>
          <p className="text-xs text-slate-400">
            Interne Auswertung – nur für 4aCe.
          </p>
        </div>
        <button
          onClick={() => {
            setAdminKey(null);
            setKeyInput("");
            setOrders([]);
          }}
          className="text-[11px] px-3 py-1 rounded-full border border-slate-600 text-slate-300 hover:border-slate-200 hover:bg-slate-900 transition-all"
        >
          Abmelden
        </button>
      </header>

      {/* Kennzahlen */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="border border-slate-800 rounded-xl p-4 bg-black/60">
          <p className="text-[11px] text-slate-400 mb-1">Bestellungen gesamt</p>
          <p className="text-xl font-semibold text-white">
            {stats.totalOrders}
          </p>
        </div>
        <div className="border border-slate-800 rounded-xl p-4 bg-black/60">
          <p className="text-[11px] text-slate-400 mb-1">Bezahlt (PayPal)</p>
          <p className="text-xl font-semibold text-emerald-400">
            {stats.paidOrders}
          </p>
        </div>
        <div className="border border-slate-800 rounded-xl p-4 bg-black/60">
          <p className="text-[11px] text-slate-400 mb-1">Offen (z.B. Vorkasse)</p>
          <p className="text-xl font-semibold text-amber-400">
            {stats.pendingOrders}
          </p>
        </div>
        <div className="border border-slate-800 rounded-xl p-4 bg-black/60">
          <p className="text-[11px] text-slate-400 mb-1">Umsatz (bezahlt)</p>
          <p className="text-xl font-semibold text-slate-50">
            {stats.totalRevenue.toFixed(2).replace(".", ",")} €
          </p>
        </div>
      </section>

      {/* Liste */}
      <section className="border border-slate-800 rounded-xl bg-black/60 overflow-hidden">
        <div className="border-b border-slate-800 px-4 py-2 flex justify-between items-center">
          <p className="text-xs text-slate-300">
            Letzte {orders.length} Bestellungen
          </p>
          {loading && (
            <span className="text-[11px] text-slate-400">
              Lade…
            </span>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead className="bg-slate-950/70 border-b border-slate-800">
              <tr className="text-left text-[11px] text-slate-400">
                <th className="px-4 py-2">#</th>
                <th className="px-4 py-2">Datum</th>
                <th className="px-4 py-2">Bestellnummer</th>
                <th className="px-4 py-2">Kunde</th>
                <th className="px-4 py-2">E-Mail</th>
                <th className="px-4 py-2">Zahlart</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2 text-right">Betrag</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const fullName =
                  [o.billing_first_name, o.billing_last_name]
                    .filter(Boolean)
                    .join(" ") || "–";

                const dateText = o.created_at
                  ? new Date(o.created_at).toLocaleString("de-DE")
                  : "–";

                const amountText =
                  typeof o.total_amount === "number"
                    ? `${o.total_amount
                        .toFixed(2)
                        .replace(".", ",")} ${o.currency || "EUR"}`
                    : "–";

                const paymentLabel =
                  o.payment_method === "paypal"
                    ? "PayPal"
                    : o.payment_method === "vorkasse"
                    ? "Vorkasse"
                    : o.payment_method || "-";

                const statusLabel =
                  o.status === "paid"
                    ? "Bezahlt"
                    : o.status === "pending"
                    ? "Offen"
                    : o.status || "-";

                const statusColor =
                  o.status === "paid"
                    ? "text-emerald-400"
                    : o.status === "pending"
                    ? "text-amber-400"
                    : "text-slate-300";

                return (
                  <tr
                    key={o.id}
                    className="border-b border-slate-900/60 hover:bg-slate-900/40"
                  >
                    <td className="px-4 py-2 text-slate-500">{o.id}</td>
                    <td className="px-4 py-2 text-slate-200">{dateText}</td>
                    <td className="px-4 py-2 text-slate-100 font-mono text-[11px]">
                      {o.order_number}
                    </td>
                    <td className="px-4 py-2 text-slate-100">{fullName}</td>
                    <td className="px-4 py-2 text-slate-300">
                      {o.billing_email || "–"}
                    </td>
                    <td className="px-4 py-2 text-slate-300">
                      {paymentLabel}
                    </td>
                    <td className={`px-4 py-2 ${statusColor}`}>
                      {statusLabel}
                    </td>
                    <td className="px-4 py-2 text-right text-slate-100">
                      {amountText}
                    </td>
                  </tr>
                );
              })}

              {orders.length === 0 && !loading && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-6 text-center text-slate-400"
                  >
                    Noch keine Bestellungen vorhanden.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {error && (
        <p className="text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
