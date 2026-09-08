# Nikkei Roll — Backend GraphQL (Fase 5)

## Qué es esto

Implementación funcional de la capa GraphQL para el proyecto Nikkei Roll,
según lo pedido por el profesor: `typeDefs`, `resolvers`, queries y
mutations sobre las entidades Producto, Categoría, Cliente y Pedido.

Por ahora usa **datos en memoria** (`src/data/store.js`) en vez de
PostgreSQL, para que puedas levantar el servidor y probarlo ya mismo sin
instalar una base de datos. La forma de los objetos ya sigue el modelo de
datos de la Fase 3, así que cuando conectemos PostgreSQL (Fase 6, cuando
trabajemos la API REST) solo se reemplaza `store.js` por consultas SQL —
los `typeDefs` y `resolvers` casi no cambian.

## Estructura

```
backend/
├── package.json
├── README.md
├── PRUEBAS-GRAPHQL.md      <- ejemplos de queries/mutations y respuestas esperadas
└── src/
    ├── app.js               <- levanta el servidor Apollo (Standalone)
    ├── data/
    │   └── store.js          <- datos en memoria (reemplazable por SQL después)
    └── graphql/
        ├── typeDefs/
        │   └── index.js       <- esquema: types, inputs, queries, mutations
        └── resolvers/
            └── index.js       <- lógica: resuelve queries, mutations y relaciones
```

## Cómo ejecutarlo

```bash
cd nikkei-roll/backend
npm install
npm start
```

Abre `http://localhost:4000/` en el navegador (Apollo Sandbox) y prueba
las queries/mutations de `PRUEBAS-GRAPHQL.md`.

## Qué revisar para entender el código

1. **`typeDefs/index.js`** — define el "contrato" del API: qué se puede
   preguntar (`Query`) y qué se puede modificar (`Mutation`), y la forma
   de cada entidad (`type Producto { ... }`).
2. **`resolvers/index.js`** — por cada campo del esquema, una función que
   sabe cómo obtener ese dato. Los resolvers de campo (ej. `Producto.categoria`)
   son los que hacen que GraphQL sea una **capa de agregación**: el
   frontend pide `producto { categoria { nombre } }` en un solo viaje, y
   GraphQL internamente resuelve ambas partes.
3. **`data/store.js`** — simula la base de datos. Los `id` son strings
   (convención habitual en GraphQL, tipo `ID`).

## Siguiente paso (Fase 6)

Construir la API REST segura que se ubica **delante** de este servidor
GraphQL: el frontend hablará con REST (con JWT y roles), y REST hará las
llamadas a este GraphQL internamente, tal como se explicó en la
arquitectura de la Fase 1.
