require("dotenv").config();
const express = require("express");
const sendEmail = require("./../../src/services/emailService");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email, and message are required" });
    }

    // Send email to business
    const businessEmailOptions = {
      from: process.env.EMAIL,
      to: process.env.BUSINESS_NOTIFY_EMAIL || "sgembroideryltd@gmail.com",
      subject: `New contact message — ${subject || "General Inquiry"}`,
      text: `From: ${name} <${email}>
Phone: ${phone || "Not provided"}

Subject: ${subject || "General Inquiry"}

Message:
${message}`,
      html: `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
<p><strong>Phone:</strong> ${phone || "Not provided"}</p>
<p><strong>Subject:</strong> ${subject || "General Inquiry"}</p>
<hr>
<p><strong>Message:</strong></p>
<p>${message.replace(/\n/g, "<br>")}</p>`,
    };

    // Send confirmation email to user
    const userEmailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "We received your message",
      text: `Hi ${name},

Thank you for contacting us. We've received your message and will get back to you soon.

Your message:
${message}

We'll respond within 24 hours.

Best regards,
S&G Embroidery Team`,
      html: `<p>Hi ${name},</p>
<p>Thank you for contacting us. We've received your message and will get back to you soon.</p>
<p><strong>Your message:</strong></p>
<p>${message.replace(/\n/g, "<br>")}</p>
<p>We'll respond within 24 hours.</p>
<p>Best regards,<br>S&G Embroidery Team</p>`,
    };

    // Send both emails
    await sendEmail(businessEmailOptions);
    await sendEmail(userEmailOptions);

    res.status(200).json({ message: "Message sent successfully" });
  } catch (err) {
    console.error("Contact form error:", err);
    res.status(500).json({ message: "Failed to send message. Please try again." });
  }
});

module.exports = router;