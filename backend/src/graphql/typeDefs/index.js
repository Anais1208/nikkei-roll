const { gql } = require("graphql-tag");

const typeDefs = gql`
  type Categoria {
    id: ID!
    nombre: String!
    descripcion: String
    productos: [Producto!]!
  }

  type Producto {
    id: ID!
    nombre: String!
    descripcion: String
    precio: Float!
    disponible: Boolean!
    stock: Int!
    categoria: Categoria!
  }

  type Cliente {
    id: ID!
    nombre: String!
    correo: String!
    telefono: String
    pedidos: [Pedido!]!
  }

  type DetallePedido {
    id: ID!
    producto: Producto!
    cantidad: Int!
    precioUnitario: Float!
    subtotal: Float!
  }

  type Pedido {
    id: ID!
    cliente: Cliente!
    fecha: String!
    estado: EstadoPedido!
    total: Float!
    detalles: [DetallePedido!]!
  }

  enum EstadoPedido {
    CREADO
    CONFIRMADO
    PAGADO
    ANULADO
  }

  input CrearClienteInput {
    nombre: String!
    correo: String!
    telefono: String
  }

  input CrearProductoInput {
    nombre: String!
    descripcion: String
    precio: Float!
    idCategoria: ID!
    stock: Int!
  }

  input ItemPedidoInput {
    idProducto: ID!
    cantidad: Int!
  }

  input CrearPedidoInput {
    idCliente: ID!
    items: [ItemPedidoInput!]!
  }

  type Query {
    "Lista todas las categorías con sus productos"
    categorias: [Categoria!]!

    "Lista productos, opcionalmente filtrando por categoría y disponibilidad"
    productos(idCategoria: ID, soloDisponibles: Boolean): [Producto!]!

    "Obtiene un producto por su ID"
    producto(id: ID!): Producto

    "Lista todos los clientes"
    clientes: [Cliente!]!

    "Obtiene un cliente por su ID, incluyendo sus pedidos"
    cliente(id: ID!): Cliente

    "Lista todos los pedidos"
    pedidos: [Pedido!]!

    "Obtiene un pedido por su ID"
    pedido(id: ID!): Pedido
  }

  type Mutation {
    "Crea un nuevo cliente"
    crearCliente(input: CrearClienteInput!): Cliente!

    "Crea un nuevo producto"
    crearProducto(input: CrearProductoInput!): Producto!

    "Actualiza la disponibilidad/stock de un producto"
    actualizarDisponibilidad(id: ID!, disponible: Boolean!, stock: Int): Producto!

    "Crea un pedido con uno o más productos (calcula totales automáticamente)"
    crearPedido(input: CrearPedidoInput!): Pedido!

    "Agrega un producto adicional a un pedido existente que aún no está pagado"
    agregarProductoAPedido(idPedido: ID!, item: ItemPedidoInput!): Pedido!

    "Cambia el estado de un pedido (ej: CONFIRMADO -> PAGADO)"
    cambiarEstadoPedido(id: ID!, estado: EstadoPedido!): Pedido!
  }
`;

module.exports = typeDefs;
