const jwt = require("jsonwebtoken");

/**
 * Dos secretos distintos para access y refresh: así, aunque se filtre uno,
 * el otro tipo de token sigue protegido. En producción SIEMPRE deben venir
 * de variables de entorno (ver .env.example), nunca quedar hardcodeados.
 */
const ACCESS_SECRET =
  process.env.JWT_ACCESS_SECRET || "dev_access_secret_cambiar_en_produccion";
const REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "dev_refresh_secret_cambiar_en_produccion";

const ACCESS_EXPIRES_IN = "15m"; // vida corta: minimiza el daño si se filtra
const REFRESH_EXPIRES_IN = "7d"; // vida larga: evita loguearse todo el rato

function generarAccessToken(usuario) {
  return jwt.sign(
    { sub: usuario.id, correo: usuario.correo, rol: usuario.rol },
    ACCESS_SECRET,
    { expiresIn: ACCESS_EXPIRES_IN }
  );
}

function generarRefreshToken(usuario) {
  return jwt.sign({ sub: usuario.id }, REFRESH_SECRET, {
    expiresIn: REFRESH_EXPIRES_IN,
  });
}

function verificarAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET);
}

function verificarRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET);
}

module.exports = {
  generarAccessToken,
  generarRefreshToken,
  verificarAccessToken,
  verificarRefreshToken,
};
