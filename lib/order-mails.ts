import { sendOrderMail } from "@/lib/mail";

type Customer = {
  firstName?: string;
  lastName?: string;
  email: string;
  street?: string;
  zip?: string;
  city?: string;
  country?: string;
};

type Item = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type OrderMailPayload = {
  orderNumber: string;
  customer: Customer;
  items: Item[];
  total: number;
  paymentMethod: "mollie" | "paypal" | "vorkasse";
  couponCode?: string | null;
  molliePaymentId?: string;
};

function money(n: number) {
  return `${n.toFixed(2).replace(".", ",")} €`;
}

function itemsText(items: Item[]) {
  if (!items?.length) return "Keine Artikel übermittelt.";
  return items
    .map(
      (i) =>
        `- ${i.name} × ${i.quantity} = ${money(i.price * i.quantity)}`
    )
    .join("\n");
}

export async function sendCustomerConfirmationMail(payload: OrderMailPayload) {
  const name = `${payload.customer.firstName ?? ""} ${
    payload.customer.lastName ?? ""
  }`.trim();

  const text = `
Hallo ${name || "👋"},

vielen Dank für deine Bestellung bei 4aCe!

Bestellnummer: ${payload.orderNumber}
Zahlungsart: ${payload.paymentMethod.toUpperCase()}

Artikel:
${itemsText(payload.items)}

Gesamtbetrag: ${money(payload.total)}
${payload.couponCode ? `Gutschein: ${payload.couponCode}\n` : ""}

Du erhältst in Kürze weitere Infos zur Abwicklung.
Wenn du Fragen hast, antworte einfach auf diese E-Mail.

Liebe Grüße
4aCe Shop
  `.trim();

  await sendOrderMail({
    to: payload.customer.email,
    subject: `4aCe Bestellbestätigung – ${payload.orderNumber}`,
    text,
  });
}

export async function sendInternalOrderNotification(
  payload: OrderMailPayload
) {
  const internalTo =
    process.env.INTERNAL_ORDER_MAIL || process.env.SMTP_USER;

  const c = payload.customer;

  const text = `
NEUE BESTELLUNG (Mollie)

Bestellnummer: ${payload.orderNumber}
Zahlungsart: ${payload.paymentMethod}
${payload.molliePaymentId ? `Mollie Payment ID: ${payload.molliePaymentId}\n` : ""}

Kundendaten:
${c.firstName ?? ""} ${c.lastName ?? ""}
${c.email ?? "-"}
${c.street ?? ""}
${c.zip ?? ""} ${c.city ?? ""}
${c.country ?? ""}

Artikel:
${itemsText(payload.items)}

Gesamtbetrag: ${money(payload.total)}
${payload.couponCode ? `Gutschein: ${payload.couponCode}\n` : ""}
  `.trim();

  await sendOrderMail({
    to: internalTo!,
    subject: `🧾 Neue Bestellung – ${payload.orderNumber}`,
    text,
  });
}
