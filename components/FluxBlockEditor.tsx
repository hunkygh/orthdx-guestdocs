'use client';
import {useEffect,useRef} from 'react';
import {useCreateBlockNote} from '@blocknote/react';
import {BlockNoteView} from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import '@blocknote/core/fonts/inter.css';
import type {PartialBlock} from '@blocknote/core';
function legacyBlocks(raw:any):PartialBlock[]{
 if(Array.isArray(raw?.blocks))return raw.blocks;
 const nodes=Array.isArray(raw?.content)?raw.content:[];
 return nodes.map((node:any)=>({
  type:node.type==='heading'?'heading':node.type==='bulletList'?'bulletListItem':node.type==='orderedList'?'numberedListItem':'paragraph',
  props:node.type==='heading'?{level:node.attrs?.level||2}:undefined,
  content:node.text?String(node.text):(node.content||[]).map((n:any)=>n.text||'').join('')
 })) as PartialBlock[];
}
export default function FluxBlockEditor({initial,onContentChange,editable=true}:{initial:any;onContentChange:(data:any)=>void;editable?:boolean}){
 const editor=useCreateBlockNote({initialContent:legacyBlocks(initial).length?legacyBlocks(initial):undefined});
 const ready=useRef(false);
 useEffect(()=>{ready.current=true},[]);
 return <BlockNoteView editor={editor} editable={editable} theme="light" onChange={()=>{if(ready.current)onContentChange({type:'blocknote',blocks:editor.document})}} />;
}
