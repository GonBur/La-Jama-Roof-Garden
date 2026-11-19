/* =========================================================================
   LA JAMA ROOF GARDEN — DATOS CENTRALIZADOS
   Edita SOLO este archivo para cambiar carta, precios, fotos, promociones
   y datos de contacto. No hace falta tocar HTML ni CSS.
   - price: número en soles (ej. 18.5) o null  -> se muestra "Consultar"
   - img: nombre del archivo dentro de assets/img/ (formato .webp)
   ========================================================================= */
(function () {
  'use strict';

  window.LAJAMA = {
    business: {
      name: 'La Jama Roof Garden',
      phoneDisplay: '949 491 220',
      phone: '+51949491220',            // Fuente: publicación oficial (flyer Mollejitas)
      whatsapp: '51949491220',          // PENDIENTE: confirmar que este número usa WhatsApp
      address: 'Urb. López Albújar Mz. P Lt. 9, Sullana 20101, Piura',
      mapsUrl: 'https://maps.app.goo.gl/AgQ7qGXfB7yWRm5M8',
      mapsEmbedQuery: 'La Jama Roof Garden, Urb. López Albújar, Sullana, Piura',
      // Horario: 0=domingo ... 6=sábado. null = cerrado.
      hours: {
        0: ['18:30', '23:30'],
        1: ['18:30', '23:30'],
        2: null,                         // Martes: descanso
        3: ['18:30', '23:30'],
        4: ['18:30', '23:30'],
        5: ['18:30', '23:30'],
        6: ['18:30', '23:30']
      },
      timezoneOffset: -5                 // Hora de Perú (UTC-5)
    },

    social: [
      { id: 'facebook',  label: 'Facebook',  url: 'https://www.facebook.com/profile.php?id=100067737560654' },
      { id: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/lajamaroofgarden/' }, // usuario visto en fotos oficiales
      { id: 'tiktok',    label: 'TikTok',    url: 'https://www.tiktok.com/@lajamaroofgarden' }
    ],

    categories: [
      { id: 'todo',     label: 'Todo' },
      { id: 'alitas',   label: 'Alitas' },
      { id: 'compartir', label: 'Para compartir' },
      { id: 'casa',     label: 'De la casa' },
      { id: 'bebidas',  label: 'Bebidas & frozen' }
    ],

    /* Carta. Los platos provienen de fotos y publicaciones oficiales.
       Precios: solo se muestran los publicados por el restaurante. */
    menu: [
      { id: 'alitas-acevichadas', cat: 'alitas', name: 'Alitas acevichadas', desc: 'Alitas crocantes bañadas en crema acevichada con cebolla fresca.', img: 'flyer-dijiste-alitas.webp', price: null, featured: true },
      { id: 'alitas-glaseadas', cat: 'alitas', name: 'Alitas glaseadas', desc: 'Alitas en salsa glaseada con ajonjolí tostado.', img: 'bandeja-alitas-tres-sabores.webp', price: null },
      { id: 'mollejitas', cat: 'compartir', name: 'Mollejitas', desc: 'Mollejitas doradas acompañadas de papas fritas.', img: 'flyer-mollejitas.webp', price: 10, priceNote: 'Precio publicado en promoción', featured: true },
      { id: 'piqueo-terraza', cat: 'compartir', name: 'Piqueo de la terraza', desc: 'Tequeños, guacamole, papas fritas y bocaditos para la mesa.', img: 'terraza-piqueo.webp', price: null, featured: true },
      { id: 'parrilla', cat: 'compartir', name: 'Parrilla para compartir', desc: 'Pollo y chorizo a la parrilla con ensalada y papas.', img: 'mesa-parrilla.webp', price: null, featured: true },
      { id: 'salchipapas', cat: 'compartir', name: 'Salchipapas de la casa', desc: 'Nuestra salchipapa con cremas de la casa.', img: 'flyer-salchipapas.webp', price: null },
      { id: 'pancita', cat: 'casa', name: 'Pancita de la casa', desc: 'Pancita a la parrilla servida con sus guarniciones.', img: 'flyer-pancita.webp', price: null },
      { id: 'hamburguesa', cat: 'casa', name: 'Hamburguesa Food Truck', desc: 'Pan brioche, carne, queso fundido, tomate, lechuga y cebolla.', img: 'flyer-hamburguesa.webp', price: null, featured: true },
      { id: 'carne-glaseada', cat: 'casa', name: 'Carne glaseada con choclo', desc: 'Carne en salsa glaseada con cebollita china, choclo y papas.', img: 'carne-glaseada-choclo.webp', price: null, pendingName: true },
      { id: 'sandia', cat: 'bebidas', name: 'Refresco de sandía', desc: 'Bebida helada de sandía con limón.', img: 'bebida-sandia.webp', price: null, featured: true, pendingName: true },
      { id: 'coronarita', cat: 'bebidas', name: 'Coronarita', desc: 'Cóctel cítrico coronado con una Corona y rodaja de naranja.', img: 'coronarita.webp', price: null, pendingName: true },
      { id: 'frappe-oreo', cat: 'bebidas', name: 'Frappé de Oreo', desc: 'Frappé cremoso con galleta Oreo.', img: 'frappe-oreo.webp', price: null },
      { id: 'frappe-chocolate', cat: 'bebidas', name: 'Frappé de chocolate', desc: 'Frappé de chocolate con hilos de cacao y Oreo.', img: 'frappe-chocolate.webp', price: null },
      { id: 'frappe-frutos-rojos', cat: 'bebidas', name: 'Frappé de frutos rojos', desc: 'Frappé cremoso con salsa de frutos rojos.', img: 'frappe-frutos-rojos.webp', price: null }
    ],

    /* Promociones VIGENTES confirmadas por el restaurante.
       Déjalo vacío si no hay ninguna confirmada. Ejemplo:
       { title: 'Mollejitas', text: 'A solo S/10', img: 'flyer-mollejitas.webp', until: '2026-12-31' } */
    promos: [],

    /* Publicaciones oficiales (flyers) — se muestran como archivo de redes,
       no como promociones vigentes. */
    posts: [
      { img: 'flyer-mollejitas.webp', alt: 'Publicación oficial: Mollejitas a S/10' },
      { img: 'flyer-dijiste-alitas.webp', alt: 'Publicación oficial: ¿Dijiste alitas?' },
      { img: 'flyer-alitas-acevichadas.webp', alt: 'Publicación oficial: Alitas acevichadas' },
      { img: 'flyer-hamburguesa.webp', alt: 'Publicación oficial: Hamburguesa Food Truck' },
      { img: 'flyer-salchipapas.webp', alt: 'Publicación oficial: Salchipapas de la casa' },
      { img: 'flyer-pancita.webp', alt: 'Publicación oficial: Pancita de la casa' }
    ],

    gallery: [
      { img: 'terraza-mesa-sillas.webp', alt: 'Terraza con sillas de mimbre y plantas', tag: 'Terraza' },
      { img: 'bebida-sandia.webp', alt: 'Bebida de sandía frente al letrero de La Jama Roof Garden', tag: 'Bebidas' },
      { img: 'bandeja-alitas-tres-sabores.webp', alt: 'Bandeja de alitas en tres preparaciones', tag: 'Alitas' },
      { img: 'mesa-parrilla.webp', alt: 'Parrilla para compartir en la terraza', tag: 'Parrilla' },
      { img: 'frappe-oreo.webp', alt: 'Frappé de Oreo frente al muro de carrizo', tag: 'Frozen' },
      { img: 'terraza-piqueo.webp', alt: 'Piqueo servido en mesa de madera de la terraza', tag: 'Terraza' },
      { img: 'coronarita.webp', alt: 'Cóctel con Corona y naranja', tag: 'Bebidas' },
      { img: 'carne-glaseada-choclo.webp', alt: 'Carne glaseada con choclo y papas', tag: 'De la casa' },
      { img: 'frappe-frutos-rojos.webp', alt: 'Frappé de frutos rojos', tag: 'Frozen' },
      { img: 'plato-de-la-casa.webp', alt: 'Plato servido frente al letrero de La Jama', tag: 'De la casa' },
      { img: 'frappe-chocolate.webp', alt: 'Frappé de chocolate con Oreo', tag: 'Frozen' },
      { img: 'collage-mejor-point.webp', alt: 'Historia oficial: El mejor point de Sullana', tag: 'Ambiente' }
    ]
  };
})();
