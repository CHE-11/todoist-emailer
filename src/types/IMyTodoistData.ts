import { ITodoistTask } from "./ITodoistTask";

export interface IMyTodoistData {
  projectId: string;
  project_name: string;
  data: ITodoistTask[]
}
