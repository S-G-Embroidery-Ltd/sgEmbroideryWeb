import nodemailer from 'nodemailer';
import type { IOrder } from '../models/Order';

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  if (!host || !user || !pass) {
    return null;
  }
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT) || 587;
    const secure = process.env.SMTP_SECURE === 'true' || port === 465;
    transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });
  }
  return transporter;
}

const from = () => process.env.EMAIL_FROM?.trim() || process.env.SMTP_USER?.trim() || 'noreply@localhost';
const notifyTo = () => process.env.BUSINESS_NOTIFY_EMAIL?.trim();

export async function sendMailSafe(options: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}): Promise<boolean> {
  const tx = getTransporter();
  if (!tx) {
    console.warn('[email] SMTP not configured; skipping send:', options.subject);
    return false;
  }
  try {
    await tx.sendMail({
      from: from(),
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html ?? options.text.replace(/\n/g, '<br/>'),
    });
    return true;
  } catch (e) {
    console.error('[email] send failed:', e);
    return false;
  }
}

export async function notifyBusiness(subject: string, text: string, html?: string): Promise<void> {
  const to = notifyTo();
  if (!to) {
    console.warn('[email] BUSINESS_NOTIFY_EMAIL not set');
    return;
  }
  await sendMailSafe({ to, subject, text, html });
}

function orderLinesText(order: Pick<IOrder, 'items' | 'orderNumber' | 'total' | 'paymentStatus'>): string {
  const lines = order.items.map((i) => `  - ${i.name} x${i.quantity} @ KES ${i.price}`).join('\n');
  return `Order ${order.orderNumber}\nPayment: ${order.paymentStatus}\nTotal: KES ${order.total}\n${lines}`;
}

export async function emailNewShopOrder(order: IOrder): Promise<void> {
  const to = notifyTo();
  if (!to) return;
  const text = `New shop order (awaiting payment if Paystack).\n\n${orderLinesText(order)}\nCustomer: ${order.shippingAddress.name} <${order.shippingAddress.email}>\nPhone: ${order.shippingAddress.phone}`;
  await notifyBusiness(`New order ${order.orderNumber}`, text);
}

export async function emailOrderPaidReceipt(order: IOrder, paystackRef?: string): Promise<void> {
  const customerEmail = order.shippingAddress.email;
  const ref = paystackRef || order.paymentId || '';
  const text = `Thank you for your payment.\n\nOrder: ${order.orderNumber}\nTotal paid: KES ${order.total}\nReference: ${ref}\n\n${orderLinesText(order)}\n\nWe will process your order shortly.`;
  await sendMailSafe({
    to: customerEmail,
    subject: `Receipt — Order ${order.orderNumber}`,
    text,
  });
  await notifyBusiness(
    `Paid: ${order.orderNumber}`,
    `Order ${order.orderNumber} marked paid.\nReference: ${ref}\nCustomer: ${customerEmail}\nTotal: KES ${order.total}`
  );
}

export async function emailMpesaCodeSubmitted(order: IOrder, code: string): Promise<void> {
  await notifyBusiness(
    `M-Pesa code submitted — ${order.orderNumber}`,
    `Order: ${order.orderNumber}\nCustomer: ${order.shippingAddress.name} <${order.shippingAddress.email}>\nAmount: KES ${order.total}\nM-Pesa code: ${code}\n\nConfirm in admin when verified.`
  );
}

export async function emailMpesaConfirmedCustomer(order: IOrder): Promise<void> {
  await sendMailSafe({
    to: order.shippingAddress.email,
    subject: `Payment confirmed — Order ${order.orderNumber}`,
    text: `Your M-Pesa payment for order ${order.orderNumber} has been confirmed.\nTotal: KES ${order.total}\nWe will process your order shortly.`,
  });
}

export async function emailNewQuoteRequest(payload: {
  name: string;
  email: string;
  phone: string;
  company?: string;
  description: string;
  quantity?: string;
  timeline?: string;
  specialInstructions?: string;
  referenceFile?: string;
}): Promise<void> {
  await notifyBusiness(
    `New project quote — ${payload.email}`,
    `From: ${payload.name} <${payload.email}>\nPhone: ${payload.phone}\nCompany: ${payload.company || '—'}\n\nDescription:\n${payload.description}\n\nQty: ${payload.quantity || '—'}\nTimeline: ${payload.timeline || '—'}\nNotes: ${payload.specialInstructions || '—'}\nReference file: ${payload.referenceFile || 'none'}`
  );
  await sendMailSafe({
    to: payload.email,
    subject: 'We received your project quote request',
    text: `Hi ${payload.name},\n\nThank you for your project quote request. Our team will review it and get back to you soon.\n\nSummary:\n${payload.description.slice(0, 500)}${payload.description.length > 500 ? '…' : ''}`,
  });
}

export async function emailNewDigitizingOrder(payload: {
  name: string;
  email: string;
  phone: string;
  company?: string;
  orderNumber: string;
  originalFileName: string;
  notes?: string;
}): Promise<void> {
  await notifyBusiness(
    `New logo digitizing — ${payload.orderNumber}`,
    `Order: ${payload.orderNumber}\n${payload.name} <${payload.email}>\nPhone: ${payload.phone}\nCompany: ${payload.company || '—'}\nFile: ${payload.originalFileName}\nNotes: ${payload.notes || '—'}`
  );
  await sendMailSafe({
    to: payload.email,
    subject: `Digitizing request received — ${payload.orderNumber}`,
    text: `Hi ${payload.name},\n\nWe received your logo digitizing request (${payload.orderNumber}) and payment where applicable. We will follow up by email with next steps.`,
  });
}
