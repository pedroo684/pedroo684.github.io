# Ampliación — Fase 1: Blog (estructura base + primeros 6 artículos)

## Qué contiene esta entrega

```
archivos-nuevos/
├── blog.css                 # NUEVO — estilos del blog (no toca style.css)
├── blog.js                  # NUEVO — JS del blog (no toca script.js)
├── index-actualizado.html   # Copia de tu index.html + 2 enlaces al blog (opcional)
└── blog/                    # NUEVA carpeta con la portada del blog y 6 artículos
    ├── index.html
    ├── que-es-invertir.html
    ├── que-es-un-etf.html
    ├── interes-compuesto.html
    ├── diversificacion.html
    ├── dollar-cost-averaging.html
    └── como-empezar-con-poco-dinero.html
```

## Nada de lo que ya tenías ha sido tocado

`index.html`, `style.css`, `script.js`, `privacy-policy.html`, `sitemap.xml`, `robots.txt` y `ads.txt` siguen exactamente igual que antes. Todo lo de arriba son archivos **nuevos**, salvo `index-actualizado.html`, que es una copia alternativa por si quieres enlazar el blog desde el menú principal.

## Cómo subirlo a tu repositorio de GitHub

1. Sube `blog.css` y `blog.js` a la **raíz** del repositorio (al mismo nivel que `style.css` y `script.js`).
2. Crea una carpeta llamada `blog` en la raíz del repositorio (si usas GitHub desde el móvil: "Add file" → "Create new file" → escribe `blog/index.html` como nombre, GitHub crea la carpeta sola) y sube ahí los 6 archivos `.html` de la carpeta `blog/` de esta entrega.
3. **Opcional pero recomendado:** para que la gente pueda llegar al blog desde tu página principal, reemplaza tu `index.html` actual por `index-actualizado.html` (solo tiene 2 líneas añadidas: un enlace "Blog" en el menú de arriba y otro en el pie de página — nada más ha cambiado). Si prefieres no tocar tu `index.html` todavía, el blog funciona igualmente por su cuenta, solo que nadie lo encontrará desde la home hasta que enlaces a `blog/index.html` desde algún sitio.

## Qué hace cada artículo

Cada artículo es una página HTML independiente con:
- Meta title, meta description, keywords, Open Graph, Twitter Card
- Datos estructurados Schema.org (`Article`, `BreadcrumbList` y `FAQPage`)
- Tabla de contenidos con enlaces internos a cada sección
- Ilustración SVG propia (ligera, sin imágenes externas que ralenticen la carga)
- Preguntas frecuentes con `<details>` (sin necesitar JavaScript)
- Enlaces internos a otros artículos y a secciones de tu página principal
- El mismo aviso legal y política de cookies que el resto del sitio

## Por qué no están los 50 artículos todavía

Generar 50 artículos de 1.500-2.500 palabras cada uno (bien escritos, no rellenados) es, en conjunto, más contenido que un libro. Prefiero entregarte tandas de calidad real que puedas revisar e ir subiendo, en lugar de un volumen enorme de contenido más débil. Esta primera tanda ya establece la plantilla (SEO, estructura, estilo) que usaremos para el resto.

**Cuando quieras seguir, dime "siguiente tanda de artículos"** y seguimos con el siguiente bloque temático (por ejemplo: ETFs concretos — S&P 500, Nasdaq-100, QQQ, VOO — o bien errores del inversor y psicología, lo que prefieras).
