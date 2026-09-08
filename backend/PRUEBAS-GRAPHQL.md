# Pruebas de GraphQL — Nikkei Roll

## Cómo levantar el servidor

```bash
cd nikkei-roll/backend
npm install
npm start
```

Verás en la consola:
```
Servidor GraphQL de Nikkei Roll listo en http://localhost:4000/
```

Abre esa URL en el navegador: se abre **Apollo Sandbox**, un explorador interactivo donde puedes pegar las queries/mutations de abajo y ejecutarlas directamente (botón ▶). También puedes usar Postman/Insomnia apuntando un POST a `http://localhost:4000/` con el body `{ "query": "..." }`.

---

## 1. Query: obtener categorías con sus productos

```graphql
query {
  categorias {
    id
    nombre
    productos {
      id
      nombre
      precio
      disponible
    }
  }
}
```

**Respuesta esperada (resumida):**
```json
{
  "data": {
    "categorias": [
      {
        "id": "1",
        "nombre": "Rolls",
        "productos": [
          { "id": "1", "nombre": "Nikkei Roll Clásico", "precio": 6900, "disponible": true },
          { "id": "2", "nombre": "Acevichado Roll", "precio": 7500, "disponible": true }
        ]
      },
      {
        "id": "2",
        "nombre": "Ceviches",
        "productos": [
          { "id": "3", "nombre": "Ceviche Clásico", "precio": 8900, "disponible": true },
          { "id": "4", "nombre": "Ceviche Mixto", "precio": 9900, "disponible": false }
        ]
      }
    ]
  }
}
```

## 2. Query: productos disponibles de una categoría

```graphql
query {
  productos(idCategoria: "2", soloDisponibles: true) {
    id
    nombre
    precio
    stock
  }
}
```

**Esperado:** solo devuelve "Ceviche Clásico" (el "Ceviche Mixto" tiene `disponible: false`).

## 3. Query: producto por ID (incluye su categoría, demuestra la agregación)

```graphql
query {
  producto(id: "1") {
    nombre
    precio
    categoria {
      nombre
    }
  }
}
```

**Esperado:**
```json
{ "data": { "producto": { "nombre": "Nikkei Roll Clásico", "precio": 6900, "categoria": { "nombre": "Rolls" } } } }
```

## 4. Mutation: crear cliente

```graphql
mutation {
  crearCliente(input: {
    nombre: "Diego Fuentes"
    correo: "diego@example.com"
    telefono: "+56922222222"
  }) {
    id
    nombre
    correo
  }
}
```

**Esperado:** retorna el cliente creado con un nuevo `id` (por ejemplo `"2"`).

**Prueba de error:** ejecútala de nuevo con el mismo correo → debe fallar con `"Ya existe un cliente con ese correo"`.

## 5. Mutation: crear producto

```graphql
mutation {
  crearProducto(input: {
    nombre: "Furai Roll"
    descripcion: "Roll apanado con salsa nikkei"
    precio: 7200
    idCategoria: "1"
    stock: 12
  }) {
    id
    nombre
    disponible
    stock
  }
}
```

**Esperado:** `disponible: true` (porque `stock > 0`).

## 6. Mutation: crear pedido (demuestra cálculo de totales y descuento de stock)

```graphql
mutation {
  crearPedido(input: {
    idCliente: "1"
    items: [
      { idProducto: "1", cantidad: 2 }
      { idProducto: "3", cantidad: 1 }
    ]
  }) {
    id
    estado
    total
    detalles {
      producto { nombre }
      cantidad
      subtotal
    }
  }
}
```

**Esperado:** `total = 6900*2 + 8900*1 = 22700`, estado `CREADO`, y dos líneas en `detalles`.

**Prueba de error:** repite el pedido pidiendo `cantidad: 999` de un producto → debe fallar con `"Stock insuficiente..."`.

## 7. Mutation: actualizar disponibilidad

```graphql
mutation {
  actualizarDisponibilidad(id: "4", disponible: true, stock: 5) {
    id
    nombre
    disponible
    stock
  }
}
```

**Esperado:** "Ceviche Mixto" pasa a `disponible: true`, `stock: 5`.

## 8. Mutation: agregar producto a un pedido existente

```graphql
mutation {
  agregarProductoAPedido(idPedido: "1", item: { idProducto: "2", cantidad: 1 }) {
    id
    total
    detalles {
      producto { nombre }
      subtotal
    }
  }
}
```

**Esperado:** el `total` del pedido "1" aumenta en 7500 y aparece una tercera línea de detalle.

## 9. Mutation: cambiar estado de pedido

```graphql
mutation {
  cambiarEstadoPedido(id: "1", estado: CONFIRMADO) {
    id
    estado
  }
}
```

**Esperado:** `estado: "CONFIRMADO"`.

**Prueba de error:** intenta `agregarProductoAPedido` sobre un pedido en estado `PAGADO` o `ANULADO` (cámbialo primero con esta mutation) → debe fallar con `"No se puede modificar un pedido en estado..."`.

---

## Qué demuestra cada prueba

| # | Concepto que valida |
|---|---|
| 1, 3 | GraphQL como capa de agregación (relaciones resueltas en un solo viaje) |
| 2 | Filtros en queries |
| 4, 5 | Mutations de creación + validación de reglas de negocio |
| 6, 8 | Cálculo de totales y control de stock (lógica de dominio en resolvers) |
| 7, 9 | Actualización de estado / disponibilidad |
