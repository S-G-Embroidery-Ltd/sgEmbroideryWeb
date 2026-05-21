require("dotenv").config();
const express = require("express");
const sendEmail = require("./../../src/services/emailService");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, company, description, quantity, workSubmissionDate, brandingTypes, specialInstructions, referenceFileName } = req.body;

    // Validate required fields
    if (!name || !email || !description || !workSubmissionDate) {
      return res.status(400).json({ message: "Name, email, description, and work submission date are required" });
    }

    // Parse branding types if it's a string
    const brandingTypesText = Array.isArray(brandingTypes) 
      ? brandingTypes.join(', ') 
      : (brandingTypes || 'Not specified');

    // Send email to business
    const businessEmailOptions = {
      from: process.env.EMAIL,
      to: process.env.BUSINESS_NOTIFY_EMAIL || "sgembroideryltd@gmail.com",
      subject: `New project quote — ${email}`,
      text: `From: ${name} <${email}>
Phone: ${phone || "Not provided"}
Company: ${company || "Not provided"}

Description:
${description}

Qty: ${quantity || "Not specified"}
Start Date: ${workSubmissionDate}
Branding Types: ${brandingTypesText}
Notes: ${specialInstructions || "None provided"}
Reference file: ${referenceFileName || "none"}`,
      html: `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
<p><strong>Phone:</strong> ${phone || "Not provided"}</p>
<p><strong>Company:</strong> ${company || "Not provided"}</p>
<hr>
<p><strong>Description:</strong></p>
<p>${description.replace(/\n/g, "<br>")}</p>
<p><strong>Quantity:</strong> ${quantity || "Not specified"}</p>
<p><strong>Start Date:</strong> ${workSubmissionDate}</p>
<p><strong>Branding Types:</strong> ${brandingTypesText}</p>
<p><strong>Notes:</strong> ${specialInstructions || "None provided"}</p>
<p><strong>Reference file:</strong> ${referenceFileName || "none"}</p>`,
    };

    // Send confirmation email to user
    const userEmailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "We received your project quote request",
      text: `Hi ${name},

Thank you for your project quote request. Our team will review it and get back to you soon.

Summary:
${description.slice(0, 500)}${description.length > 500 ? "…" : ""}

We typically respond within 24 hours with pricing guidance.

Best regards,
S&G Embroidery Team`,
      html: `<p>Hi ${name},</p>
<p>Thank you for your project quote request. Our team will review it and get back to you soon.</p>
<p><strong>Summary:</strong></p>
<p>${description.slice(0, 500).replace(/\n/g, "<br>")}${description.length > 500 ? "…" : ""}</p>
<p>We typically respond within 24 hours with pricing guidance.</p>
<p>Best regards,<br>S&G Embroidery Team</p>`,
    };

    // Send both emails
    await sendEmail(businessEmailOptions);
    await sendEmail(userEmailOptions);

    res.status(200).json({ message: "Quote request submitted successfully" });
  } catch (err) {
    console.error("Quote form error:", err);
    res.status(500).json({ message: "Failed to submit quote request. Please try again." });
  }
});

module.exports = router;