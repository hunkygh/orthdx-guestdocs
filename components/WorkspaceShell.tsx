'use client';
import Link from 'next/link';
import {useState,useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {AnimatePresence,motion} from 'motion/react';
import {getDocs,getProjects,putDoc,addProject,type WorkspaceDoc} from '@/lib/workspace';
const icon=(name:string)=>({home:'⌂',docs:'▤',plus:'+',project:'◇',collapse:'‹',expand:'›'}[name]||name);
export default function WorkspaceShell({children,activeId}:{children:React.ReactNode;activeId?:string}){
 const router=useRouter();
 const [docs,D]=useState<WorkspaceDoc[]>([]),[projects,P]=useState<string[]>([]),[expanded,E]=useState(true),[activeProject,AP]=useState(''),[busy,B]=useState(false),[error,ERR]=useState('');
 useEffect(()=>{D(getDocs());P(getProjects())},[]);
 async function create(){
  B(true);ERR('');
  try{
   const r=await fetch('/api/docs',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title:'Untitled',project:activeProject})});
   const raw=await r.text();let x:{id?:string;token?:string;ownerUrl?:string;error?:string}={};
   try{x=JSON.parse(raw)}catch{throw Error('Unable to create document. Check server logs and Supabase configuration.')}
   if(!r.ok)throw Error(x.error||'Unable to create document');
   if(!x.id||!x.token||!x.ownerUrl)throw Error('Document response incomplete');
   putDoc({id:x.id,title:'Untitled',token:x.token,project:activeProject,createdAt:new Date().toISOString()});
   D(getDocs());router.push(x.ownerUrl);
  }catch(e){ERR((e as Error).message)}finally{B(false)}
 }
 function newProject(){const name=prompt('New project name')?.trim();if(!name)return;addProject(name);P(getProjects());AP(name)}
 const groups=[...new Set([...projects,...docs.map(d=>d.project).filter(Boolean)])];
 const visible=docs.filter(d=>!activeProject||d.project===activeProject);
 return <div className="workspace">
  <aside className="rail" aria-label="Main navigation">
   <Link href="/dashboard" className="rail-logo" aria-label="Flux home">f<span>.</span></Link>
   <button className="rail-icon" title="Toggle documents" aria-label="Toggle documents" onClick={()=>E(v=>!v)}>{icon('docs')}</button>
   <button className="rail-icon" title="New document" aria-label="New document" onClick={create} disabled={busy}>{icon('plus')}</button>
   <button className="rail-icon" title="New project" aria-label="New project" onClick={newProject}>{icon('project')}</button>
  </aside>
  <AnimatePresence initial={false}>
   {expanded&&<motion.aside key="library" className="library" initial={{width:0,opacity:0}} animate={{width:238,opacity:1}} exit={{width:0,opacity:0}} transition={{duration:.28,ease:[.22,1,.36,1]}} style={{overflow:'hidden'}} aria-label="Documents and projects">
    <div className="library-inner">
     <div className="library-head"><Link href="/dashboard" className="flux-wordmark">flux<span>.</span></Link><button className="plain-btn" onClick={()=>E(false)} aria-label="Collapse sidebar">‹</button></div>
     <motion.button whileTap={{scale:.98}} className="library-new" disabled={busy} onClick={create}>＋ <span>{busy?'Creating…':'New doc'}</span></motion.button>
     <div className="library-section">
      <button className={'project-item '+(!activeProject?'selected':'')} onClick={()=>AP('')}><span className="nav-symbol">▤</span> All docs</button>
      {groups.map(project=><button key={project} className={'project-item '+(activeProject===project?'selected':'')} onClick={()=>AP(project)}><span className="nav-symbol">◇</span><span className="project-name">{project}</span></button>)}
      <button className="project-add" onClick={newProject}>＋ <span>New project</span></button>
     </div>
     <div className="doc-items">{visible.map(d=><Link key={d.id} className={'doc-item '+(d.id===activeId?'active':'')} href={`/d/${d.id}?token=${d.token}`}><span className="nav-symbol">≡</span>{d.title}</Link>)}</div>
     <AnimatePresence>{error&&<motion.p className="error" role="alert" initial={{opacity:0,y:-5}} animate={{opacity:1,y:0}} exit={{opacity:0}}>{error}</motion.p>}</AnimatePresence>
    </div>
   </motion.aside>}
  </AnimatePresence>
  <main className="workspace-main">
   <div className="workspace-top"><span>{activeId?'Document':'Home'}</span><span className="workspace-trail">Flux</span></div>
   {children}
  </main>
 </div>
}