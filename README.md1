# Academia de Inversión

Web educativa de finanzas personales. HTML5 + CSS3 + JavaScript (ES6+) puros y Chart.js para las calculadoras. Sin build, sin dependencias — se despliega tal cual.

## Estructura

```
├── index.html          # Página principal
├── privacy-policy.html # Política de privacidad y cookies (requerida por AdSense)
├── style.css
├── script.js
├── sitemap.xml
├── robots.txt
├── ads.txt              # Requerido por Google AdSense
└── README.md
```

---

## 1. Publicarla en internet (elige una)

**Netlify (la más simple)**
1. Ve a app.netlify.com/drop y arrastra la carpeta del proyecto. Ya está online.
2. Para editarla luego, mejor conecta un repositorio de GitHub (Netlify → "Add new site" → "Import from Git").

**GitHub Pages**
1. Crea un repositorio y sube estos archivos.
2. Settings → Pages → "Deploy from branch" → rama `main`, carpeta `/`.

**Vercel**
1. Importa el repositorio en vercel.com/new. Framework: "Other". Sin build command.

**Cloudflare Pages**
1. Conecta el repositorio en el dashboard de Cloudflare Pages. Build command vacío, output `/`.

Cualquiera de las cuatro te da una URL gratuita (`tusitio.netlify.app`, `usuario.github.io`, etc.). Para verse profesional en Google, lo ideal es comprar un dominio propio (ej. en Namecheap, Google Domains/Squarespace o Cloudflare Registrar) y conectarlo desde el panel de tu hosting — todas ellas tienen un apartado "Custom domain" muy guiado.

**Antes de publicar**, sustituye `https://www.academiadeinversion.com/` por tu dominio real en: `index.html` (canonical y Open Graph), `privacy-policy.html`, `sitemap.xml` y `robots.txt`.

---

## 2. Indexarla en Google

1. Crea una cuenta en **Google Search Console** (search.google.com/search-console).
2. Añade tu propiedad con la URL de tu sitio ya publicado.
3. Verifica la propiedad. La forma más simple: Google te da una etiqueta `<meta name="google-site-verification" ...>` — pégala en `index.html` donde ya dejé el comentario preparado, sustituyendo `<!-- ... -->` por la etiqueta real, sube el cambio y pulsa "Verificar".
4. Una vez verificado, ve a "Sitemaps" en el menú lateral y envía `sitemap.xml`.
5. Google no indexa al instante — normalmente tarda entre unos días y unas semanas. Puedes acelerar pidiendo la indexación manual de la URL principal desde la barra de inspección de Search Console.

No hace falta "subir" nada más a Google: una vez el sitio está online y el sitemap enviado, el rastreo es automático.

---

## 3. Monetizar con Google AdSense

### Requisitos antes de solicitarlo
- Sitio ya publicado con un dominio accesible (funciona con subdominios gratuitos, pero un dominio propio da mejor impresión y facilita la aprobación).
- Contenido original y suficiente (ya lo tienes).
- Política de privacidad visible — ya incluida en `privacy-policy.html` y enlazada en el footer.
- Ser mayor de edad y tener una cuenta de Google.
- Un poco de tráfico real ayuda, aunque no siempre es obligatorio; lo que más pesa es que el sitio esté completo y navegable.

### Pasos
1. Ve a **adsense.google.com** y date de alta con tu cuenta de Google.
2. Añade tu sitio con la URL exacta.
3. AdSense te dará un fragmento de código para verificar el sitio — es el mismo `<script ... adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX>` que ya dejé en el `<head>` de `index.html`. Sustituye **todas** las apariciones de `ca-pub-XXXXXXXXXXXXXXXX` (hay una en `index.html` y una en cada bloque de anuncio) por tu ID real de editor.
4. En el panel de AdSense, sección "Sitios", copia la línea de `ads.txt` que te proporcionan y sustituye la que dejé de ejemplo en el archivo `ads.txt` (el `pub-XXXXXXXXXXXXXXXX` debe coincidir con tu ID).
5. Google revisa el sitio (puede tardar de un día a varias semanas). Revisa el correo asociado a tu cuenta.
6. Tras la aprobación, ve a "Anuncios" → "Por bloques de anuncios", crea un bloque para cada uno de los 3 huecos que dejé preparados en `index.html` (marcados como `<!-- AD SLOT -->`, después del hero, tras la tabla de ETFs, y antes del pie de página) y sustituye cada `data-ad-slot="1111111111"` (y los otros dos números de ejemplo) por el ID real de cada bloque.
7. Los anuncios empiezan a mostrarse solo cuando: la cuenta está aprobada, el ID de editor es real, y (según configuré) el visitante ha aceptado el aviso de cookies.

### Notas importantes
- Nunca hagas clic en tus propios anuncios ni pidas a otros que lo hagan: es la causa más común de suspensión de cuenta.
- Al ser una web de contenido financiero, Google la clasifica como YMYL ("tu dinero o tu vida") y revisa con más cuidado la calidad y los avisos legales — por eso ya incluí el descargo de responsabilidad en el footer y en la política de privacidad.
- Si en algún momento cambias de opinión sobre las cookies, el propio aviso del sitio permite "Rechazar", y en ese caso los tres bloques de anuncios se retiran de la página para esa visita.

---

## Aviso

Todo el contenido de la web es educativo y general, no constituye asesoramiento financiero personalizado. Ver el aviso legal completo en el pie de página del sitio.
