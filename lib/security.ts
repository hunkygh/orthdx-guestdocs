import {createHash,randomBytes} from 'crypto';
import {NextRequest} from 'next/server';import {db} from './db';
export const randomToken=()=>randomBytes(32).toString('base64url');
export const hashToken=(s:string)=>createHash('sha256').update(s).digest('hex');
export function presentedToken(req:NextRequest){return req.headers.get('x-document-token')||req.nextUrl.searchParams.get('token')||''}
export async function access(id:string,token:string){if(!token||!/^[-0-9a-f]{36}$/i.test(id))return null;const sql=db();const rows=await sql`SELECT d.id,d.title,d.content,d.version,g.role FROM documents d JOIN access_grants g ON g.document_id=d.id WHERE d.id=${id}::uuid AND g.token_hash=${hashToken(token)} AND g.revoked=false AND (g.expires_at IS NULL OR g.expires_at>now()) LIMIT 1`;if(!rows.length)return null;const {role,...document}=rows[0];return {document,level:role as 'owner'|'editor'|'suggest'|'comment'};}
export const canEdit=(s:string)=>s==='owner'||s==='editor';
export const canSuggest=(s:string)=>canEdit(s)||s==='suggest';
