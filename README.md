# Nikkei Roll — Sistema de Ventas Online

Proyecto académico del ramo **Desarrollo Web y Mobile** — Caso 19: *Comida nikkei "Nikkei Roll" — sushi fusión peruano-japonés*.

Sistema de ventas online que permite a los clientes explorar el catálogo, armar pedidos y pagarlos en línea, y a la administración gestionar productos, despachos y reportes de venta.

## Estado actual del proyecto

| Fase | Contenido | Estado |
|---|---|---|
| 1 | Análisis, requerimientos, casos de uso, arquitectura | ✅ |
| 2 | Matriz de trazabilidad | ✅ |
| 3 | Modelo de datos + script SQL | ✅ |
| 4 | Backend base | ✅ |
| 5 | **GraphQL (typeDefs, resolvers, queries, mutations)** | ✅ |
| 6 | API REST segura | ⚠️ Pendiente |
| 7 | Seguridad (JWT, bcrypt, roles) | ⚠️ Pendiente |
| 8 | Frontend | ⚠️ Pendiente |
| 9 | Integración | ⚠️ Pendiente |
| 10 | Pruebas | ⚠️ Pendiente |
| 11 | Documentación final y defensa | ⚠️ Pendiente |

## Arquitectura

```
Frontend
   |
   v
API REST segura   <-- capa expuesta (auth, roles, validaciones)
   |
   v
GraphQL           <-- capa de agregación interna (typeDefs + resolvers)
   |
   v
Base de datos (PostgreSQL)
```

## Estructura del repositorio

```
nikkei-roll/
└── backend/            <- API GraphQL funcional (Fase 5)
    ├── src/
    │   ├── app.js
    │   ├── data/store.js
    │   └── graphql/
    │       ├── typeDefs/
    │       └── resolvers/
    ├── package.json
    ├── README.md
    └── PRUEBAS-GRAPHQL.md
```

## Cómo ejecutar el backend

```bash
cd backend
npm install
npm start
```

Abre `http://localhost:4000/` para probar las queries y mutations en Apollo Sandbox. Ejemplos completos de pruebas (con respuestas esperadas) en [`backend/PRUEBAS-GRAPHQL.md`](backend/PRUEBAS-GRAPHQL.md).

## Stack tecnológico

React (frontend) · Node.js + Express (REST) · Apollo Server (GraphQL) · PostgreSQL (datos) · JWT + bcrypt (seguridad).
