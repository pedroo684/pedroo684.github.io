# Ampliación — Fase 5: 12 calculadoras nuevas

## Qué contiene esta entrega

```
archivos-nuevos-fase5/
├── calculadoras.css              # NUEVO — estilos de las calculadoras (no toca style.css)
├── calculadoras.js               # NUEVO — lógica de las 12 calculadoras (no toca script.js)
├── index-actualizado.html        # Reemplaza a tu index.html raíz (añade enlace "Calculadoras+")
└── calculadoras/                 # NUEVA carpeta con la portada y las 12 calculadoras
    ├── index.html
    ├── interes-compuesto-avanzada.html
    ├── inflacion.html
    ├── jubilacion.html
    ├── fire.html
    ├── patrimonio.html
    ├── dividendos.html
    ├── aportes-mensuales.html
    ├── objetivo-financiero.html
    ├── crecimiento-historico.html
    ├── retiro-seguro.html
    ├── valor-futuro.html
    └── valor-presente.html
```

Nada de lo que ya tenías —la home, el blog, las calculadoras originales de la página principal— ha sido modificado.

## Cómo subirlo

1. Sube `calculadoras.css` y `calculadoras.js` a la **raíz** del repositorio (junto a `style.css`, `script.js`, `blog.css`, `blog.js`).
2. Crea una carpeta `calculadoras` en la raíz (igual que hiciste con `blog/`) y sube ahí los 13 archivos `.html` de la carpeta `calculadoras/` de esta entrega.
3. `index-actualizado.html` reemplaza a tu `index.html` actual — esta vez añade, además del enlace al Blog que ya tenías, un nuevo enlace **"Calculadoras+"** en el menú y en el pie de página que lleva a la nueva sección. Si prefieres no reemplazar tu `index.html` todavía, las calculadoras funcionan igualmente por su cuenta en `calculadoras/index.html`.

## Qué incluye cada calculadora

Las 12 calculadoras nuevas, todas con gráfico interactivo en Chart.js:

1. **Interés compuesto avanzada** — con aportes crecientes anuales e inflación opcional.
2. **Inflación** — cuánto pierde tu dinero de poder adquisitivo con el tiempo.
3. **Jubilación** — cuánto necesitas ahorrar para un capital objetivo de jubilación.
4. **FIRE** — cuándo podrías alcanzar la independencia financiera según tu tasa de ahorro.
5. **Patrimonio neto** — seguimiento de activos menos pasivos a lo largo del tiempo.
6. **Dividendos** — proyección de ingresos pasivos por dividendos reinvertidos.
7. **Aportes mensuales** — cuánto necesitas aportar cada mes para un objetivo y plazo dados.
8. **Objetivo financiero** — variante enfocada en metas concretas con distintas tasas de rendimiento.
9. **Crecimiento histórico** — simulación de cómo habría crecido una inversión con distintos rendimientos anuales medios.
10. **Retiro seguro** — estimación de cuánto se puede retirar anualmente sin agotar el capital (tasa de retiro segura).
11. **Valor futuro** — cuánto valdrá hoy un capital dentro de X años a una tasa dada.
12. **Valor presente** — cuánto necesitas hoy para alcanzar una cantidad futura concreta.

Todas comparten el mismo diseño y modo claro/oscuro del resto del sitio, están enlazadas entre sí desde la portada `calculadoras/index.html`, y llevan el mismo aviso legal y de cookies que el resto de páginas.

## Qué sigue

Quedan pendientes del encargo original: el **comparador de ETFs**, el **simulador de portafolios**, el **glosario** de 300+ términos y el **curso gratuito** de 5 niveles. Dime por cuál seguimos.
