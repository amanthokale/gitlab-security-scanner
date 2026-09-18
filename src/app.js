const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");

const { env } = require("./config/env");
const swaggerSpec = require("./config/swagger");
const scanRoutes = require("./routes/scan.routes");
const { errorHandler } = require("./middleware/error.middleware");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

if (env.nodeEnv !== "test") {
  app.use(morgan("combined"));
}

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "GitLab Security Scanner is running",
    environment: env.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// Swagger
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

// API routes
app.use("/api/v1/scans", scanRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);

module.exports = app;