import { Panel } from "./panel.interfaces";
import { Tag } from "./tag.interfaces";

export interface Accesses {
    id: number;
    code: string;
    date: string;
    time: string;
    reader:string;
    isAuthorized: boolean;
    door:string;
    panel:Panel;
    tag:Tag;
}