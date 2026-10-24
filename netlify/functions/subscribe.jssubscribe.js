import { getStore } from "@netlify/blobs";
import webPush from "web-push";

export default async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  try {
    const sub = await req.json();
    if (!sub?.endpoint) return new Response('Bad sub', { status: 400 });
    // Configura VAPID una vez en Netlify env vars
    if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
      webPush.setVapidDetails('mailto:hola@laherraduracarnes.com', process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);
    }
    const store = getStore("la-herradura-subs");
    await store.setJSON(sub.endpoint.replace(/[^a-zA-Z0-9]/g, '_').slice(-100), sub);
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
