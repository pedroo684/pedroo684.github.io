# Mejoras SEO para Invierte360 (pedroo684.github.io/Invierte360)

Ya pude acceder a tu web real y confirmar su diseño (paleta bronce/marfil/tinta, tipografías Fraunces + Inter + IBM Plex Mono, marca "Academia de Inversión" mostrada en cabecera y pie). Todo lo generado aquí respeta exactamente ese diseño — no se ha tocado ningún color, fuente ni layout.

## Mapa de archivos: ruta exacta en tu repositorio

| Archivo | Ruta en el repo | Acción |
|---|---|---|
| `sitemap.xml` | `/sitemap.xml` (raíz) | Añadir (nuevo) |
| `robots.txt` | `/robots.txt` (raíz) | Añadir (nuevo) |
| `index_actualizado.html` | `/index_actualizado.html` (raíz) — **luego renombrar a `index.html`** | Reemplaza tu `index.html` actual |
| `sobre.html` | `/sobre.html` (raíz) | Añadir (nuevo) |
| `seo.css` | `/seo.css` (raíz, junto a `style.css`) | Añadir (nuevo) |
| `articulos/que-es-un-etf.html` | `/articulos/que-es-un-etf.html` | Añadir (nuevo, crea la carpeta `articulos/`) |
| `articulos/interes-compuesto.html` | `/articulos/interes-compuesto.html` | Añadir (nuevo) |
| `articulos/como-empezar-a-invertir.html` | `/articulos/como-empezar-a-invertir.html` | Añadir (nuevo) |

## Qué mejora cada archivo (resumen — el detalle está comentado dentro de cada código)

- **`sitemap.xml` / `robots.txt`**: usan tu URL real (`https://pedroo684.github.io/Invierte360/`) en lugar de un dominio de ejemplo, y solo listan páginas reales indexables (nada de anclas `#seccion`, que Google no trata como páginas propias).
- **`index_actualizado.html`**: mismo diseño y contenido que tu `index.html`, con: title y meta description reescritos para SEO, canonical y Open Graph/Twitter apuntando a tu URL real, tu meta de verificación de Search Console ya activa (estaba comentada), un bloque **WebSite** nuevo en JSON-LD, el **FAQPage** ampliado de 6 a 10 preguntas (con las mismas 4 preguntas nuevas también visibles en el acordeón de la página, para que el contenido que ve Google coincida con el que ve el usuario), y enlaces en el menú/pie hacia las dos páginas nuevas (`sobre.html` y `articulos/`).
- **`sobre.html`**: misión, visión, filosofía educativa y contacto (con un email de ejemplo que debes sustituir por el tuyo), con datos estructurados `AboutPage`.
- **`articulos/*.html`** (3 páginas): cada una con title y meta description propios, H1 claro, contenido original de 600-700+ palabras, preguntas frecuentes, enlaces internos entre sí y hacia el índice/ETFs/calculadoras de tu home, y datos estructurados `Article` + `BreadcrumbList`.
- **`seo.css`**: hoja aditiva mínima (no reemplaza tu `style.css`) que da a `sobre.html` y a los artículos una tipografía de lectura cómoda, migas de pan, notas destacadas y un acordeón de FAQ accesible — reutilizando tus mismas variables de color y modo claro/oscuro.

## Antes de subir

- En `sobre.html`, sustituye `contacto@academiadeinversion.com` por tu email real de contacto.
- Sigue pendiente subir una imagen real a `/assets/og-cover.jpg` (1200×630px) para que los enlaces se vean bien al compartirse en redes — ya estaba señalado en tu sitio, no es nuevo.

## Orden recomendado para subir a GitHub

1. `seo.css` (raíz) — no depende de nada más.
2. `sitemap.xml` y `robots.txt` (raíz).
3. Carpeta `articulos/` con sus 3 archivos — ya son autosuficientes y enlazan entre sí.
4. `sobre.html` (raíz) — enlaza a `articulos/`, así que súbela después.
5. `index_actualizado.html` — súbela al final y renómbrala a `index.html` para que reemplace la actual, ya que es la única que depende de que `sobre.html` y `articulos/` existan para que sus enlaces nuevos no queden rotos.

## Después de subir

Ve a Google Search Console → Sitemaps → añade `sitemap.xml`. Como tu verificación ya está activa en `index_actualizado.html`, no necesitas reverificar la propiedad, solo enviar el sitemap para acelerar el rastreo de las páginas nuevas.
