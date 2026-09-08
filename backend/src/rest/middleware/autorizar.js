/**
 * Autorización = qué puedes hacer.
 * Se usa DESPUÉS de "autenticar" (por eso lee req.user, que ese middleware deja listo).
 * Uso: router.post("/", autenticar, autorizar("ADMIN", "DUENO"), controller.crear)
 */
function autorizar(...rolesPermitidos) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "No autenticado" });
    }
    if (!rolesPermitidos.includes(req.user.rol)) {
      return res.status(403).json({
        error: `El rol "${req.user.rol}" no tiene permiso para esta acción`,
      });
    }
    next();
  };
}

module.exports = autorizar;
