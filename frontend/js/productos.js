/**
 * JS compartido por todas las páginas del frontend de Nikkei Roll.
 *
 * Datos de productos: por ahora son datos de ejemplo en el propio archivo
 * (mismos que en el backend GraphQL, ver /backend/src/data/store.js), para
 * que el catálogo se pueda navegar sin depender de que el backend esté
 * corriendo. Cuando se conecte con la API REST (Fase 9: integración), esta
 * lista se reemplaza por un fetch() a /api/products.
 */

const PRODUCTOS = [
  {
    id: "1",
    nombre: "Nikkei Roll Clásico",
    descripcion: "Palta, salmón y salsa nikkei sobre arroz sazonado.",
    precio: 6900,
    categoria: "Rolls",
    disponible: true,
    imagen:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=500&q=60",
  },
  {
    id: "2",
    nombre: "Acevichado Roll",
    descripcion: "Camarón envuelto en salsa acevichada picante.",
    precio: 7500,
    categoria: "Rolls",
    disponible: true,
    imagen:
      "https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=500&q=60",
  },
  {
    id: "3",
    nombre: "Ceviche Clásico",
    descripcion: "Pescado blanco fresco marinado en leche de tigre.",
    precio: 8900,
    categoria: "Ceviches",
    disponible: true,
    imagen:
      "https://images.unsplash.com/photo-1625944230945-1b7dd3b949ab?auto=format&fit=crop&w=500&q=60",
  },
  {
    id: "4",
    nombre: "Ceviche Mixto",
    descripcion: "Pescado y mariscos con ají amarillo y camote.",
    precio: 9900,
    categoria: "Ceviches",
    disponible: false,
    imagen:
      "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?auto=format&fit=crop&w=500&q=60",
  },
  {
    id: "5",
    nombre: "Furai Roll",
    descripcion: "Roll apanado y crocante bañado en salsa nikkei.",
    precio: 7200,
    categoria: "Rolls",
    disponible: true,
    imagen:
      "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=500&q=60",
  },
];

function formatearPrecio(numero) {
  return numero.toLocaleString("es-CL", { style: "currency", currency: "CLP" });
}

function crearTarjetaProducto(producto) {
  return `
    <article class="tarjeta-producto">
      <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy" />
      <div class="info">
        <span class="categoria">${producto.categoria}</span>
        <h3>${producto.nombre}</h3>
        <p class="descripcion">${producto.descripcion}</p>
        <div class="precio-fila">
          <span class="precio">${formatearPrecio(producto.precio)}</span>
          ${
            producto.disponible
              ? `<button class="boton-agregar" data-id="${producto.id}">Agregar</button>`
              : `<span class="etiqueta-agotado">Agotado</span>`
          }
        </div>
      </div>
    </article>
  `;
}

/** Menú responsive (hamburguesa) — reutilizable en cualquier página */
function inicializarMenu() {
  const boton = document.querySelector(".boton-menu");
  const enlaces = document.querySelector(".nav-links");
  if (!boton || !enlaces) return;

  boton.addEventListener("click", () => {
    enlaces.classList.toggle("abierto");
  });
}

document.addEventListener("DOMContentLoaded", inicializarMenu);
