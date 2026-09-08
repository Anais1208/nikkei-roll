const { GraphQLError } = require("graphql");
const store = require("../../data/store");

function buscarProductoOFallar(id) {
  const producto = store.productos.find((p) => p.id === id);
  if (!producto) {
    throw new GraphQLError(`No existe el producto con id ${id}`, {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }
  return producto;
}

function buscarClienteOFallar(id) {
  const cliente = store.clientes.find((c) => c.id === id);
  if (!cliente) {
    throw new GraphQLError(`No existe el cliente con id ${id}`, {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }
  return cliente;
}

function buscarPedidoOFallar(id) {
  const pedido = store.pedidos.find((p) => p.id === id);
  if (!pedido) {
    throw new GraphQLError(`No existe el pedido con id ${id}`, {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }
  return pedido;
}

function recalcularTotal(pedido) {
  const detalles = store.detallesPedido.filter((d) => d.idPedido === pedido.id);
  pedido.total = detalles.reduce((acc, d) => acc + d.subtotal, 0);
}

const resolvers = {
  Query: {
    categorias: () => store.categorias,

    productos: (_, { idCategoria, soloDisponibles }) => {
      let resultado = store.productos;
      if (idCategoria) {
        resultado = resultado.filter((p) => p.idCategoria === idCategoria);
      }
      if (soloDisponibles) {
        resultado = resultado.filter((p) => p.disponible);
      }
      return resultado;
    },

    producto: (_, { id }) => store.productos.find((p) => p.id === id) || null,

    clientes: () => store.clientes,

    cliente: (_, { id }) => store.clientes.find((c) => c.id === id) || null,

    pedidos: () => store.pedidos,

    pedido: (_, { id }) => store.pedidos.find((p) => p.id === id) || null,
  },

  Mutation: {
    crearCliente: (_, { input }) => {
      const existe = store.clientes.some((c) => c.correo === input.correo);
      if (existe) {
        throw new GraphQLError("Ya existe un cliente con ese correo", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      const nuevo = {
        id: store.generarId("cliente"),
        nombre: input.nombre,
        correo: input.correo,
        telefono: input.telefono || null,
      };
      store.clientes.push(nuevo);
      return nuevo;
    },

    crearProducto: (_, { input }) => {
      const categoria = store.categorias.find((c) => c.id === input.idCategoria);
      if (!categoria) {
        throw new GraphQLError(`No existe la categoría ${input.idCategoria}`, {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }
      const nuevo = {
        id: store.generarId("producto"),
        nombre: input.nombre,
        descripcion: input.descripcion || null,
        precio: input.precio,
        idCategoria: input.idCategoria,
        disponible: input.stock > 0,
        stock: input.stock,
      };
      store.productos.push(nuevo);
      return nuevo;
    },

    actualizarDisponibilidad: (_, { id, disponible, stock }) => {
      const producto = buscarProductoOFallar(id);
      producto.disponible = disponible;
      if (typeof stock === "number") {
        producto.stock = stock;
      }
      return producto;
    },

    crearPedido: (_, { input }) => {
      const cliente = buscarClienteOFallar(input.idCliente);

      if (!input.items || input.items.length === 0) {
        throw new GraphQLError("El pedido debe tener al menos un producto", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      const pedido = {
        id: store.generarId("pedido"),
        idCliente: cliente.id,
        fecha: new Date().toISOString(),
        estado: "CREADO",
        total: 0,
      };
      store.pedidos.push(pedido);

      for (const item of input.items) {
        const producto = buscarProductoOFallar(item.idProducto);
        if (!producto.disponible || producto.stock < item.cantidad) {
          throw new GraphQLError(
            `Stock insuficiente para el producto "${producto.nombre}"`,
            { extensions: { code: "BAD_USER_INPUT" } }
          );
        }
        producto.stock -= item.cantidad;
        producto.disponible = producto.stock > 0;

        store.detallesPedido.push({
          id: store.generarId("detalle"),
          idPedido: pedido.id,
          idProducto: producto.id,
          cantidad: item.cantidad,
          precioUnitario: producto.precio,
          subtotal: producto.precio * item.cantidad,
        });
      }

      recalcularTotal(pedido);
      return pedido;
    },

    agregarProductoAPedido: (_, { idPedido, item }) => {
      const pedido = buscarPedidoOFallar(idPedido);
      if (pedido.estado === "PAGADO" || pedido.estado === "ANULADO") {
        throw new GraphQLError(
          `No se puede modificar un pedido en estado ${pedido.estado}`,
          { extensions: { code: "BAD_USER_INPUT" } }
        );
      }
      const producto = buscarProductoOFallar(item.idProducto);
      if (!producto.disponible || producto.stock < item.cantidad) {
        throw new GraphQLError(
          `Stock insuficiente para el producto "${producto.nombre}"`,
          { extensions: { code: "BAD_USER_INPUT" } }
        );
      }
      producto.stock -= item.cantidad;
      producto.disponible = producto.stock > 0;

      store.detallesPedido.push({
        id: store.generarId("detalle"),
        idPedido: pedido.id,
        idProducto: producto.id,
        cantidad: item.cantidad,
        precioUnitario: producto.precio,
        subtotal: producto.precio * item.cantidad,
      });

      recalcularTotal(pedido);
      return pedido;
    },

    cambiarEstadoPedido: (_, { id, estado }) => {
      const pedido = buscarPedidoOFallar(id);
      pedido.estado = estado;
      return pedido;
    },
  },

  // Resolvers de campo (relaciones) — esto es lo que hace de GraphQL
  // una capa de agregación: cada type resuelve sus relaciones sin que
  // el cliente tenga que hacer múltiples llamadas.
  Categoria: {
    productos: (categoria) =>
      store.productos.filter((p) => p.idCategoria === categoria.id),
  },

  Producto: {
    categoria: (producto) =>
      store.categorias.find((c) => c.id === producto.idCategoria),
  },

  Cliente: {
    pedidos: (cliente) =>
      store.pedidos.filter((p) => p.idCliente === cliente.id),
  },

  Pedido: {
    cliente: (pedido) => buscarClienteOFallar(pedido.idCliente),
    detalles: (pedido) =>
      store.detallesPedido.filter((d) => d.idPedido === pedido.id),
  },

  DetallePedido: {
    producto: (detalle) => buscarProductoOFallar(detalle.idProducto),
  },
};

module.exports = resolvers;
