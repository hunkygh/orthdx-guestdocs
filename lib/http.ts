import {NextResponse} from 'next/server';
export const response=(data:unknown,status=200)=>NextResponse.json(data,{status,headers:{'Cache-Control':'no-store'}});
export const error=(message:string,status=400)=>response({error:message},status);