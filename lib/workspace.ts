export type WorkspaceDoc={id:string;title:string;token:string;project:string;createdAt:string};
const KEY='guestdocs.workspace.v1',PROJECTS='guestdocs.projects.v1';
export function getDocs():WorkspaceDoc[]{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return []}}
export function saveDocs(docs:WorkspaceDoc[]){localStorage.setItem(KEY,JSON.stringify(docs))}
export function putDoc(doc:WorkspaceDoc){saveDocs([doc,...getDocs().filter(x=>x.id!==doc.id)])}
export function moveDoc(id:string,project:string){saveDocs(getDocs().map(d=>d.id===id?{...d,project}:d))}
export function getProjects():string[]{try{return JSON.parse(localStorage.getItem(PROJECTS)||'[]')}catch{return []}}
export function addProject(name:string){const items=getProjects();if(!items.includes(name))localStorage.setItem(PROJECTS,JSON.stringify([...items,name]))}
export function renameProject(oldName:string,next:string){if(getProjects().includes(next))return;localStorage.setItem(PROJECTS,JSON.stringify(getProjects().map(x=>x===oldName?next:x)));saveDocs(getDocs().map(d=>d.project===oldName?{...d,project:next}:d))}
export function removeProject(name:string){localStorage.setItem(PROJECTS,JSON.stringify(getProjects().filter(x=>x!==name)));saveDocs(getDocs().map(d=>d.project===name?{...d,project:''}:d))}
