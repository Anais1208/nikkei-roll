# Pruebas de la API REST — Nikkei Roll (Fase 6)

## Cómo levantar todo

Necesitas **dos terminales** (GraphQL y REST son dos servidores separados,
tal como en la arquitectura de capas):

```bash
cd nikkei-roll/backend
npm install

# Terminal 1
npm run start:graphql
# -> Servidor GraphQL de Nikkei Roll listo en http://localhost:4000/

# Terminal 2
npm run start:rest
# -> API REST de Nikkei Roll escuchando en http://localhost:5000
```

Todas las pruebas de abajo usan `curl`, pero puedes pegarlas igual en Postman/Insomnia.

---

## 1. Login (obtener access + refresh token)

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"admin@nikkeiroll.cl","password":"admin123"}'
```

**Esperado:**
```json
{
  "accessToken": "eyJhbGciOi...",
  "refreshToken": "eyJhbGciOi...",
  "usuario": { "id": "1", "nombre": "Admin Nikkei Roll", "correo": "admin@nikkeiroll.cl", "rol": "ADMIN" }
}
```

**Prueba de error:** repite con una password incorrecta → `401 {"error":"Correo o contraseña incorrectos"}`.

Guarda el `accessToken` en una variable para las siguientes pruebas:
```bash
TOKEN_ADMIN="pega_aqui_el_accessToken"
```

## 2. Ver catálogo (público, sin token)

```bash
curl http://localhost:5000/api/products
```

**Esperado:** la lista de productos precargados (sin necesitar login).

## 3. Crear producto (protegido, requiere rol ADMIN/DUENO)

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN_ADMIN" \
  -d '{"nombre":"Furai Roll","descripcion":"Roll apanado","precio":7200,"idCategoria":"1","stock":12}'
```

**Esperado:** `201` con el producto creado.

**Prueba de error (sin token):**
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test","precio":1000,"idCategoria":"1","stock":1}'
```
→ `401 {"error":"Falta el token de acceso..."}`

## 4. Login como cliente y crear un pedido

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"correo":"camila@example.com","password":"cliente123"}'

TOKEN_CLIENTE="pega_aqui_el_accessToken_de_camila"

curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN_CLIENTE" \
  -d '{"items":[{"idProducto":"1","cantidad":2}]}'
```

**Esperado:** `201` con el pedido creado y su total calculado.

**Prueba de error (autorización):** intenta crear un pedido usando `$TOKEN_ADMIN` en vez de `$TOKEN_CLIENTE` → `403 {"error":"El rol \"ADMIN\" no tiene permiso para esta acción"}` (el admin no tiene rol CLIENTE).

## 5. Ver mis pedidos (cliente)

```bash
curl http://localhost:5000/api/orders/me \
  -H "Authorization: Bearer $TOKEN_CLIENTE"
```

**Esperado:** solo los pedidos de Camila, nunca los de otro cliente.

## 6. Cambiar estado de un pedido (admin)

```bash
curl -X PUT http://localhost:5000/api/orders/1/estado \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN_ADMIN" \
  -d '{"estado":"CONFIRMADO"}'
```

## 7. Refrescar el access token

```bash
curl -X POST http://localhost:5000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$REFRESH_TOKEN_ADMIN\"}"
```

**Esperado:** un `accessToken` nuevo, sin necesidad de volver a mandar correo/password.

## 8. Logout (revocar el refresh token)

```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$REFRESH_TOKEN_ADMIN\"}"
```

**Prueba:** intenta usar ese mismo `refreshToken` en `/api/auth/refresh` de nuevo → `401 {"error":"El refresh token fue revocado o no existe"}`.

---

## Qué demuestra cada prueba

| # | Concepto que valida |
|---|---|
| 1 | Autenticación (login) y emisión de access + refresh token |
| 2 | Endpoints públicos vs protegidos |
| 3 | Autorización por rol (autenticar + autorizar) |
| 4, 5 | El REST arma el `idCliente` desde el token, no confía en el body |
| 6 | Autorización distinta según el endpoint |
| 7 | Renovación de sesión sin volver a pedir contraseña |
| 8 | Revocación real de sesión (logout que invalida el token en el servidor) |
