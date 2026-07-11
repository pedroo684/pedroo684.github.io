# Ampliación — Fase 6: Simulador de portafolios (nueva sección "Herramientas")

## Qué contiene esta entrega

```
archivos-nuevos-fase6/
├── herramientas.css              # NUEVO — estilos de la sección Herramientas
├── herramientas.js                # NUEVO — tema, menú móvil y cookies para esta sección
├── index-actualizado.html         # Reemplaza a tu index.html raíz (añade enlace "Herramientas")
└── herramientas/                  # NUEVA carpeta
    ├── index.html                 # Portada de la sección Herramientas
    ├── simulador-portafolios.html # El simulador en sí
    └── simulador-portafolios.js   # Lógica del simulador
```

Nada de lo que ya tenías ha sido modificado.

## Cómo subirlo

1. Sube `herramientas.css` y `herramientas.js` a la **raíz** del repositorio (junto a `style.css`, `blog.css`, `calculadoras.css`, etc.).
2. Crea una carpeta `herramientas` en la raíz y sube ahí los 3 archivos de la carpeta `herramientas/` de esta entrega.
3. `index-actualizado.html` reemplaza a tu `index.html` — añade un enlace **"Herramientas"** al menú y al pie de página, además de los que ya tenía (Blog, Calculadoras+).

## Qué hace el simulador

El **Simulador de portafolios** (`herramientas/simulador-portafolios.html`) deja al usuario repartir un 100% entre 7 clases de activo — S&amp;P 500, Nasdaq-100, Bonos, Oro, Bitcoin, REITs y Efectivo — usando controles deslizantes, y calcula al instante:

- **Rentabilidad esperada**, como media ponderada de rendimientos históricos aproximados por activo.
- **Riesgo estimado**, con un indicador visual de nivel (bajo/medio/alto).
- **Puntuación de diversificación** (basada en el índice de Herfindahl), con etiqueta Baja/Media/Alta.
- **Gráfico circular** de la composición de la cartera.
- **Gráfico de proyección** a varios años con tres escenarios (optimista, esperado, pesimista), calculado a partir del capital inicial y el número de años que indique el usuario.

Incluye un aviso explícito de que las cifras son aproximaciones educativas simplificadas (el cálculo de riesgo combinado no modela la correlación real entre activos), tanto en la propia herramienta como en sus preguntas frecuentes — importante de cara a la revisión de AdSense, dado que es contenido financiero.

La portada `herramientas/index.html` ya incluye una tarjeta "Próximamente" para el comparador de ETFs, que será la siguiente pieza a construir.

## Qué sigue

Quedan pendientes: el **comparador de ETFs**, el **glosario** de 300+ términos y el **curso gratuito** de 5 niveles. Dime por cuál seguimos.
