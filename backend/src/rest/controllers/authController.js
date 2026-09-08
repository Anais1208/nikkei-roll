const bcrypt = require("bcryptjs");
const store = require("../../data/store");
const {
  generarAccessToken,
  generarRefreshToken,
  verificarRefreshToken,
} = require("../utils/tokens");

function datosPublicosUsuario(usuario) {
  return { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol };
}

/**
 * POST /api/auth/login
 * Body: { correo, password }
 * Devuelve accessToken (corta duración) + refreshToken (larga duración).
 */
function login(req, res) {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ error: "correo y password son obligatorios" });
  }

  const usuario = store.usuarios.find((u) => u.correo === correo);

  // Importante: el mensaje es el mismo si el correo no existe o si la
  // contraseña es incorrecta, para no revelar qué correos están registrados.
  if (!usuario || !bcrypt.compareSync(password, usuario.passwordHash)) {
    return res.status(401).json({ error: "Correo o contraseña incorrectos" });
  }

  const accessToken = generarAccessToken(usuario);
  const refreshToken = generarRefreshToken(usuario);
  store.refreshTokens.add(refreshToken);

  res.json({
    accessToken,
    refreshToken,
    usuario: datosPublicosUsuario(usuario),
  });
}

/**
 * POST /api/auth/refresh
 * Body: { refreshToken }
 * Si el refresh token es válido y no fue revocado, entrega un nuevo access token.
 */
function refrescar(req, res) {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: "refreshToken es obligatorio" });
  }

  if (!store.refreshTokens.has(refreshToken)) {
    return res.status(401).json({ error: "El refresh token fue revocado o no existe" });
  }

  try {
    const payload = verificarRefreshToken(refreshToken);
    const usuario = store.usuarios.find((u) => u.id === payload.sub);
    if (!usuario) {
      return res.status(401).json({ error: "El usuario asociado a este token ya no existe" });
    }

    const nuevoAccessToken = generarAccessToken(usuario);
    res.json({ accessToken: nuevoAccessToken });
  } catch (err) {
    store.refreshTokens.delete(refreshToken);
    return res.status(401).json({ error: "Refresh token inválido o expirado, inicia sesión de nuevo" });
  }
}

/**
 * POST /api/auth/logout
 * Body: { refreshToken }
 * Revoca el refresh token para que no se pueda usar de nuevo.
 */
function logout(req, res) {
  const { refreshToken } = req.body;
  if (refreshToken) {
    store.refreshTokens.delete(refreshToken);
  }
  res.status(204).send();
}

module.exports = { login, refrescar, logout };
