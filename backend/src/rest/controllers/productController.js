const { ejecutarGraphQL } = require("../services/graphqlClient");

/**
 * GET /api/products
 * Público. Query params opcionales: idCategoria, soloDisponibles
 */
async function listar(req, res, next) {
  try {
    const { idCategoria, soloDisponibles } = req.query;

    const data = await ejecutarGraphQL(
      `query Productos($idCategoria: ID, $soloDisponibles: Boolean) {
        productos(idCategoria: $idCategoria, soloDisponibles: $soloDisponibles) {
          id
          nombre
          descripcion
          precio
          disponible
          stock
          categoria { id nombre }
        }
      }`,
      {
        idCategoria: idCategoria || null,
        soloDisponibles: soloDisponibles === "true" ? true : soloDisponibles === "false" ? false : null,
      }
    );

    res.json(data.productos);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/products/:id
 * Público.
 */
async function obtener(req, res, next) {
  try {
    const data = await ejecutarGraphQL(
      `query Producto($id: ID!) {
        producto(id: $id) {
          id nombre descripcion precio disponible stock
          categoria { id nombre }
        }
      }`,
      { id: req.params.id }
    );

    if (!data.producto) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    res.json(data.producto);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/products
 * Protegido: solo ADMIN o DUENO (ver rutas).
 */
async function crear(req, res, next) {
  try {
    const { nombre, descripcion, precio, idCategoria, stock } = req.body;

    const data = await ejecutarGraphQL(
      `mutation CrearProducto($input: CrearProductoInput!) {
        crearProducto(input: $input) {
          id nombre precio disponible stock
        }
      }`,
      { input: { nombre, descripcion, precio, idCategoria, stock } }
    );

    res.status(201).json(data.crearProducto);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/products/:id/disponibilidad
 * Protegido: solo ADMIN o DUENO.
 */
async function actualizarDisponibilidad(req, res, next) {
  try {
    const { disponible, stock } = req.body;

    const data = await ejecutarGraphQL(
      `mutation ActualizarDisponibilidad($id: ID!, $disponible: Boolean!, $stock: Int) {
        actualizarDisponibilidad(id: $id, disponible: $disponible, stock: $stock) {
          id nombre disponible stock
        }
      }`,
      { id: req.params.id, disponible, stock: typeof stock === "number" ? stock : null }
    );

    res.json(data.actualizarDisponibilidad);
  } catch (err) {
    next(err);
  }
}

module.exports = { listar, obtener, crear, actualizarDisponibilidad };
