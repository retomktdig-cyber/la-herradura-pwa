# La Herradura Carnes - PWA Ofertas (Netlify)

PWA escaneable que no necesita descargarse. Cliente escanea QR en Laprida 532 -> activa notificaciones -> recibe ofertas push.

## Estructura que subís a GitHub
/
├── index.html -> LO QUE VE EL CLIENTE (QR apunta acá)
├── admin/index.html -> PANEL PRIVADO tuyo
├── manifest.webmanifest
├── sw.js -> Service Worker push
├── icons/icon-192.png, icon-512.png -> tu logo rojo
├── netlify/functions/
│   ├── subscribe.js -> guarda suscripciones
│   └── send-offer.js -> envía ofertas
├── netlify.toml
└── package.json

## Pasos para dejarla activa

1. **Crear repo en GitHub**
   - Subí toda esta carpeta. No subas node_modules.

2. **Conectar a Netlify**
   - netlify.com > Add new site > Import from GitHub
   - Build command: dejar vacío (es estático)
   - Publish directory: .

3. **Generar VAPID keys (una sola vez)**
   En tu compu:
   ```
   npx web-push generate-vapid-keys
   ```
   Te da PUBLIC y PRIVATE.

4. **Cargar env vars en Netlify**
   Site settings > Environment variables:
   - VAPID_PUBLIC_KEY = la public que generaste
   - VAPID_PRIVATE_KEY = la private
   - VAPID_SUBJECT = mailto:hola@laherraduracarnes.com

   Luego en index.html reemplazá la const vapidPublic por tu PUBLIC real (línea ~70).

5. **Proteger /admin**
   Netlify > Site settings > Access control > Password protection > poné usuario/clave para /admin o todo el site admin.

6. **QR**
   Tu URL final será https://TU-SITIO.netlify.app
   Generá QR de esa URL y pegalo en mostrador. Ese link es solo cliente.

## Flujo cliente
Escanea -> index.html -> Activa ofertas -> queda suscripto en Blobs -> recibe push cuando vos mandás desde /admin

## WhatsApp
Ya está linkeado a https://wa.me/5493435055447

## iPhone
En iPhone solo funciona push si el cliente toca Compartir > Agregar a pantalla de inicio. En Android funciona directo.

Listo para producción.
