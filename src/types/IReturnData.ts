import { IMyTodoistData } from "./IMyTodoistData";
import { ITodoistProject } from "./ITodoistProject";


export interface IReturnData {
  data: IMyTodoistData[];
  projectsNotInConfig: ITodoistProject[];
}


