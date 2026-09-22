# Nikkei Roll — Frontend (Fase 8, entrega parcial)

Entrega mínima pedida por el profesor: **frontend responsivo, con CSS y JS,
navegable**, siguiendo el sketch y la paleta de colores del caso.

## Paleta de colores

Cálida, fusión peruano-japonesa:

| Color | Uso |
|---|---|
| `#B3261E` — rojo laca japonesa | Header, botones principales, precios |
| `#E08D3C` — naranjo (ají / atardecer) | Acentos, categorías, filtros |
| `#D4AF37` — dorado | Detalles, botón hero, hover de nav |
| `#FFF8F0` — crema | Fondo general |
| `#2B2118` — texto cálido | Textos y footer |

## Páginas incluidas

- **`index.html`** — Inicio: hero, 3 razones para elegir Nikkei Roll, productos destacados.
- **`catalogo.html`** — Catálogo completo con filtro por categoría (Todos / Rolls / Ceviches), en JS puro (sin backend todavía).

## Cómo verlo

No necesita instalar nada: abre `index.html` directamente en el navegador,
o usa la extensión "Live Server" de VS Code para verlo con recarga automática.

## Es responsive y navegable

- El menú se convierte en hamburguesa (☰) en pantallas angostas (`css/styles.css`, sección `@media`).
- La grilla de productos se reacomoda sola según el ancho de pantalla (CSS Grid `auto-fit`).
- La navegación entre Inicio ↔ Catálogo funciona con enlaces reales (`<a href>`), no anclas falsas.

## Próximos pasos (fuera de esta entrega parcial)

- Detalle de producto, carrito, checkout, login/registro, pedidos propios, panel admin.
- Conectar `js/productos.js` a la API REST real (`GET /api/products`) en vez de los datos de ejemplo — eso es la Fase 9 (Integración).

## Nota sobre las imágenes

Las fotos de los platos son de stock (Unsplash) solo para maquetar el diseño.
Reemplázalas por fotografía real de Nikkei Roll antes de la entrega final del semestre.
