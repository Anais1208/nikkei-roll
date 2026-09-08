/**
 * Almacén de datos EN MEMORIA para probar GraphQL sin necesitar
 * PostgreSQL todavía. Cuando se conecte la base de datos real (Fase 4/6),
 * estas funciones se reemplazan por consultas SQL, pero la forma de los
 * objetos (los mismos campos) se mantiene para no romper los resolvers.
 *
 * Supuesto de diseño: se precargan algunos datos de ejemplo de Nikkei Roll
 * para poder probar queries y mutations de inmediato.
 */

let nextId = { categoria: 3, producto: 5, cliente: 2, pedido: 1, detalle: 1 };

const categorias = [
  { id: "1", nombre: "Rolls", descripcion: "Rolls de sushi fusión nikkei" },
  { id: "2", nombre: "Ceviches", descripcion: "Ceviches estilo peruano" },
];

const productos = [
  { id: "1", nombre: "Nikkei Roll Clásico", descripcion: "Palta, salmón, salsa nikkei", precio: 6900, idCategoria: "1", disponible: true, stock: 20 },
  { id: "2", nombre: "Acevichado Roll", descripcion: "Camarón, salsa acevichada", precio: 7500, idCategoria: "1", disponible: true, stock: 15 },
  { id: "3", nombre: "Ceviche Clásico", descripcion: "Pescado blanco, leche de tigre", precio: 8900, idCategoria: "2", disponible: true, stock: 10 },
  { id: "4", nombre: "Ceviche Mixto", descripcion: "Pescado y mariscos, ají amarillo", precio: 9900, idCategoria: "2", disponible: false, stock: 0 },
];

const clientes = [
  { id: "1", nombre: "Camila Rojas", correo: "camila@example.com", telefono: "+56911111111" },
];

const pedidos = [];
const detallesPedido = [];

function generarId(entidad) {
  const id = String(nextId[entidad]++);
  return id;
}

module.exports = {
  categorias,
  productos,
  clientes,
  pedidos,
  detallesPedido,
  generarId,
};
