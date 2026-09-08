const { verificarAccessToken } = require("../utils/tokens");

/**
 * Autenticación = quién eres.
 * Este middleware es el "portero" del API Gateway: nada pasa hacia los
 * controllers/GraphQL sin un access token válido y vigente.
 */
function autenticar(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Falta el token de acceso (Authorization: Bearer <token>)" });
  }

  const token = header.slice("Bearer ".length);

  try {
    const payload = verificarAccessToken(token);
    req.user = payload; // { sub, correo, rol }
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "El access token expiró, usa /api/auth/refresh" });
    }
    return res.status(401).json({ error: "Access token inválido" });
  }
}

module.exports = autenticar;
