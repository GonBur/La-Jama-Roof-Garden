# La Jama Roof Garden — Sitio web

Sitio estático (HTML + CSS + JavaScript, sin compilación ni Node.js). Listo para `public_html` de Hostinger.

## Publicar en Hostinger
1. hPanel → **Archivos → Administrador de archivos** → abre `public_html`.
2. Sube el ZIP `la-jama-web.zip` y usa **Extraer** (o sube el contenido de la carpeta).
3. Verifica que `index.html` y `.htaccess` queden directamente dentro de `public_html`.
4. Si tu dominio tiene SSL, descomenta el bloque "HTTPS redirect" en `.htaccess`.
5. Tras cada cambio, sube la fecha de `?v=20261119` en `index.html` (evita caché antigua).

## Actualizar contenido (solo `assets/js/data.js`)
- **Carta y precios:** lista `menu`. `price: 25` muestra "S/ 25"; `price: null` muestra "Consultar". `featured: true` lo lleva a *Especialidades*.
- **Fotos:** guarda la foto en `assets/img/` (ideal .webp, mín. 800×800 px) y cambia `img`.
- **Promociones vigentes:** lista `promos` (con `until: 'AAAA-MM-DD'` se ocultan solas al vencer).
- **Horario, teléfono, WhatsApp, redes:** bloques `business` y `social`.
- **Galería y publicaciones:** listas `gallery` y `posts`.

## Fuentes de las fotografías
Las 18 fotos y el logo provienen exclusivamente de los archivos del proyecto entregados por el cliente (publicaciones oficiales de La Jama en Facebook/Instagram). No se usaron bancos de imágenes ni IA. Tratamiento: reescalado 2× Lanczos, nitidez ligera, contraste +4 %, WebP; `bg-terraza` y `bg-letrero` son versiones desenfocadas usadas como fondo. Detalle por archivo: `FOTOS-FUENTES.json`.

## Pendiente de confirmar con el cliente
1. **Fotos en alta resolución** (las recibidas son de 206×206 px). Es la mejora visual más importante.
2. Que el **949 491 220** tenga WhatsApp (tomado del flyer oficial de Mollejitas).
3. Horario: se interpretó **6:30 – 11:30 p. m.**
4. **Precios** de la carta (solo se conoce Mollejitas S/ 10, de un flyer sin fecha).
5. Nombres exactos de: *Carne glaseada con choclo*, *Refresco de sandía*, *Coronarita*.
6. Usuario de Instagram (`@lajamaroofgarden`, visto en marca de agua de una foto).
7. Si ofrecen **delivery** o recojo (hoy el sitio solo ofrece "Consultar pedido").
8. Historia del local (año de apertura, fundadores) para ampliar *Nosotros*.
9. Dominio definitivo: activar `<link rel="canonical">` y crear `sitemap.xml`.

## Técnico
- GSAP 3.12.5 + ScrollTrigger desde jsDelivr. Si no cargan, el sitio funciona igual con IntersectionObserver + CSS.
- Respeta `prefers-reduced-motion` (apaga parallax, fijado horizontal, marquesina y revelados grandes).
- Reservas: el formulario arma el mensaje y abre WhatsApp; no confirma reservas automáticamente.
