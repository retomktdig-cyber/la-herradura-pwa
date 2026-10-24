
import { getStore } from '@netlify/blobs';
import webpush from 'web-push';
export default async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', {status:405});
  try{
    const { title, message } = await req.json();
    if(!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY){
      return new Response(JSON.stringify({error:'Faltan VAPID keys en env vars'}), {status:500, headers:{'Content-Type':'application/json'}});
    }
    webpush.setVapidDetails('mailto:herradura@laprida532.com', process.env.VAPID_PUBLIC_KEY, process.env.VAPID_PRIVATE_KEY);
    const store = getStore('la-herradura-subs');
    const { blobs } = await store.list();
    let sent = 0; let failed = 0;
    const payload = JSON.stringify({ title: title || 'Oferta La Herradura', body: message || '', url: '/' });
    for(const b of blobs){
      try{
        const sub = await store.get(b.key, {type:'json'});
        if(!sub) continue;
        await webpush.sendNotification(sub, payload);
        sent++;
      }catch(err){
        if(err.statusCode === 410 || err.statusCode === 404){ await store.delete(b.key); }
        failed++;
      }
    }
    try{
      const histStore = getStore('la-herradura-offers');
      await histStore.setJSON(Date.now().toString(), { title, message, date: new Date().toISOString(), sent });
    }catch{}
    return new Response(JSON.stringify({ok:true, sent, failed, total: blobs.length}), {headers:{'Content-Type':'application/json'}});
  }catch(e){
    console.error('SEND ERROR', e);
    return new Response(JSON.stringify({error:e.message}), {status:500, headers:{'Content-Type':'application/json'}});
  }
};
export const config = { path: "/.netlify/functions/send-offer" };
