require("dotenv").config();
const express = require("express");
const sendEmail = require("./../../src/services/emailService");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, volunteerType, skills, availability, message } = req.body;

    // Validate required fields
    if (!name || !email || !volunteerType || !skills || !availability) {
      return res.status(400).json({ message: "Name, email, volunteer type, skills, and availability are required" });
    }

    // Send email to business
    const businessEmailOptions = {
      from: process.env.EMAIL,
      to: process.env.BUSINESS_NOTIFY_EMAIL || "sgembroideryltd@gmail.com",
      subject: `New volunteer application — ${email}`,
      text: `From: ${name} <${email}>
Phone: ${phone || "Not provided"}

Volunteer Type: ${volunteerType}
Skills: ${skills}
Availability: ${availability}

Message:
${message}`,
      html: `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p>
<p><strong>Phone:</strong> ${phone || "Not provided"}</p>
<p><strong>Volunteer Type:</strong> ${volunteerType}</p>
<p><strong>Skills:</strong> ${skills}</p>
<p><strong>Availability:</strong> ${availability}</p>
<hr>
<p><strong>Message:</strong></p>
<p>${message.replace(/\n/g, "<br>")}</p>`,
    };

    // Send confirmation email to user
    const userEmailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "We received your volunteer application",
      text: `Hi ${name},

Thank you for your interest in volunteering with S&G Embroidery! We've received your application and truly appreciate your willingness to contribute your time and skills.

Application Details:
Volunteer Type: ${volunteerType}
Skills: ${skills}
Availability: ${availability}

Our team will review your application and contact you within 3-5 business days to discuss next steps.

We're excited to potentially work together!

Best regards,
S&G Embroidery Team`,
      html: `<p>Hi ${name},</p>
<p>Thank you for your interest in volunteering with S&G Embroidery! We've received your application and truly appreciate your willingness to contribute your time and skills.</p>
<p><strong>Application Details:</strong></p>
<ul>
<li><strong>Volunteer Type:</strong> ${volunteerType}</li>
<li><strong>Skills:</strong> ${skills}</li>
<li><strong>Availability:</strong> ${availability}</li>
</ul>
<p>Our team will review your application and contact you within 3-5 business days to discuss next steps.</p>
<p>We're excited to potentially work together!</p>
<p>Best regards,<br>S&G Embroidery Team</p>`,
    };

    // Send both emails
    await sendEmail(businessEmailOptions);
    await sendEmail(userEmailOptions);

    res.status(200).json({ message: "Volunteer application submitted successfully" });
  } catch (err) {
    console.error("Volunteer form error:", err);
    res.status(500).json({ message: "Failed to submit volunteer application. Please try again." });
  }
});

module.exports = router;