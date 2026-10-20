import {NextRequest} from 'next/server';
import {db} from '@/lib/db';
import {randomToken,hashToken} from '@/lib/security';
import {response,error} from '@/lib/http';
export async function POST(req:NextRequest){
 if(!process.env.NEXT_PUBLIC_SUPABASE_URL||!process.env.SUPABASE_SERVICE_ROLE_KEY)return error('Database not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel, then redeploy.',503);
 try{
 const body=await req.json().catch(()=>({}));
 const title=String(body.title||'Untitled').slice(0,160);
 const token=randomToken();
 const client=db();
 const {data:doc,error:e}=await client.from('documents').insert({title,content:{type:'doc',content:[{type:'paragraph'}]}}).select('id').single();
 if(e||!doc)return error(e?.message||'Could not create document',500);
 const {error:g}=await client.from('access_grants').insert({document_id:doc.id,token_hash:hashToken(token),role:'owner'});
 if(g){await client.from('documents').delete().eq('id',doc.id);return error(g.message,500)}
 return response({id:doc.id,token,ownerUrl:`/d/${doc.id}?token=${token}`},201);
 }catch(e){console.error('Document creation failed',e);return error('Unable to connect to document database. Check Vercel logs and Supabase configuration.',503)}
}
