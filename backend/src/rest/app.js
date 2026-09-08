const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const manejarErrores = require("./middleware/manejarErrores");

const app = express();

/**
 * CORS: solo el dominio del frontend puede llamar a esta API desde el
 * navegador. En desarrollo se permite localhost:3000 (típico de React);
 * en producción, FRONTEND_ORIGIN debe apuntar al dominio real.
 */
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000";
app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));

app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// 404 para rutas que no existen
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// SIEMPRE al final: captura cualquier error lanzado por los controllers
app.use(manejarErrores);

module.exports = app;
