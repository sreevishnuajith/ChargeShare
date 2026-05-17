import nodemailer from "nodemailer";
import logger from "./logger.js";

// Mailpit listens on SMTP port 1025 locally — no auth required
const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST ?? "localhost",
  port: parseInt(process.env.MAIL_PORT ?? "1025"),
  secure: false,
  ignoreTLS: true,
});

const FROM = "ChargeShare <noreply@chargeshare.local>";

function formatDate(dt) {
  return new Date(dt).toLocaleString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function sendBookingConfirmation(user, booking, charger) {
  try {
    await transport.sendMail({
      from: FROM,
      to: user.email,
      subject: `ChargeShare: Booking Confirmed — Charger ${charger.label}`,
      text: [
        `Hi ${user.fullName},`,
        ``,
        `Your EV charging booking has been confirmed.`,
        ``,
        `Charger:   ${charger.label} (${charger.location})`,
        `Power:     ${charger.powerKw} kW`,
        `Start:     ${formatDate(booking.startAt)}`,
        `End:       ${formatDate(booking.endAt)}`,
        ``,
        `Please make sure your vehicle is connected before the start time.`,
        `You can cancel your booking at any time before it starts via the ChargeShare app.`,
        ``,
        `— ChargeShare`,
      ].join("\n"),
    });
    logger.info({ userId: user.id, bookingId: booking.id }, "Mailer: booking confirmation sent");
  } catch (err) {
    logger.error({ err, userId: user.id }, "Mailer: failed to send booking confirmation");
  }
}

export async function sendSessionSummary(user, session, booking, charger) {
  try {
    await transport.sendMail({
      from: FROM,
      to: user.email,
      subject: `ChargeShare: Charging Session Complete — ${session.energyKwh.toFixed(2)} kWh`,
      text: [
        `Hi ${user.fullName},`,
        ``,
        `Your charging session has finished.`,
        ``,
        `Charger:      ${charger.label} (${charger.location})`,
        `Started:      ${formatDate(session.startedAt)}`,
        `Ended:        ${formatDate(session.endedAt)}`,
        `Energy used:  ${session.energyKwh.toFixed(2)} kWh`,
        `Cost:         $${session.costAud.toFixed(2)} AUD`,
        ``,
        `This charge will appear on your next monthly invoice.`,
        ``,
        `— ChargeShare`,
      ].join("\n"),
    });
    logger.info({ userId: user.id, sessionId: session.id }, "Mailer: session summary sent");
  } catch (err) {
    logger.error({ err, userId: user.id }, "Mailer: failed to send session summary");
  }
}

export async function sendInvoiceNotification(user, invoice) {
  try {
    const periodStart = formatDate(invoice.periodStart);
    const periodEnd = formatDate(invoice.periodEnd);
    await transport.sendMail({
      from: FROM,
      to: user.email,
      subject: `ChargeShare: Invoice Ready — $${invoice.totalAud.toFixed(2)} AUD`,
      text: [
        `Hi ${user.fullName},`,
        ``,
        `Your ChargeShare invoice for the period ${periodStart} – ${periodEnd} is ready.`,
        ``,
        `Total amount:  $${invoice.totalAud.toFixed(2)} AUD`,
        `Status:        ${invoice.status}`,
        ``,
        `Log in to the ChargeShare app to view the full breakdown of your charging sessions.`,
        ``,
        `— ChargeShare`,
      ].join("\n"),
    });
    logger.info({ userId: user.id, invoiceId: invoice.id }, "Mailer: invoice notification sent");
  } catch (err) {
    logger.error({ err, userId: user.id }, "Mailer: failed to send invoice notification");
  }
}
