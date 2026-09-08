const store = require("../../data/store");
const { ejecutarGraphQL } = require("../services/graphqlClient");

/**
 * POST /api/orders
 * Protegido: solo CLIENTE. El idCliente se obtiene del token (req.user),
 * NUNCA del body, para que un cliente no pueda crear pedidos a nombre de otro.
 */
async function crear(req, res, next) {
  try {
    const usuario = store.usuarios.find((u) => u.id === req.user.sub);
    if (!usuario || !usuario.idCliente) {
      return res.status(403).json({ error: "Este usuario no tiene un perfil de cliente asociado" });
    }

    const { items } = req.body;

    const data = await ejecutarGraphQL(
      `mutation CrearPedido($input: CrearPedidoInput!) {
        crearPedido(input: $input) {
          id estado total
          detalles { producto { nombre } cantidad subtotal }
        }
      }`,
      { input: { idCliente: usuario.idCliente, items } }
    );

    res.status(201).json(data.crearPedido);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/orders/me
 * Protegido: solo CLIENTE. Devuelve únicamente los pedidos del usuario autenticado.
 */
async function listarPropios(req, res, next) {
  try {
    const usuario = store.usuarios.find((u) => u.id === req.user.sub);
    if (!usuario || !usuario.idCliente) {
      return res.status(403).json({ error: "Este usuario no tiene un perfil de cliente asociado" });
    }

    const data = await ejecutarGraphQL(
      `query PedidosDeCliente($id: ID!) {
        cliente(id: $id) {
          pedidos {
            id fecha estado total
            detalles { producto { nombre } cantidad subtotal }
          }
        }
      }`,
      { id: usuario.idCliente }
    );

    res.json(data.cliente ? data.cliente.pedidos : []);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/orders/:id/estado
 * Protegido: solo ADMIN o DUENO.
 */
async function cambiarEstado(req, res, next) {
  try {
    const { estado } = req.body;

    const data = await ejecutarGraphQL(
      `mutation CambiarEstadoPedido($id: ID!, $estado: EstadoPedido!) {
        cambiarEstadoPedido(id: $id, estado: $estado) {
          id estado
        }
      }`,
      { id: req.params.id, estado }
    );

    res.json(data.cambiarEstadoPedido);
  } catch (err) {
    next(err);
  }
}

module.exports = { crear, listarPropios, cambiarEstado };
