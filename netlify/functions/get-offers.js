
import { getStore } from '@netlify/blobs';
export default async () => {
  try{
    const store = getStore('la-herradura-offers');
    const { blobs } = await store.list();
    const offers = [];
    for(const b of blobs.slice(-20).reverse()){
      try{ const o = await store.get(b.key, {type:'json'}); if(o) offers.push(o); }catch{}
    }
    return new Response(JSON.stringify({offers}), {headers:{'Content-Type':'application/json'}});
  }catch(e){
    return new Response(JSON.stringify({offers:[]}), {headers:{'Content-Type':'application/json'}});
  }
};
export const config = { path: "/.netlify/functions/get-offers" };
