export type WorkspaceDoc={id:string;title:string;token:string;project:string;createdAt:string};
const KEY='guestdocs.workspace.v1';
export function getDocs():WorkspaceDoc[]{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return []}}
export function putDoc(doc:WorkspaceDoc){const list=getDocs().filter(x=>x.id!==doc.id);localStorage.setItem(KEY,JSON.stringify([doc,...list]))}
export function getProjects():string[]{try{return JSON.parse(localStorage.getItem('guestdocs.projects.v1')||'[]')}catch{return []}}
export function addProject(name:string){const items=getProjects();if(!items.includes(name))localStorage.setItem('guestdocs.projects.v1',JSON.stringify([...items,name]))}
