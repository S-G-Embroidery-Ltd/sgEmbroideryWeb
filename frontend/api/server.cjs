require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

// Import route handlers
const contactRouter = require("./contact/index.cjs");
const quoteRouter = require("./quote/index.cjs");
const volunteerRouter = require("./volunteer/index.cjs");

const app = express();
const PORT = process.env.API_PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// API Routes
app.use("/api/contact", contactRouter);
app.use("/api/quote", quoteRouter);
app.use("/api/volunteer", volunteerRouter);

// Test endpoint
app.get("/", (req, res) => {
  res.send("Nodemailer API Server is running!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Nodemailer API Server running on http://localhost:${PORT}`);
  console.log(`📧 API endpoints available:`);
  console.log(`   POST /api/contact - Contact form`);
  console.log(`   POST /api/quote - Quote requests`);
  console.log(`   POST /api/volunteer - Volunteer applications`);
  console.log(`   GET /health - Health check`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});
