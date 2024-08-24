import { ITodoistTask } from "../../types/ITodoistTask";
import { IMyTodoistData } from "../../types/IMyTodoistData";

// Helper function to generate mock tasks
function createMockTask(id: number, parentId: string, projectId: string): ITodoistTask {

  const hour = Math.floor(Math.random() * 24);
  const minute =  Math.floor(Math.random() * 60);

  return {
    creatorId: `creator-${id}`,
    createdAt: new Date().toISOString(),
    assigneeId: `assignee-${id}`,
    assignerId: `assigner-${id}`,
    commentCount: Math.floor(Math.random() * 10),
    isCompleted: Math.random() > 0.5,
    content: `Task content ${id}`,
    description: `Description for task ${id}`,
    due: {
      date: `2023-09-${10}`,
      isRecurring: false,
      datetime: `2023-09-${10 + id}T${hour}:${minute}:00`,
      string: `Due date string for task ${id}`,
      timezone: 'UTC'
    },
    id: `task-${id}`,
    labels: [`label1-${id}`, `label2-${id}`],
    order: id,
    priority: Math.floor(Math.random() * 5),
    projectId: projectId,
    sectionId: `section-${id}`,
    parentId: parentId,
    url: `http://todoist.com/tasks/task-${id}`
  };
}

// Function to create a project with tasks
function createProject(projectId: string, project_name: string, numTasks: number): IMyTodoistData {
  const tasks = Array.from({ length: numTasks }, (_, i) => createMockTask(i + 1, `parent-${projectId}`, projectId));
  return {
    projectId: projectId,
    project_name: project_name,
    data: tasks
  };
}


export default function fakeEmailData(number: number): IMyTodoistData[] {
  const projects: IMyTodoistData[] = [];
  for (let i = 1; i <= number; i++) {
    projects.push(createProject(`project-${i}`, `Project Name ${i}`, 5)); // Assuming each project has 5 tasks
  }

  return projects;
}