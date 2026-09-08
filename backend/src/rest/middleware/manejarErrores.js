/**
 * Manejador centralizado de errores (RNF8). Cualquier controller que haga
 * "next(err)" o cuyo error no sea capturado llega aquí, así el formato de
 * respuesta de error es siempre el mismo en toda la API.
 */
function manejarErrores(err, req, res, next) {
  console.error(err);

  const status = err.status || 500;
  const mensaje = err.expose ? err.message : "Ocurrió un error inesperado en el servidor";

  res.status(status).json({ error: mensaje });
}

module.exports = manejarErrores;
