import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  secure: process.env.SMTP_SECURE === "true", // 465 = true
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

type MailOptions = {
  to: string;
  subject: string;
  text: string;
};

export async function sendOrderMail({ to, subject, text }: MailOptions) {
  if (!process.env.SMTP_USER) {
    console.warn("SMTP_USER nicht gesetzt, Mail wird nicht verschickt");
    return;
  }

  await transporter.sendMail({
    from: `"4aCe Shop" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
  });
}
