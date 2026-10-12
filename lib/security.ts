import {createHash,randomBytes,timingSafeEqual} from 'crypto';
import {NextRequest} from 'next/server';
import {db} from './db';
export const randomToken=()=>randomBytes(32).toString('base64url');
export const hashToken=(s:string)=>createHash('sha256').update(s).digest('hex');
export function equalSecret(a:string|undefined,b:string|undefined){if(!a||!b)return false;const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&timingSafeEqual(x,y)}
export function presentedToken(req:NextRequest){return req.headers.get('x-document-token')||req.nextUrl.searchParams.get('token')||''}
export async function access(id:string,token:string){if(!token)return null;const {data:document}=await db().from('documents').select('*').eq('id',id).maybeSingle();if(!document)return null;const {data:grant}=await db().from('access_grants').select('*').eq('document_id',id).eq('token_hash',hashToken(token)).eq('revoked',false).maybeSingle();if(!grant||(grant.expires_at&&new Date(grant.expires_at)<new Date()))return null;return {document,grant,level:grant.role as 'owner'|'editor'|'suggest'|'comment'}}
export const canEdit=(s:string)=>s==='owner'||s==='editor';
export const canSuggest=(s:string)=>canEdit(s)||s==='suggest';