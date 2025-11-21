// ---------------------- REQUIRE ALL PACKAGES ----------------------//
require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const createConnection = require("./configs/db.config");

// ---------------------- INITIALIZE APP ----------------------
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "127.0.0.1";

// ---------------------- GLOBAL MIDDLEWARES ----------------------
app.use(helmet());
// Log HTTP requests (only in development)
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Parse JSON and cookies
app.use(express.json({ limit: "1000mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Enable CORS for frontend domain
app.use(
  cors({
    origin: "http://localhost:5001",
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 86400,
  })
);

// Gzip compression for performance
app.use(compression());

// ---------------------- ROUTES ----------------------
const adminPath = path.join(__dirname, "../frontend/dist/");
app.use("/admin", express.static(adminPath));
app.get("/admin", (req, res) => {
  res.sendFile(adminPath + "index.html");
});

app.get("/", (req, res) => {
  res.send("🚀 Server is running successfully!");
});

// ---------------------- ERROR HANDLING ----------------------
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({
    success: false,
    err,
    message: "Internal Server Error",
  });
});

if (process.env.NODE_ENV !== "production") console.clear();
// ---------------------- APIs Will Be Defined Here ----------------------
app.use("/api/v1", require("./routes/auth.routes"));
// Product Routes Here
app.use("/api/v1/admin/product", require("./routes/product.routes"));

// ---------------------- START SERVER ----------------------
createConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log("\n[+] Express Server Running!");
      console.log(`\n[+] Host:${HOST}\n`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
  });
