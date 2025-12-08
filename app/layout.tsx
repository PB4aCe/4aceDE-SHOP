import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import Link from "next/link";
import Image from "next/image";
import { CartNavButton } from "@/components/CartNavButton";
import { AddedToCartToast } from "@/components/AddedToCartToast";
import { RemovedFromCartToast } from "@/components/RemovedFromCartToast";

export const metadata: Metadata = {
  title: "4aCe Shop",
  description: "Online-Shop mit PayPal-Checkout",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className="min-h-screen bg-black text-slate-100">
        {/* Hintergrund */}
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-black via-slate-950 to-black" />
        <div className="fixed -z-10 blur-3xl opacity-30 pointer-events-none">
          <div className="w-[480px] h-[480px] rounded-full bg-white/5 absolute -top-40 -left-40" />
          <div className="w-[420px] h-[420px] rounded-full bg-white/3 absolute bottom-[-200px] right-[-200px]" />
        </div>

        <CartProvider>
          {/* Header */}
          <header className="border-b border-slate-800/80 bg-black/80 backdrop-blur-md sticky top-0 z-20">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center gap-3"
                aria-label="4aCe Shop – Startseite"
              >
                <div className="h-16 w-auto flex items-center">
                  <Image
                    src="/logo-4ace-shop.png"
                    alt="4aCe Shop"
                    width={320}
                    height={64}
                    className="h-16 w-auto object-contain"
                    priority
                  />
                </div>
              </Link>

              <nav className="flex items-center gap-4 text-xs">
                <Link
                  href="/"
                  className="hidden sm:inline text-slate-300 hover:text-white transition-colors"
                >
                  Start
                </Link>
                <Link
                  href="/products"
                  className="hidden sm:inline text-slate-300 hover:text-white transition-colors"
                >
                  Produkte
                </Link>
                <Link
                  href="/checkout"
                  className="hidden sm:inline text-slate-300 hover:text-white transition-colors"
                >
                  Kasse
                </Link>
                <Link
    href="/categories"
    className="hidden sm:inline text-slate-300 hover:text-white transition-colors"
  >
    Kategorien
  </Link>
                <CartNavButton />
              </nav>
            </div>
          </header>

          {/* Content */}
          <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>

          {/* Footer mit Trust / Legal */}
          <footer className="border-t border-slate-800/80 bg-black/90 mt-8">
            <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-4 text-[11px] text-slate-300">
                <Link
                  href="https://4ace.de/impressum"
                  className="hover:text-white transition-colors"
                  target="_blank"
                >
                  Impressum
                </Link>
                <Link
                  href="https://4ace.de/agb"
                  className="hover:text-white transition-colors"
                  target="_blank"
                >
                  AGB
                </Link>
                <Link
                  href="https://4ace.de/widerrufsbelehrung"
                  className="hover:text-white transition-colors"
                  target="_blank"
                >
                  Widerruf
                </Link>
                <Link
                  href="https://4ace.de/datenschutz"
                  className="hover:text-white transition-colors"
                  target="_blank"
                >
                  Datenschutz
                </Link>
              </div>

              <div className="text-[10px] text-slate-500 leading-relaxed text-right md:text-left">
                <div>
                  Vertragspartner:{" "}
                  <span className="text-slate-300">
                    Publishing by 4aCe (Raoul Rajski)
                  </span>
                </div>
                <div>
                  Zahlungen über PayPal | Mollie (Klarna etc.) (inkl. Käuferschutz) oder Vorkasse ·
                  SSL-verschlüsselter Checkout.
                </div>
              </div>
            </div>
          </footer>

          <AddedToCartToast />
          <RemovedFromCartToast />
        </CartProvider>
      </body>
    </html>
  );
}
