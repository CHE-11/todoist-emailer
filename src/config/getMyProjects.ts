
import { TodoistApi } from "@doist/todoist-api-typescript"
import dotenv from 'dotenv';

dotenv.config();

const api_key = process.env.TODOIST_API_KEY;
const api = new TodoistApi(api_key as string);

async function getMyProjects(){
  try{
    const projects = await api.getProjects()
    console.log(projects);
  } catch (error) {
    console.error('Error getting Todoist data:', error);
  } 
}

getMyProjects();