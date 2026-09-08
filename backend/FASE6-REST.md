# Nikkei Roll — Fase 6: API REST Segura

## 1. Qué se implementó

Siguiendo el diagrama que explicó el profesor en clase (login con access + refresh
token, API Gateway con Auth, CORS, y servidor interno detrás de una capa de red
privada), se construyó la API REST que se ubica **delante** de GraphQL:

```
Frontend
   |
   v
API REST (Express, puerto 5000)   <-- capa expuesta: CORS, autenticación, autorización
   |  (autenticar -> autorizar -> controller)
   v
GraphQL (Apollo, puerto 4000)     <-- capa de agregación interna
   |
   v
Datos
```

## 2. Autenticación: Access Token + Refresh Token

| Endpoint | Método | Protegido | Descripción |
|---|---|---|---|
| `/api/auth/login` | POST | No | Recibe `{correo, password}`, devuelve `accessToken` (15 min) + `refreshToken` (7 días) |
| `/api/auth/refresh` | POST | No (pero requiere refresh token válido) | Recibe `{refreshToken}`, devuelve un nuevo `accessToken` |
| `/api/auth/logout` | POST | No | Recibe `{refreshToken}`, lo revoca (queda inutilizable) |

**Por qué dos tokens:**
- El **access token** viaja en cada petición (`Authorization: Bearer <token>`) y dura poco — si alguien lo roba, el daño está acotado a 15 minutos.
- El **refresh token** dura más y solo se usa para pedir un access token nuevo sin loguearse de nuevo. Se guarda una lista de refresh tokens vigentes en el servidor (`store.refreshTokens`), así "cerrar sesión" realmente invalida el token, no es solo borrarlo del navegador.

Usuarios de prueba precargados:

| Correo | Password | Rol |
|---|---|---|
| admin@nikkeiroll.cl | admin123 | ADMIN |
| camila@example.com | cliente123 | CLIENTE |

## 3. Autorización por rol

Cada ruta protegida declara qué roles pueden usarla:

| Endpoint | Método | Roles permitidos |
|---|---|---|
| `/api/products` | GET | Público (cualquiera) |
| `/api/products/:id` | GET | Público |
| `/api/products` | POST | ADMIN, DUENO |
| `/api/products/:id/disponibilidad` | PUT | ADMIN, DUENO |
| `/api/orders` | POST | CLIENTE |
| `/api/orders/me` | GET | CLIENTE |
| `/api/orders/:id/estado` | PUT | ADMIN, DUENO |

El flujo en cada ruta protegida es: `autenticar` (¿el token es válido? → llena `req.user`) → `autorizar("ADMIN","DUENO")` (¿el rol de `req.user` está permitido?) → recién ahí se ejecuta el controller.

## 4. CORS

Configurado en `src/rest/app.js` para aceptar solo el origen definido en `FRONTEND_ORIGIN` (por defecto `http://localhost:3000`, el puerto típico de una app React en desarrollo). Esto evita que cualquier sitio web arbitrario pueda llamar a la API desde el navegador de un usuario logueado.

## 5. REST → GraphQL (la flecha del diagrama)

`src/rest/services/graphqlClient.js` hace lo que en el diagrama es la conexión entre el API Gateway y el servidor interno: cada controller arma una query/mutation GraphQL y la envía por HTTP a `GRAPHQL_INTERNAL_URL`. REST nunca toca `store.js` directamente para productos/pedidos — siempre pasa por GraphQL, respetando la arquitectura de capas.

La única excepción es `usuarios`/`refreshTokens`, que pertenecen al dominio de seguridad de REST, no al de negocio de GraphQL — por eso viven en el mismo `store.js` pero se usan directo desde los controllers de auth/orders (para mapear el usuario logueado a su `idCliente`).

## 6. Del diagrama del profesor a este proyecto: qué se implementó y qué queda como diseño

| Elemento del diagrama | En este proyecto |
|---|---|
| Client / Browser | Frontend (Fase 8, aún no construido) |
| Access / Refresh tokens | ✅ Implementado (JWT, ver sección 2) |
| API Gateway + Auth | ✅ Implementado (middlewares `autenticar` + `autorizar`) |
| OAuth / OIDC | **Supuesto de diseño:** se simplificó a login propio con correo/contraseña. Un login federado (Google, etc.) es una extensión posible pero no forma parte del alcance mínimo del curso. |
| CORS | ✅ Implementado |
| routing / valid scope / expiration | ✅ Implementado (expiración de JWT + verificación de rol en cada ruta) |
| VPC, NAT, servidor privado, ¿IP? | **No implementado como infraestructura real** (es un proyecto académico corriendo en local) — ver sección 7 para cómo se traduciría a un despliegue real. |

## 7. Cómo se vería en un despliegue real (VPC/NAT) — documentación, no implementado

Si este sistema se desplegara en un proveedor cloud (ej. AWS), la separación de redes del diagrama se vería así:

```
Internet
   |
   v
[ API Gateway / Load Balancer ]  <-- única IP pública, aquí vive CORS y TLS
   |
   v
[ VPC privada ]
   |-- Subred pública:  API REST (Express) - recibe tráfico del Gateway
   |
   |-- Subred privada:  GraphQL (Apollo) - SIN IP pública, solo alcanzable
   |                     desde la subred pública dentro de la misma VPC
   |
   +-- NAT Gateway: permite que la subred privada salga a internet
                     (ej. para llamar a un servicio de correo externo)
                     sin que nada de afuera pueda entrar directamente a ella
   |
   v
[ Base de datos PostgreSQL ] <-- en la subred más privada, solo accesible
                                  desde GraphQL, nunca desde internet
```

**Idea clave:** entre más "adentro" está un componente, menos expuesto está. El API REST es la única puerta pública; GraphQL y la base de datos jamás reciben tráfico directo de internet — todo pasa primero por la validación de token y rol en la capa REST.

---

✅ **Completado:** Access/refresh token con JWT, middlewares de autenticación y autorización por rol, CORS, API REST como gateway hacia GraphQL, documentación de cómo se traduciría a una arquitectura de despliegue real con VPC/NAT.
⚠️ **Pendiente:** Frontend, integración end-to-end, pruebas automatizadas, documentación final, preparación de defensa.
➡️ **Siguiente paso:** Fase 8 — Frontend en React que consuma esta API REST (login, catálogo, carrito, pedidos, panel admin).
