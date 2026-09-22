# Unidad 2 — API Gateway local con FastAPI y HashiCorp Vault

Laboratorio guiado: seguridad, administración de secretos y enrutamiento
hacia una API en otro host. **Alcance de esta entrega: pasos 1 al 6** de la
guía (hasta "Paso 6: proteger la API remota"), sin el Bearer Token del
Gateway ni la integración Gateway↔Vault (eso es el Paso 8 en adelante).

## Arquitectura (hasta el paso 6)

```
Cliente ──► API Gateway (HOST A, :8000) ──► Backend API (HOST B, :9000)
                                                  ▲
                                          exige X-Gateway-Secret
                                          (credencial fija, aún NO
                                           viene de Vault todavía)

HashiCorp Vault (HOST A, :8200) — levantado y con secretos guardados,
pero el Gateway todavía no lo consulta (eso es el Paso 8/9).
```

| Host | Dirección de ejemplo | Responsabilidad |
|---|---|---|
| HOST A | 192.168.1.10 | API Gateway + Vault |
| HOST B | 192.168.1.20 | API REST de negocio |

**Nota práctica:** si estás probando esto en un solo computador (sin dos
máquinas/VMs), reemplaza `192.168.1.10` y `192.168.1.20` por `127.0.0.1`
en ambos códigos — los puertos (8000, 8200, 9000) ya son distintos, así que
funciona igual en localhost.

## Prerrequisitos

- Python 3.11+
- pip
- Docker (para levantar Vault)
- Conectividad IP entre ambos hosts (o localhost si usas un solo equipo)

| Puerto | Servicio | Host |
|---|---|---|
| 8000 | API Gateway | HOST A |
| 8200 | HashiCorp Vault | HOST A |
| 9000 | Backend API | HOST B |

## Paso 1 — Comprobar conectividad entre hosts

Desde HOST A:
```bash
ping 192.168.1.20
```
Desde HOST B:
```bash
ping 192.168.1.10
```
HOST A debe poder alcanzar a HOST B antes de continuar.

## Paso 2 — Crear la API REST normal en HOST B

```bash
mkdir backend-api
cd backend-api
python -m venv .venv
```

Activar el entorno:
```bash
# Windows PowerShell
.venv\Scripts\Activate.ps1

# Linux/macOS
source .venv/bin/activate
```

Instalar dependencias:
```bash
pip install -r requirements.txt
```

El código inicial (sin protección) está en
[`backend-api/backend_api_paso2_inicial.py`](backend-api/backend_api_paso2_inicial.py).

Ejecutar:
```bash
uvicorn backend_api_paso2_inicial:app --host 0.0.0.0 --port 9000
```

Desde HOST A, probar:
```bash
curl http://192.168.1.20:9000/products
```

En este punto todavía hay acceso directo: `Cliente → Backend API`.

## Paso 3 — Crear un API Gateway básico en HOST A

```bash
mkdir api-gateway
cd api-gateway
python -m venv .venv
pip install -r requirements.txt
```

Código en [`api-gateway/gateway.py`](api-gateway/gateway.py).

Ejecutar:
```bash
uvicorn gateway:app --host 0.0.0.0 --port 8000
```

Probar:
```bash
curl http://192.168.1.10:8000/api/products
```

Ahora existe una primera capa de routing: `Cliente → API Gateway → Backend API`.

## Paso 4 — Levantar HashiCorp Vault en HOST A

Vault en modo desarrollo (solo para fines académicos, no usar así en producción):

```bash
docker run \
  --name vault-dev \
  -p 8200:8200 \
  -e VAULT_DEV_ROOT_TOKEN_ID=dev-only-token \
  -d hashicorp/vault
```

Vault queda disponible en `http://127.0.0.1:8200`, con token raíz `dev-only-token`.

## Paso 5 — Guardar secretos en Vault

Se guardan dos credenciales distintas (separación de identidades: cliente↔Gateway ≠ Gateway↔Backend):

```bash
docker exec \
  -e VAULT_ADDR=http://127.0.0.1:8200 \
  -e VAULT_TOKEN=dev-only-token \
  vault-dev \
  vault kv put secret/gateway \
  client_token="student-token-123" \
  backend_shared_secret="gateway-api-secret-456"
```

Consultar los valores:
```bash
docker exec \
  -e VAULT_ADDR=http://127.0.0.1:8200 \
  -e VAULT_TOKEN=dev-only-token \
  vault-dev \
  vault kv get secret/gateway
```

## Paso 6 — Proteger la API remota

Se reemplaza el backend por [`backend-api/backend_api.py`](backend-api/backend_api.py), que ya **no** acepta llamadas sin el header `X-Gateway-Secret`.

Configurar el secreto en HOST B:
```bash
# Windows PowerShell
$env:INTERNAL_GATEWAY_SECRET="gateway-api-secret-456"

# Linux/macOS
export INTERNAL_GATEWAY_SECRET="gateway-api-secret-456"
```

Ejecutar:
```bash
uvicorn backend_api:app --host 0.0.0.0 --port 9000
```

**Verificación esperada** (llamando directo al backend, sin pasar por el Gateway):
```bash
curl http://192.168.1.20:9000/products
```
```json
{
  "detail": "Solicitud no autorizada desde Gateway"
}
```
→ `403 Forbidden`

Con la credencial correcta sí funciona:
```bash
curl -H "X-Gateway-Secret: gateway-api-secret-456" http://192.168.1.20:9000/products
```

## Conceptos clave demostrados hasta este punto

- **Client Identity ≠ Service Identity:** el token del cliente y el secreto Gateway↔Backend son credenciales distintas, guardadas por separado en Vault.
- **Secret Management ≠ Hardcoded Credentials:** el secreto vive en una variable de entorno / Vault, no en el código fuente.
- **Autenticación vs. Autorización:** en este punto el backend solo valida "¿tienes la credencial interna?" (autenticación de servicio); todavía no hay roles ni scopes (eso es la extensión propuesta en la guía, fuera del alcance de esta entrega).

## Qué queda fuera de esta entrega (pasos 7 en adelante)

El Gateway del Paso 3 **aún no envía** el header `X-Gateway-Secret` ni consulta Vault — eso corresponde a los pasos 8 y 9 de la guía original (Gateway seguro con Bearer Token + integración con Vault), que no forman parte del alcance pedido para esta entrega.

---

✅ **Completado (pasos 1-6):** conectividad, API REST en HOST B, API Gateway básico en HOST A, Vault levantado, secretos guardados, API remota protegida con credencial interna.
➡️ **Fuera de alcance de esta entrega:** Gateway con Bearer Token + Vault (paso 8-9 en adelante), roles/scopes, restricción de red a nivel de firewall.
