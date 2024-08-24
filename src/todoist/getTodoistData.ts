
import { TodoistApi } from "@doist/todoist-api-typescript"
import dotenv from 'dotenv';
import { IMyProject, myProjects } from "../config/projects";
import { ITodoistTask } from "../types/ITodoistTask";
import { ITodoistProject } from "../types/ITodoistProject";
import { IMyTodoistData } from "../types/IMyTodoistData";

dotenv.config();

const api_key = process.env.TODOIST_API_KEY;
const api = new TodoistApi(api_key as string);

// Function to set the time part of a date to midnight
const setDateToMidnight = (date: Date | string | number) => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

// Helper function to compare dates by day
const isSameOrBefore = (date1: Date, date2: Date) => {
  const d1 = setDateToMidnight(date1);
  const d2 = setDateToMidnight(date2);
  return d1 <= d2;
};


export default async function getTodoistData(): Promise<any> {

  let tasks: IMyTodoistData[] = [];


  const isNightly = new Date().getHours() >= 12 ? true : false;

  const onlyUseTasksWithDueDates = process.env.ONLY_USE_TASKS_WITH_DUE_DATES === "true";
  const includePastDueTasks = process.env.INCLUDE_PAST_DUE_TASKS === "true";

  let projectsNotInConfig: ITodoistProject[] = [];

  try{
    const projects: ITodoistProject[] = await getTodoistProjects() as ITodoistProject[];

    // Check and see if there are any projects that are not in the config file by checking the projectIds and get the ones that are not in the config
    const myProjectIds = myProjects.map(project => project.id);
    projectsNotInConfig = projects.filter(project => !myProjectIds.includes(project.id));

    if (projectsNotInConfig.length > 0) {
      projectsNotInConfig.forEach(project => console.log(`Unknown Project -> Name: "${project.name}" with id: "${project.id}"`));
    }

    console.log("Thru Getting Projects");

    let allTasks: ITodoistTask[] = await getTodoistTasks() as ITodoistTask[];

    if (onlyUseTasksWithDueDates) {
      allTasks = allTasks.filter(task => task.due != null);
    }

    myProjects.filter(myProject => myProject.include).forEach((myProject: IMyProject) => {

      const daysToIncludeInFuture = isNightly ? myProject.daysToIncludeInFutureNightly : myProject.daysToIncludeInFutureMorning;
      const futureDateThreshold = setDateToMidnight(new Date());
      // @ts-ignore
      futureDateThreshold.setDate(futureDateThreshold.getDate() + daysToIncludeInFuture);

      // console.log(`Getting tasks for project: ${myProject.name} -> Future Date Threshold: ${futureDateThreshold}`);

      let filteredTasks = allTasks.filter(task => task.projectId === myProject.id);
      filteredTasks = filteredTasks.filter(task => task.due != null || includePastDueTasks);
      filteredTasks = filteredTasks.filter(task => !includePastDueTasks && task.due && task.due.date ? new Date(task.due.date) <= new Date() : true);
      filteredTasks = filteredTasks.filter(task => task.due && task.due.date ? isSameOrBefore(setDateToMidnight(task.due.date), futureDateThreshold) : true);

      // Sort by due date
      // @ts-ignore
      filteredTasks.sort((a, b) => new Date(a.due.date) - new Date(b.due.date));

      const todoistData: IMyTodoistData = {
        projectId: myProject.id,
        project_name: myProject.name,
        data: filteredTasks
      };

      tasks.push(todoistData);
    });


    console.log("Thru Getting Tasks");
    
  } catch (error) {
    console.error('Error getting Todoist data:', error);
    return [];
  }

  const returnData = {
    data: tasks,
    projectsNotInConfig: projectsNotInConfig,
  }

  return returnData;
}


async function getTodoistProjects(){
  try{
    const projects = await api.getProjects()
    return projects;
  } catch (error) {
    console.error('Error getting Todoist data:', error);
    return [];
  } 
}

async function getTodoistTasks(){
  try{
    const tasks = await api.getTasks()
    return tasks
  } catch (error) {
    console.error('Error getting Todoist data:', error);
    return [];
  } 
}
