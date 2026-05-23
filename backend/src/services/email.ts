import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import type { IOrder } from '../models/Order';

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter | null {
  const host = process.env.EMAIL_HOST?.trim();
  const user = process.env.EMAIL_USER?.trim();
  const pass = process.env.EMAIL_PASS?.trim();
  if (!host || !user || !pass) {
    return null;
  }
  if (!transporter) {
    const port = Number(process.env.EMAIL_PORT) || 587;
    const secure = process.env.EMAIL_SECURE === 'true' || port === 465;
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
  attachments?: Array<{
    filename: string;
    path: string;
  }>;
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
      attachments: options.attachments,
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
  workSubmissionDate?: string;
  brandingTypes?: string[];
  specialInstructions?: string;
  referenceFiles?: string[];
}): Promise<void> {
  const brandingTypesText = payload.brandingTypes?.join(', ') || '—';
  const filesText = payload.referenceFiles?.join(', ') || 'none';
  
  // Create file attachments for business notification
  const attachments = payload.referenceFiles?.map(file => {
    const fullPath = path.join(process.cwd(), 'uploads', file);
    const filename = path.basename(file);
    return { filename, path: fullPath };
  });

  // Attractive HTML template for business notification
  const businessHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Quote Request</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background: #f8f9fa; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 600; }
        .content { padding: 30px; }
        .info-grid { display: grid; grid-template-columns: 120px 1fr; gap: 15px; margin-bottom: 25px; }
        .info-label { font-weight: 600; color: #666; font-size: 14px; }
        .info-value { color: #333; }
        .section { background: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
        .section h3 { margin: 0 0 15px 0; color: #667eea; font-size: 18px; }
        .files-list { background: #e8f4fd; border-left: 4px solid #2196F3; padding: 15px; margin: 15px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎨 New Quote Request</h1>
          <p>A potential client has requested a quote for embroidery services</p>
        </div>
        <div class="content">
          <div class="section">
            <h3>👤 Client Information</h3>
            <div class="info-grid">
              <div class="info-label">Name:</div>
              <div class="info-value">${payload.name}</div>
              <div class="info-label">Email:</div>
              <div class="info-value">${payload.email}</div>
              <div class="info-label">Phone:</div>
              <div class="info-value">${payload.phone}</div>
              <div class="info-label">Company:</div>
              <div class="info-value">${payload.company || '—'}</div>
            </div>
          </div>
          
          <div class="section">
            <h3>📋 Project Details</h3>
            <div class="info-grid">
              <div class="info-label">Quantity:</div>
              <div class="info-value">${payload.quantity || '—'}</div>
              <div class="info-label">Start Date:</div>
              <div class="info-value">${payload.workSubmissionDate || '—'}</div>
              <div class="info-label">Branding:</div>
              <div class="info-value">${brandingTypesText}</div>
            </div>
          </div>
          
          <div class="section">
            <h3>📝 Project Description</h3>
            <p style="margin: 0; color: #333;">${payload.description}</p>
          </div>
          
          ${payload.specialInstructions ? `
          <div class="section">
            <h3>💭 Special Instructions</h3>
            <p style="margin: 0; color: #333;">${payload.specialInstructions}</p>
          </div>
          ` : ''}
          
          ${payload.referenceFiles && payload.referenceFiles.length > 0 ? `
          <div class="files-list">
            <strong>📎 Attached Files:</strong><br>
            ${payload.referenceFiles.map(file => `• ${path.basename(file)}`).join('<br>')}
          </div>
          ` : ''}
        </div>
        <div class="footer">
          <p>S&G Embroidery - Professional Embroidery Services</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await notifyBusiness(
    `New project quote — ${payload.email}`,
    `From: ${payload.name} <${payload.email}>\nPhone: ${payload.phone}\nCompany: ${payload.company || '—'}\n\nDescription:\n${payload.description}\n\nQty: ${payload.quantity || '—'}\nStart Date: ${payload.workSubmissionDate || '—'}\nBranding Types: ${brandingTypesText}\nNotes: ${payload.specialInstructions || '—'}\nFiles: ${filesText}`,
    businessHtml
  );

  // Attractive HTML template for client confirmation
  const clientHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Quote Request Received</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background: #f8f9fa; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 32px; font-weight: 600; }
        .content { padding: 40px 30px; }
        .thank-you { font-size: 24px; color: #667eea; font-weight: 600; margin-bottom: 20px; }
        .message { color: #555; margin-bottom: 30px; }
        .summary { background: #f8f9fa; border-radius: 8px; padding: 25px; margin-bottom: 30px; }
        .summary h3 { color: #667eea; margin: 0 0 15px 0; font-size: 18px; }
        .next-steps { background: #e8f5e8; border-left: 4px solid #4CAF50; padding: 20px; margin-bottom: 30px; }
        .next-steps h4 { color: #2e7d32; margin: 0 0 10px 0; }
        .footer { background: #f8f9fa; padding: 30px; text-align: center; color: #666; }
        .contact-info { background: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin-bottom: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✨ Quote Request Received!</h1>
          <p>Thank you for choosing S&G Embroidery</p>
        </div>
        <div class="content">
          <div class="thank-you">Hi ${payload.name},</div>
          <div class="message">
            Thank you for your interest in our embroidery services! We've received your quote request and our team is excited to review your project.
          </div>
          
          <div class="summary">
            <h3>📋 Your Request Summary</h3>
            <p><strong>Project:</strong> ${payload.description.substring(0, 200)}${payload.description.length > 200 ? '...' : ''}</p>
            ${payload.quantity ? `<p><strong>Quantity:</strong> ${payload.quantity}</p>` : ''}
            ${payload.workSubmissionDate ? `<p><strong>Preferred Start Date:</strong> ${payload.workSubmissionDate}</p>` : ''}
            ${payload.brandingTypes && payload.brandingTypes.length > 0 ? `<p><strong>Services:</strong> ${payload.brandingTypes.join(', ')}</p>` : ''}
          </div>
          
          <div class="next-steps">
            <h4>🚀 What Happens Next?</h4>
            <ol style="margin: 0; padding-left: 20px;">
              <li>Our team reviews your project details</li>
              <li>We'll prepare a detailed quote for you</li>
              <li>You'll receive our response within 24-48 hours</li>
              <li>We'll discuss any questions and next steps</li>
            </ol>
          </div>
          
          <div class="contact-info">
            <strong>📞 Need to reach us?</strong><br>
            Email: sgembroideryltd@gmail.com<br>
            Phone: +254 710 422 557
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #667eea; font-weight: 600; font-size: 18px;">We look forward to working with you!</p>
          </div>
        </div>
        <div class="footer">
          <p><strong>S&G Embroidery</strong><br>
          Professional Embroidery Services<br>
          Quality • Precision • Style</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendMailSafe({
    to: payload.email,
    subject: '✨ Your Quote Request Has Been Received - S&G Embroidery',
    html: clientHtml,
    text: `Hi ${payload.name},\n\nThank you for your project quote request. Our team will review it and get back to you soon.\n\nSummary:\n${payload.description.slice(0, 500)}${payload.description.length > 500 ? '…' : ''}`,
    attachments
  });
}

export async function emailNewContactMessage(payload: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}): Promise<void> {
  // Business notification email
  const businessHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Message</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">📧 New Contact Message</h1>
          <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">Customer Inquiry Received</p>
        </div>
        
        <!-- Customer Information -->
        <div style="padding: 30px;">
          <div style="background-color: #f1f5f9; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
            <h2 style="color: #1e293b; margin: 0 0 15px 0; font-size: 20px; font-weight: 600;">👤 Customer Information</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div>
                <p style="margin: 0 0 5px 0; color: #64748b; font-size: 14px; font-weight: 500;">Name</p>
                <p style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 600;">${payload.name}</p>
              </div>
              <div>
                <p style="margin: 0 0 5px 0; color: #64748b; font-size: 14px; font-weight: 500;">Email</p>
                <p style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 600;">${payload.email}</p>
              </div>
              <div>
                <p style="margin: 0 0 5px 0; color: #64748b; font-size: 14px; font-weight: 500;">Phone</p>
                <p style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 600;">${payload.phone || 'Not provided'}</p>
              </div>
              <div>
                <p style="margin: 0 0 5px 0; color: #64748b; font-size: 14px; font-weight: 500;">Date</p>
                <p style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 600;">${new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          
          <!-- Message Details -->
          <div style="background-color: #fef3c7; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
            <h2 style="color: #92400e; margin: 0 0 15px 0; font-size: 20px; font-weight: 600;">📝 Message Details</h2>
            <div style="background-color: white; border-radius: 6px; padding: 15px; border-left: 4px solid #f59e0b;">
              <p style="margin: 0 0 10px 0; color: #92400e; font-size: 14px; font-weight: 600;">Subject</p>
              <p style="margin: 0 0 20px 0; color: #1e293b; font-size: 16px; font-weight: 500;">${payload.subject}</p>
              <p style="margin: 0 0 10px 0; color: #92400e; font-size: 14px; font-weight: 600;">Message</p>
              <p style="margin: 0; color: #1e293b; font-size: 16px; line-height: 1.6;">${payload.message.replace(/\n/g, '<br>')}</p>
            </div>
          </div>
          
          <!-- Action Required -->
          <div style="background-color: #dbeafe; border-radius: 8px; padding: 20px; text-align: center;">
            <h3 style="color: #1e40af; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">⚡ Action Required</h3>
            <p style="margin: 0; color: #1e40af; font-size: 16px;">Please respond to this customer inquiry within 24 hours</p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0; color: #64748b; font-size: 14px;">S&G Embroidery • Customer Service Team</p>
          <p style="margin: 5px 0 0 0; color: #94a3b8; font-size: 12px;">This is an automated notification from your website</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Customer confirmation email
  const customerHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank You for Contacting Us</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">✨ Thank You!</h1>
          <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">We've Received Your Message</p>
        </div>
        
        <!-- Welcome Message -->
        <div style="padding: 30px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <p style="margin: 0; color: #1e293b; font-size: 18px; line-height: 1.6;">
              Hi <strong>${payload.name}</strong>,
            </p>
            <p style="margin: 15px 0 0 0; color: #475569; font-size: 16px; line-height: 1.6;">
              Thank you for reaching out to S&G Embroidery! We've received your message and our team is excited to help you with your inquiry.
            </p>
          </div>
          
          <!-- Message Summary -->
          <div style="background-color: #f1f5f9; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
            <h2 style="color: #1e293b; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">📋 Your Message Summary</h2>
            <div style="background-color: white; border-radius: 6px; padding: 15px;">
              <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px; font-weight: 500;">Subject</p>
              <p style="margin: 0 0 15px 0; color: #1e293b; font-size: 16px; font-weight: 500;">${payload.subject}</p>
              <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px; font-weight: 500;">Message</p>
              <p style="margin: 0; color: #1e293b; font-size: 16px; line-height: 1.6;">${payload.message.substring(0, 200)}${payload.message.length > 200 ? '...' : ''}</p>
            </div>
          </div>
          
          <!-- What's Next -->
          <div style="background-color: #fef3c7; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
            <h2 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">🚀 What Happens Next?</h2>
            <div style="display: grid; grid-template-columns: 1fr; gap: 15px;">
              <div style="display: flex; align-items: center; gap: 15px;">
                <div style="background-color: #f59e0b; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">1</div>
                <div>
                  <p style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 500;">Review Your Message</p>
                  <p style="margin: 5px 0 0 0; color: #64748b; font-size: 14px;">Our team will carefully review your inquiry</p>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 15px;">
                <div style="background-color: #f59e0b; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">2</div>
                <div>
                  <p style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 500;">Personal Response</p>
                  <p style="margin: 5px 0 0 0; color: #64748b; font-size: 14px;">We'll prepare a personalized response for you</p>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 15px;">
                <div style="background-color: #f59e0b; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">3</div>
                <div>
                  <p style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 500;">Quick Reply</p>
                  <p style="margin: 5px 0 0 0; color: #64748b; font-size: 14px;">You'll hear back from us within 24 hours</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Contact Info -->
          <div style="background-color: #dbeafe; border-radius: 8px; padding: 20px; text-align: center;">
            <h3 style="color: #1e40af; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">📞 Need Immediate Assistance?</h3>
            <p style="margin: 0; color: #1e40af; font-size: 16px;">Call us at <strong>+254 XXX XXX XXX</strong> or reply to this email</p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0; color: #64748b; font-size: 14px;">S&G Embroidery • Professional Embroidery Services</p>
          <p style="margin: 5px 0 0 0; color: #94a3b8; font-size: 12px;">Thank you for choosing us for your embroidery needs!</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await notifyBusiness(
    `New contact message — ${payload.subject}`,
    `From: ${payload.name} <${payload.email}>\nPhone: ${payload.phone}\n\nSubject: ${payload.subject}\n\nMessage:\n${payload.message}`,
    businessHtml
  );
  
  await sendMailSafe({
    to: payload.email,
    subject: 'We received your message - S&G Embroidery',
    text: `Hi ${payload.name},\n\nThank you for contacting us. We've received your message and will get back to you soon.\n\nYour message:\n${payload.message}\n\nWe'll respond within 24 hours.`,
    html: customerHtml
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
  // Business notification email
  const businessHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Logo Digitizing Order</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">🎨 New Logo Digitizing Order</h1>
          <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">Logo Processing Request Received</p>
        </div>
        
        <!-- Order Information -->
        <div style="padding: 30px;">
          <div style="background-color: #f3e8ff; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
            <h2 style="color: #6b21a8; margin: 0 0 15px 0; font-size: 20px; font-weight: 600;">📋 Order Details</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div>
                <p style="margin: 0 0 5px 0; color: #6b21a8; font-size: 14px; font-weight: 500;">Order Number</p>
                <p style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 600;">${payload.orderNumber}</p>
              </div>
              <div>
                <p style="margin: 0 0 5px 0; color: #6b21a8; font-size: 14px; font-weight: 500;">Date</p>
                <p style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 600;">${new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          
          <!-- Customer Information -->
          <div style="background-color: #fef3c7; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
            <h2 style="color: #92400e; margin: 0 0 15px 0; font-size: 20px; font-weight: 600;">👤 Customer Information</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div>
                <p style="margin: 0 0 5px 0; color: #92400e; font-size: 14px; font-weight: 500;">Name</p>
                <p style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 600;">${payload.name}</p>
              </div>
              <div>
                <p style="margin: 0 0 5px 0; color: #92400e; font-size: 14px; font-weight: 500;">Email</p>
                <p style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 600;">${payload.email}</p>
              </div>
              <div>
                <p style="margin: 0 0 5px 0; color: #92400e; font-size: 14px; font-weight: 500;">Phone</p>
                <p style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 600;">${payload.phone || 'Not provided'}</p>
              </div>
              <div>
                <p style="margin: 0 0 5px 0; color: #92400e; font-size: 14px; font-weight: 500;">Company</p>
                <p style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 600;">${payload.company || 'Not provided'}</p>
              </div>
            </div>
          </div>
          
          <!-- File Information -->
          <div style="background-color: #dcfce7; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
            <h2 style="color: #166534; margin: 0 0 15px 0; font-size: 20px; font-weight: 600;">📁 File Information</h2>
            <div style="background-color: white; border-radius: 6px; padding: 15px; border-left: 4px solid #22c55e;">
              <p style="margin: 0 0 5px 0; color: #166534; font-size: 14px; font-weight: 600;">Original File Name</p>
              <p style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 500;">${payload.originalFileName}</p>
            </div>
            ${payload.notes ? `
            <div style="background-color: white; border-radius: 6px; padding: 15px; border-left: 4px solid #22c55e; margin-top: 15px;">
              <p style="margin: 0 0 5px 0; color: #166534; font-size: 14px; font-weight: 600;">Customer Notes</p>
              <p style="margin: 0; color: #1e293b; font-size: 16px; line-height: 1.6;">${payload.notes.replace(/\n/g, '<br>')}</p>
            </div>
            ` : ''}
          </div>
          
          <!-- Action Required -->
          <div style="background-color: #dbeafe; border-radius: 8px; padding: 20px; text-align: center;">
            <h3 style="color: #1e40af; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">⚡ Action Required</h3>
            <p style="margin: 0; color: #1e40af; font-size: 16px;">Process this logo digitizing order and provide quote/timeline</p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0; color: #64748b; font-size: 14px;">S&G Embroidery • Digitizing Team</p>
          <p style="margin: 5px 0 0 0; color: #94a3b8; font-size: 12px;">This is an automated notification from your website</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Customer confirmation email
  const customerHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Logo Digitizing Request Received</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">🎨 Logo Digitizing Request</h1>
          <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">We've Received Your Order!</p>
        </div>
        
        <!-- Welcome Message -->
        <div style="padding: 30px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <p style="margin: 0; color: #1e293b; font-size: 18px; line-height: 1.6;">
              Hi <strong>${payload.name}</strong>,
            </p>
            <p style="margin: 15px 0 0 0; color: #475569; font-size: 16px; line-height: 1.6;">
              Thank you for choosing S&G Embroidery for your logo digitizing needs! We've received your order and are excited to transform your logo into a beautiful embroidery design.
            </p>
          </div>
          
          <!-- Order Summary -->
          <div style="background-color: #f3e8ff; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
            <h2 style="color: #6b21a8; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">📋 Order Summary</h2>
            <div style="display: grid; grid-template-columns: 1fr; gap: 15px;">
              <div style="background-color: white; border-radius: 6px; padding: 15px;">
                <p style="margin: 0 0 5px 0; color: #6b21a8; font-size: 14px; font-weight: 500;">Order Number</p>
                <p style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 500;">${payload.orderNumber}</p>
              </div>
              <div style="background-color: white; border-radius: 6px; padding: 15px;">
                <p style="margin: 0 0 5px 0; color: #6b21a8; font-size: 14px; font-weight: 500;">File Submitted</p>
                <p style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 500;">${payload.originalFileName}</p>
              </div>
              ${payload.company ? `
              <div style="background-color: white; border-radius: 6px; padding: 15px;">
                <p style="margin: 0 0 5px 0; color: #6b21a8; font-size: 14px; font-weight: 500;">Company</p>
                <p style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 500;">${payload.company}</p>
              </div>
              ` : ''}
            </div>
          </div>
          
          <!-- What Happens Next -->
          <div style="background-color: #fef3c7; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
            <h2 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">🚀 What Happens Next?</h2>
            <div style="display: grid; grid-template-columns: 1fr; gap: 15px;">
              <div style="display: flex; align-items: center; gap: 15px;">
                <div style="background-color: #f59e0b; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">1</div>
                <div>
                  <p style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 500;">Logo Review</p>
                  <p style="margin: 5px 0 0 0; color: #64748b; font-size: 14px;">Our digitizing team will review your logo file</p>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 15px;">
                <div style="background-color: #f59e0b; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">2</div>
                <div>
                  <p style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 500;">Quote & Timeline</p>
                  <p style="margin: 5px 0 0 0; color: #64748b; font-size: 14px;">We'll send pricing and completion timeline</p>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 15px;">
                <div style="background-color: #f59e0b; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">3</div>
                <div>
                  <p style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 500;">Digitizing Process</p>
                  <p style="margin: 5px 0 0 0; color: #64748b; font-size: 14px;">Your logo will be converted to embroidery format</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Contact Info -->
          <div style="background-color: #dbeafe; border-radius: 8px; padding: 20px; text-align: center;">
            <h3 style="color: #1e40af; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">📞 Questions?</h3>
            <p style="margin: 0; color: #1e40af; font-size: 16px;">Call us at <strong>+254 XXX XXX XXX</strong> or reply to this email</p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0; color: #64748b; font-size: 14px;">S&G Embroidery • Professional Logo Digitizing</p>
          <p style="margin: 5px 0 0 0; color: #94a3b8; font-size: 12px;">We're excited to bring your logo to life!</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await notifyBusiness(
    `New logo digitizing — ${payload.orderNumber}`,
    `Order: ${payload.orderNumber}\n${payload.name} <${payload.email}>\nPhone: ${payload.phone}\nCompany: ${payload.company || '—'}\nFile: ${payload.originalFileName}\nNotes: ${payload.notes || '—'}`,
    businessHtml
  );
  
  await sendMailSafe({
    to: payload.email,
    subject: `Digitizing request received — ${payload.orderNumber}`,
    text: `Hi ${payload.name},\n\nWe received your logo digitizing request (${payload.orderNumber}) and payment where applicable. We will follow up by email with next steps.`,
    html: customerHtml
  });
}

export async function emailNewVolunteerApplication(payload: {
  name: string;
  email: string;
  phone: string;
  volunteerType: string;
  skills: string;
  availability: string;
  message: string;
}): Promise<void> {
  // Business notification email
  const businessHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Volunteer Application</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">🤝 New Volunteer Application</h1>
          <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">Community Member Wants to Join!</p>
        </div>
        
        <!-- Applicant Information -->
        <div style="padding: 30px;">
          <div style="background-color: #fef3c7; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
            <h2 style="color: #92400e; margin: 0 0 15px 0; font-size: 20px; font-weight: 600;">👤 Applicant Information</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div>
                <p style="margin: 0 0 5px 0; color: #92400e; font-size: 14px; font-weight: 500;">Name</p>
                <p style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 600;">${payload.name}</p>
              </div>
              <div>
                <p style="margin: 0 0 5px 0; color: #92400e; font-size: 14px; font-weight: 500;">Email</p>
                <p style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 600;">${payload.email}</p>
              </div>
              <div>
                <p style="margin: 0 0 5px 0; color: #92400e; font-size: 14px; font-weight: 500;">Phone</p>
                <p style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 600;">${payload.phone || 'Not provided'}</p>
              </div>
              <div>
                <p style="margin: 0 0 5px 0; color: #92400e; font-size: 14px; font-weight: 500;">Date</p>
                <p style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 600;">${new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          
          <!-- Application Details -->
          <div style="background-color: #dcfce7; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
            <h2 style="color: #166534; margin: 0 0 15px 0; font-size: 20px; font-weight: 600;">📋 Application Details</h2>
            <div style="display: grid; grid-template-columns: 1fr; gap: 15px;">
              <div style="background-color: white; border-radius: 6px; padding: 15px; border-left: 4px solid #22c55e;">
                <p style="margin: 0 0 5px 0; color: #166534; font-size: 14px; font-weight: 600;">Volunteer Type</p>
                <p style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 500;">${payload.volunteerType}</p>
              </div>
              <div style="background-color: white; border-radius: 6px; padding: 15px; border-left: 4px solid #22c55e;">
                <p style="margin: 0 0 5px 0; color: #166534; font-size: 14px; font-weight: 600;">Skills</p>
                <p style="margin: 0; color: #1e293b; font-size: 16px; line-height: 1.6;">${payload.skills.replace(/\n/g, '<br>')}</p>
              </div>
              <div style="background-color: white; border-radius: 6px; padding: 15px; border-left: 4px solid #22c55e;">
                <p style="margin: 0 0 5px 0; color: #166534; font-size: 14px; font-weight: 600;">Availability</p>
                <p style="margin: 0; color: #1e293b; font-size: 16px; line-height: 1.6;">${payload.availability.replace(/\n/g, '<br>')}</p>
              </div>
              ${payload.message ? `
              <div style="background-color: white; border-radius: 6px; padding: 15px; border-left: 4px solid #22c55e;">
                <p style="margin: 0 0 5px 0; color: #166534; font-size: 14px; font-weight: 600;">Personal Message</p>
                <p style="margin: 0; color: #1e293b; font-size: 16px; line-height: 1.6;">${payload.message.replace(/\n/g, '<br>')}</p>
              </div>
              ` : ''}
            </div>
          </div>
          
          <!-- Next Steps -->
          <div style="background-color: #dbeafe; border-radius: 8px; padding: 20px; text-align: center;">
            <h3 style="color: #1e40af; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">📅 Next Steps</h3>
            <p style="margin: 0; color: #1e40af; font-size: 16px;">Review this application and contact the applicant within 3-5 business days</p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0; color: #64748b; font-size: 14px;">S&G Embroidery • Volunteer Coordination Team</p>
          <p style="margin: 5px 0 0 0; color: #94a3b8; font-size: 12px;">This is an automated notification from your website</p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Volunteer confirmation email
  const volunteerHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thank You for Your Volunteer Application</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">🌟 Thank You!</h1>
          <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 16px;">We've Received Your Volunteer Application</p>
        </div>
        
        <!-- Welcome Message -->
        <div style="padding: 30px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <p style="margin: 0; color: #1e293b; font-size: 18px; line-height: 1.6;">
              Dear <strong>${payload.name}</strong>,
            </p>
            <p style="margin: 15px 0 0 0; color: #475569; font-size: 16px; line-height: 1.6;">
              Thank you so much for your interest in volunteering with S&G Embroidery! We're truly grateful for your willingness to contribute your time and skills to our community.
            </p>
          </div>
          
          <!-- Application Summary -->
          <div style="background-color: #fef3c7; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
            <h2 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">📋 Your Application Summary</h2>
            <div style="display: grid; grid-template-columns: 1fr; gap: 15px;">
              <div style="background-color: white; border-radius: 6px; padding: 15px;">
                <p style="margin: 0 0 5px 0; color: #92400e; font-size: 14px; font-weight: 500;">Volunteer Type</p>
                <p style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 500;">${payload.volunteerType}</p>
              </div>
              <div style="background-color: white; border-radius: 6px; padding: 15px;">
                <p style="margin: 0 0 5px 0; color: #92400e; font-size: 14px; font-weight: 500;">Your Skills</p>
                <p style="margin: 0; color: #1e293b; font-size: 16px; line-height: 1.6;">${payload.skills.substring(0, 150)}${payload.skills.length > 150 ? '...' : ''}</p>
              </div>
              <div style="background-color: white; border-radius: 6px; padding: 15px;">
                <p style="margin: 0 0 5px 0; color: #92400e; font-size: 14px; font-weight: 500;">Availability</p>
                <p style="margin: 0; color: #1e293b; font-size: 16px; line-height: 1.6;">${payload.availability.substring(0, 150)}${payload.availability.length > 150 ? '...' : ''}</p>
              </div>
            </div>
          </div>
          
          <!-- What Happens Next -->
          <div style="background-color: #dcfce7; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
            <h2 style="color: #166534; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">🚀 What Happens Next?</h2>
            <div style="display: grid; grid-template-columns: 1fr; gap: 15px;">
              <div style="display: flex; align-items: center; gap: 15px;">
                <div style="background-color: #22c55e; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">1</div>
                <div>
                  <p style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 500;">Application Review</p>
                  <p style="margin: 5px 0 0 0; color: #64748b; font-size: 14px;">Our volunteer coordinator will review your application</p>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 15px;">
                <div style="background-color: #22c55e; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">2</div>
                <div>
                  <p style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 500;">Initial Contact</p>
                  <p style="margin: 5px 0 0 0; color: #64748b; font-size: 14px;">We'll reach out within 3-5 business days</p>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 15px;">
                <div style="background-color: #22c55e; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; flex-shrink: 0;">3</div>
                <div>
                  <p style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 500;">Orientation & Onboarding</p>
                  <p style="margin: 5px 0 0 0; color: #64748b; font-size: 14px;">We'll discuss opportunities and next steps</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Impact Message -->
          <div style="background-color: #dbeafe; border-radius: 8px; padding: 20px; text-align: center;">
            <h3 style="color: #1e40af; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">💙 Your Impact Matters</h3>
            <p style="margin: 0; color: #1e40af; font-size: 16px;">Your contribution will help us serve our community better through quality embroidery services</p>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0; color: #64748b; font-size: 14px;">S&G Embroidery • Community Engagement Team</p>
          <p style="margin: 5px 0 0 0; color: #94a3b8; font-size: 12px;">Thank you for being part of our community!</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await notifyBusiness(
    `New volunteer application — ${payload.email}`,
    `From: ${payload.name} <${payload.email}>\nPhone: ${payload.phone}\n\nVolunteer Type: ${payload.volunteerType}\nSkills: ${payload.skills}\nAvailability: ${payload.availability}\n\nMessage:\n${payload.message}`,
    businessHtml
  );
  
  await sendMailSafe({
    to: payload.email,
    subject: 'We received your volunteer application - S&G Embroidery',
    text: `Hi ${payload.name},\n\nThank you for your interest in volunteering with S&G Embroidery! We've received your application and truly appreciate your willingness to contribute your time and skills.\n\nApplication Details:\nVolunteer Type: ${payload.volunteerType}\nSkills: ${payload.skills}\nAvailability: ${payload.availability}\n\nOur team will review your application and contact you within 3-5 business days to discuss next steps.\n\nWe're excited to potentially work together!\n\nBest regards,\nS&G Embroidery Team`,
    html: volunteerHtml
  });
}
