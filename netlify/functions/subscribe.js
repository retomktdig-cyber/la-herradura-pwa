
import { getStore } from '@netlify/blobs';
export default async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', {status:405});
  try{
    const sub = await req.json();
    if(!sub || !sub.endpoint) return new Response('Bad sub', {status:400});
    const store = getStore('la-herradura-subs');
    const key = Buffer.from(sub.endpoint).toString('base64').slice(0,80);
    await store.setJSON(key, sub);
    return new Response(JSON.stringify({ok:true}), {headers:{'Content-Type':'application/json'}});
  }catch(e){
    console.error('SUBSCRIBE ERROR', e);
    return new Response(JSON.stringify({error:e.message}), {status:500, headers:{'Content-Type':'application/json'}});
  }
};
export const config = { path: "/.netlify/functions/subscribe" };
