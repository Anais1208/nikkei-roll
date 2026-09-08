# Nikkei Roll — Backend (GraphQL + REST)

## Qué es esto

Backend completo del proyecto Nikkei Roll con las dos capas explicadas por
el profesor:

- **GraphQL** (puerto 4000): capa de agregación interna. `typeDefs` +
  `resolvers` sobre Producto, Categoría, Cliente y Pedido.
- **REST** (puerto 5000): capa expuesta y segura. Login con
  access + refresh token (JWT), autorización por rol, CORS, y actúa de
  gateway hacia GraphQL (nunca toca los datos directamente).

Usa **datos en memoria** (`src/data/store.js`) en vez de PostgreSQL, para
poder levantar todo y probarlo ya mismo sin instalar una base de datos.
La forma de los objetos sigue el modelo de datos de la Fase 3, así que
conectar PostgreSQL después es un cambio acotado a `store.js`.

## Estructura

```
backend/
├── package.json
├── .env.example
├── README.md
├── PRUEBAS-GRAPHQL.md      <- ejemplos de queries/mutations GraphQL
├── FASE6-REST.md            <- documentación de la API REST y su seguridad
├── PRUEBAS-REST.md          <- ejemplos de la API REST con curl
└── src/
    ├── app.js                <- levanta el servidor GraphQL (Apollo)
    ├── data/
    │   └── store.js            <- datos en memoria: productos, clientes,
    │                              pedidos, usuarios, refresh tokens
    ├── graphql/
    │   ├── typeDefs/index.js    <- esquema GraphQL
    │   └── resolvers/index.js   <- lógica GraphQL
    └── rest/
        ├── app.js               <- app Express: CORS, rutas, errores
        ├── server.js            <- levanta el servidor REST
        ├── middleware/
        │   ├── autenticar.js     <- valida el access token (JWT)
        │   ├── autorizar.js      <- valida el rol del usuario
        │   └── manejarErrores.js
        ├── controllers/
        │   ├── authController.js   <- login, refresh, logout
        │   ├── productController.js
        │   └── orderController.js
        ├── routes/
        │   ├── authRoutes.js
        │   ├── productRoutes.js
        │   └── orderRoutes.js
        ├── services/
        │   └── graphqlClient.js   <- REST llama a GraphQL por HTTP interno
        └── utils/
            └── tokens.js          <- genera/verifica access y refresh JWT
```

## Cómo ejecutarlo

Necesitas **dos terminales** (son dos servidores):

```bash
cd nikkei-roll/backend
npm install

# Terminal 1: GraphQL (capa interna)
npm run start:graphql

# Terminal 2: REST (capa expuesta)
npm run start:rest
```

- GraphQL: abre `http://localhost:4000/` (Apollo Sandbox) y sigue
  `PRUEBAS-GRAPHQL.md`.
- REST: sigue `PRUEBAS-REST.md` (curl/Postman) contra `http://localhost:5000`.

## Siguiente paso (Fase 8)

Construir el frontend en React que consuma la API REST: login, catálogo,
carrito, checkout, pedidos propios y panel administrativo.
