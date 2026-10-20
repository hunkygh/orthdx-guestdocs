'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {useRouter} from 'next/navigation';
import {AnimatePresence,motion} from 'motion/react';
import {Home,FolderKanban,FileText,Plug,Users,Plus,ChevronDown,ChevronRight,ChevronsLeft,ChevronsRight,MoreHorizontal,FolderPlus,ArrowLeft,PanelLeft,Search} from 'lucide-react';
import {getDocs,getProjects,putDoc,addProject,moveDoc,renameProject,removeProject,type WorkspaceDoc} from '@/lib/workspace';
type Area='home'|'projects'|'docs'|'connections'|'people';
export default function WorkspaceShell({children,activeId}:{children:React.ReactNode;activeId?:string}){
 const router=useRouter();
 const [docs,setDocs]=useState<WorkspaceDoc[]>([]),[projects,setProjects]=useState<string[]>([]),[openProjects,setOpenProjects]=useState<string[]>([]);
 const [projectDialog,SD]=useState<null|'create'|'rename'|'remove'>(null),[projectValue,SV]=useState(''),[targetProject,ST]=useState('');
 const [area,setArea]=useState<Area>('home'),[expanded,setExpanded]=useState(true),[menu,setMenu]=useState(false),[projectMenu,setProjectMenu]=useState<string|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState('');
 useEffect(()=>{setDocs(getDocs());setProjects(getProjects())},[]);
 function refresh(){setDocs(getDocs());setProjects(getProjects())}
 async function create(project=''){
  setMenu(false);setBusy(true);setError('');
  try{
   const r=await fetch('/api/docs',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({title:'Untitled',project})});
   const raw=await r.text();let x:{id?:string;token?:string;ownerUrl?:string;error?:string}={};
   try{x=JSON.parse(raw)}catch{throw Error('Document service unavailable. Check Neon and deployment logs.')}
   if(!r.ok)throw Error(x.error||'Unable to create document');
   if(!x.id||!x.token||!x.ownerUrl)throw Error('Incomplete document response');
   putDoc({id:x.id,title:'Untitled',token:x.token,project,createdAt:new Date().toISOString()});
   refresh();router.push(x.ownerUrl);
  }catch(e){setError((e as Error).message)}finally{setBusy(false)}
 }
 function createProject(){setMenu(false);setProjectMenu(null);SV('');SD('create')}
 function submitProject(){const name=projectValue.trim();if(!name)return;if(projectDialog==='create'){addProject(name);setOpenProjects(prev=>[...new Set([...prev,name])]);setArea('projects')}if(projectDialog==='rename'){renameProject(targetProject,name);setOpenProjects(prev=>prev.map(x=>x===targetProject?name:x))}if(projectDialog==='remove')removeProject(targetProject);refresh();SD(null)}
 function toggleProject(name:string){setOpenProjects(prev=>prev.includes(name)?prev.filter(x=>x!==name):[...prev,name])}
 function move(id:string,project:string){moveDoc(id,project);refresh();setOpenProjects(prev=>[...new Set([...prev,project])])}
 function changeName(name:string){ST(name);SV(name);SD('rename')}
 function deleteProject(name:string){ST(name);SV(name);SD('remove')}
 const items:[Area,React.ReactNode,string][]=[['home',<Home size={20}/>, 'Home'],['projects',<FolderKanban size={20}/>, 'Projects'],['docs',<FileText size={20}/>, 'Docs'],['connections',<Plug size={20}/>, 'Connections'],['people',<Users size={20}/>, 'People']];
 const groups=[...new Set([...projects,...docs.map(d=>d.project).filter(Boolean)])];
 const ungrouped=docs.filter(d=>!d.project);
 const row=(d:WorkspaceDoc)=><Link draggable onDragStart={e=>{e.dataTransfer.setData('text/flux-document-id',d.id);e.dataTransfer.effectAllowed='move'}} key={d.id} href={`/d/${d.id}?token=${d.token}`} className={'flux-doc-row '+(activeId===d.id?'active':'')} title={d.title}><FileText size={15}/><span>{d.title}</span></Link>;
 return <div className="workspace flux-layout">
  <aside className="flux-rail" aria-label="Primary navigation">
   <Link href="/dashboard" className="flux-rail-brand" aria-label="Flux">f<span>.</span></Link>
   {items.map(([key,ic,label])=><button key={key} title={label} aria-label={label} aria-pressed={area===key} className={'flux-rail-item '+(area===key?'is-active':'')} onClick={()=>{setArea(key);setExpanded(true);setMenu(false)}}>{ic}<span>{label}</span></button>)}
  </aside>
  <AnimatePresence initial={false}>
   {expanded&&<motion.aside className="flux-secondary" key="secondary" initial={{width:0,opacity:0}} animate={{width:286,opacity:1}} exit={{width:0,opacity:0}} transition={{duration:.26,ease:[.22,1,.36,1]}} aria-label="Context navigation">
    <div className="flux-secondary-inner">
     <div className="flux-panel-header"><strong>{({home:'Home',projects:'Projects',docs:'Docs',connections:'Connections',people:'People'} as Record<Area,string>)[area]}</strong><div className="flux-header-actions"><button className="flux-collapse" title="Collapse navigation" onClick={()=>setExpanded(false)}><ChevronsLeft size={17}/></button><button className="flux-add" onClick={()=>setMenu(v=>!v)} aria-label="Create" aria-expanded={menu}><Plus size={19}/><ChevronDown size={13}/></button></div></div>
     <AnimatePresence>{menu&&<motion.div className="flux-create-menu" initial={{opacity:0,y:-7,scale:.98}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-6,scale:.98}} transition={{duration:.16}}><button disabled={busy} onClick={()=>create()}><FileText size={18}/> <span>Document</span></button><button onClick={createProject}><FolderPlus size={18}/><span>Project</span></button></motion.div>}</AnimatePresence>
     <div className="flux-panel-content">
      {(area==='home'||area==='projects')&&<section className="flux-nav-section"><div className="flux-section-heading"><span>Projects</span></div>
       {groups.map(name=><div key={name} className="flux-project-block">
        <div className="flux-project-row" onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();const id=e.dataTransfer.getData('text/flux-document-id');if(id)move(id,name)}}>
         <button className="flux-tree-toggle" aria-label={'Toggle '+name} onClick={()=>toggleProject(name)}>{openProjects.includes(name)?<ChevronDown size={15}/>:<ChevronRight size={15}/>}</button>
         <button className="flux-project-name" onClick={()=>toggleProject(name)}><FolderKanban size={16}/><span>{name}</span></button>
         <button className="flux-inline-action" title={'Add document to '+name} onClick={()=>create(name)}><Plus size={15}/></button>
         <button className="flux-inline-action" title={'More options for '+name} onClick={()=>setProjectMenu(v=>v===name?null:name)}><MoreHorizontal size={17}/></button>
        </div>
        <AnimatePresence>{projectMenu===name&&<motion.div className="flux-project-actions" initial={{opacity:0,height:0}} animate={{opacity:1,height:'auto'}} exit={{opacity:0,height:0}}><button onClick={()=>create(name)}>New doc</button><button onClick={()=>changeName(name)}>Rename</button><button onClick={()=>deleteProject(name)}>Remove project</button></motion.div>}</AnimatePresence>
        <AnimatePresence initial={false}>{openProjects.includes(name)&&<motion.div className="flux-project-children" initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} transition={{duration:.23}}>{docs.filter(d=>d.project===name).map(row)}</motion.div>}</AnimatePresence>
       </div>)}
       <button className="flux-new-project" onClick={createProject}><Plus size={16}/> New project</button>
      </section>}
      {(area==='home'||area==='docs')&&<section className="flux-nav-section"><div className="flux-section-heading"><span>Docs</span></div>
       {ungrouped.map(d=><div key={d.id} className="flux-ungrouped" draggable onDragStart={e=>{e.dataTransfer.setData('text/flux-document-id',d.id);e.dataTransfer.effectAllowed='move'}}>{row(d)}</div>)}
       {area==='docs'&&groups.map(name=><div key={name} className="flux-docs-group"><span>{name}</span>{docs.filter(d=>d.project===name).map(row)}</div>)}
      </section>}
      {area==='connections'&&<p className="flux-panel-note">Connect document platforms here as integrations become available.</p>}
      {area==='people'&&<p className="flux-panel-note">Manage collaborators and invitations from your documents.</p>}
     </div>
     <AnimatePresence>{error&&<motion.p role="alert" className="error flux-error" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>{error}</motion.p>}</AnimatePresence>
    </div>
   </motion.aside>}
  </AnimatePresence>
  <AnimatePresence>{projectDialog&&<motion.div className="flux-dialog-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onMouseDown={()=>SD(null)}><motion.form className="flux-dialog" onMouseDown={e=>e.stopPropagation()} onSubmit={e=>{e.preventDefault();submitProject()}} initial={{y:12,scale:.97}} animate={{y:0,scale:1}} exit={{y:8,opacity:0}}><h3>{projectDialog==='create'?'New project':projectDialog==='rename'?'Rename project':'Remove project'}</h3>{projectDialog==='remove'?<p>Documents will be moved to All docs.</p>:<input autoFocus aria-label="Project name" placeholder="Project name" value={projectValue} onChange={e=>SV(e.target.value)}/>}<div className="flux-dialog-actions"><button type="button" onClick={()=>SD(null)}>Cancel</button><button type="submit" disabled={projectDialog!=='remove'&&!projectValue.trim()}>{projectDialog==='remove'?'Remove':projectDialog==='create'?'Create':'Save'}</button></div></motion.form></motion.div>}</AnimatePresence>
  <main className="workspace-main">
   <div className="workspace-top"><div className="flux-top-left">{!expanded&&<button className="flux-reopen" aria-label="Expand navigation" onClick={()=>setExpanded(true)}><PanelLeft size={17}/></button>}<span>{activeId?'Document':'Home'}</span></div><span className="workspace-trail">Flux</span></div>
   {children}
  </main>
 </div>
}