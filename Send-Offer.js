import { getStore } from '@netlify/blobs';
import webpush from 'web-push';

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }
  try {
    const { title, body } = await req.json();
    const VAPID_PUBLIC = process.env.VAPID_PUBLIC_KEY;
    const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY;
    if (!VAPID_PUBLIC || !VAPID_PRIVATE) {
      return new Response(JSON.stringify({ error: 'Faltan VAPID keys en Netlify' }), { status: 500 });
    }
    webpush.setVapidDetails('mailto:hola@laherradura.com', VAPID_PUBLIC, VAPID_PRIVATE);
    const store = getStore('la-herradura-subs');
    const { blobs } = await store.list();
    let sent = 0;
    for (const b of blobs) {
      try {
        const sub = await store.get(b.key, { type: 'json' });
        await webpush.sendNotification(sub, JSON.stringify({ title, body }));
        sent++;
      } catch (e) {}
    }
    return new Response(JSON.stringify({ ok: true, sent }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
