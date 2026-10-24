import { getStore } from "@netlify/blobs";
import webPush from "web-push";

export default async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  try {
    const { title, body, url } = await req.json();
    if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
      return new Response(JSON.stringify({ error: 'Faltan VAPID keys en env vars', demo: true, sent: 0 }), { status: 200, headers: {'Content-Type':'application/json'} });
    }
    webPush.setVapidDetails('mailto:hola@laherraduracarnes.com', process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);
    const store = getStore("la-herradura-subs");
    const { blobs } = await store.list();
    let sent = 0;
    const payload = JSON.stringify({ title: title || 'La Herradura', body: body || 'Nueva oferta!', url: url || '/' });
    for (const key of blobs.map(b=>b.key)) {
      try {
        const sub = await store.get(key, { type: 'json' });
        if (!sub) continue;
        await webPush.sendNotification(sub, payload);
        sent++;
      } catch (err) {
        // Si 410 Gone, borrar
        if (err.statusCode === 410) await store.delete(key);
      }
    }
    return new Response(JSON.stringify({ ok: true, sent }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
